"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { completeLessonForUser } from "@/lib/progress";
import { calculateLevel } from "@/lib/gamification";
import type { ExamCase } from "@/data/examCasesFinanceEntreprise";
import type { ExamCase as ExamCaseAnalyse } from "@/data/examCasesAnalyseFinanciere";
import type { ExamCase as ExamCaseInvestissement } from "@/data/examCasesInvestissementValorisation";

type ExamCaseUnion = ExamCase | ExamCaseAnalyse | ExamCaseInvestissement;

const isInvestmentData = (
  data: ExamCaseUnion["data"]
): data is ExamCaseInvestissement["data"] =>
  "investissementInitial" in data;

interface ModuleExamProps {
  examCase: ExamCaseUnion;
  onComplete?: (score: number, passed: boolean) => void;
  onReset?: () => void;
  moduleId?: string; // ID du module (ex: "finance-entreprise/fondamentaux")
}

export default function ModuleExam({ examCase, onComplete, onReset, moduleId }: ModuleExamProps) {
  const { user } = useUser();
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [hasPassed, setHasPassed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Charger les résultats depuis Supabase ou localStorage au montage
  // Utiliser une clé unique pour forcer la réinitialisation quand le cas change
  useEffect(() => {
    const loadResults = async () => {
      // Réinitialiser l'état d'abord
      setSelectedAnswers({});
      setIsSubmitted(false);
      setScore(null);
      setHasPassed(false);

      if (user && moduleId) {
        // Essayer de charger depuis Supabase
        try {
          const supabase = createSupabaseBrowserClient();
          const { data, error } = await supabase
            .from("exam_results")
            .select("*")
            .eq("user_id", user.id)
            .eq("module_id", moduleId)
            .eq("exam_case_id", examCase.id)
            .maybeSingle();

          if (!error && data && data.passed) {
            // Ne charger que si l'examen est réussi (pour éviter de recharger un échec)
            setScore(data.score);
            setHasPassed(data.passed);
            setIsSubmitted(true);
            setSelectedAnswers((data.answers as Record<number, string>) || {});
            return;
          }
        } catch (error) {
          console.error("Erreur lors du chargement du résultat de l'examen depuis Supabase:", error);
        }
      }

      // Fallback : charger depuis localStorage uniquement si l'examen est réussi
      const savedResult = localStorage.getItem(`exam-result-${examCase.id}`);
      if (savedResult) {
        try {
          const parsed = JSON.parse(savedResult);
          if (parsed.examCaseId === examCase.id && parsed.hasPassed) {
            // Ne charger que si l'examen est réussi
            setScore(parsed.score);
            setHasPassed(parsed.hasPassed);
            setIsSubmitted(true);
            setSelectedAnswers(parsed.answers || {});
          }
        } catch (error) {
          console.error("Erreur lors du chargement du résultat de l'examen:", error);
        }
      }
    };

    loadResults();
  }, [user, moduleId, examCase.id]);

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    if (!isSubmitted) {
      setSelectedAnswers((prev) => ({
        ...prev,
        [questionIndex]: answer,
      }));
    }
  };

  const handleSubmit = async () => {
    if (isProcessing) return;

    setIsProcessing(true);

    // Calculer le score
    let correctCount = 0;
    examCase.questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / examCase.questions.length) * 100);
    const passed = calculatedScore >= 70;

    setScore(calculatedScore);
    setHasPassed(passed);
    setIsSubmitted(true);

    // Sauvegarder dans Supabase si l'utilisateur est connecté
    if (user && moduleId) {
      try {
        const supabase = createSupabaseBrowserClient();
        await supabase
          .from("exam_results")
          .upsert(
            {
              user_id: user.id,
              module_id: moduleId,
              exam_case_id: examCase.id,
              score: calculatedScore,
              passed: passed,
              answers: selectedAnswers,
              questions_count: examCase.questions.length,
            },
            {
              onConflict: "user_id,module_id,exam_case_id",
            }
          );
      } catch (error) {
        console.error("Erreur lors de la sauvegarde du résultat de l'examen dans Supabase:", error);
      }
    }

    // Sauvegarder aussi dans localStorage comme cache local
    const result = {
      score: calculatedScore,
      hasPassed: passed,
      answers: selectedAnswers,
      examCaseId: examCase.id,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(`exam-result-${examCase.id}`, JSON.stringify(result));

    // Si l'examen est réussi, attribuer le badge et l'XP
    if (passed && user) {
      try {
        const supabase = createSupabaseBrowserClient();

        // Déterminer le badge et l'XP selon le module
        let badgeCode = "analyste_junior";
        let xpAmount = 500;
        
        if (moduleId?.includes("analyse-financiere")) {
          badgeCode = "analyste_confirme";
          xpAmount = 750;
        } else if (moduleId?.includes("investissement-valorisation")) {
          badgeCode = "expert_finance";
          xpAmount = 1000;
        }

        // Vérifier si le badge existe déjà
        const { data: existingBadges } = await supabase
          .from("user_badges")
          .select("badge_code")
          .eq("user_id", user.id)
          .eq("badge_code", badgeCode)
          .maybeSingle();

        if (!existingBadges) {
          // Créer le badge
          await supabase.from("user_badges").insert({
            user_id: user.id,
            badge_code: badgeCode,
          });
        }

        // Attribuer l'XP
        const { data: profile } = await supabase
          .from("profiles")
          .select("xp")
          .eq("id", user.id)
          .single();

        if (profile) {
          const newXP = (profile.xp || 0) + xpAmount;
          const newLevel = calculateLevel(newXP);

          await supabase
            .from("profiles")
            .update({
              xp: newXP,
              level: newLevel,
            })
            .eq("id", user.id);
        }
      } catch (error) {
        console.error("Erreur lors de l'attribution du badge et de l'XP:", error);
      }
    }

    if (onComplete) {
      onComplete(calculatedScore, passed);
    }

    setIsProcessing(false);
  };

  const handleReset = async () => {
    // Réinitialiser l'état local d'abord
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScore(null);
    setHasPassed(false);
    
    // Supprimer de localStorage
    localStorage.removeItem(`exam-result-${examCase.id}`);

    // Supprimer aussi de Supabase si l'utilisateur est connecté
    if (user && moduleId) {
      try {
        const supabase = createSupabaseBrowserClient();
        // Supprimer tous les résultats d'examen pour ce module (pas seulement le cas actuel)
        // pour éviter de recharger un ancien résultat
        await supabase
          .from("exam_results")
          .delete()
          .eq("user_id", user.id)
          .eq("module_id", moduleId);
      } catch (error) {
        console.error("Erreur lors de la suppression du résultat de l'examen dans Supabase:", error);
      }
    }
    
    // Appeler le callback pour régénérer un nouveau cas
    // Le callback va changer examCase, ce qui déclenchera le useEffect pour réinitialiser complètement
    if (onReset) {
      onReset();
    }
  };

  // Formater les nombres pour l'affichage
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat("fr-FR").format(num);
  };

  const investmentData = isInvestmentData(examCase.data) ? examCase.data : null;
  const hasTimeSeriesData = Array.isArray((examCase.data as { chiffreAffaires?: unknown }).chiffreAffaires);
  const timeSeriesData = hasTimeSeriesData ? (examCase.data as ExamCaseAnalyse["data"]) : null;
  const corporateData = !hasTimeSeriesData && !investmentData ? (examCase.data as ExamCase["data"]) : null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{examCase.title}</h2>
        <p className="text-gray-700 leading-relaxed mb-6">{examCase.description}</p>

        {/* Données de l'entreprise */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {hasTimeSeriesData
              ? "Données financières sur 3 ans"
              : investmentData
              ? "Données du projet / de l'entreprise"
              : "Données financières"}
          </h3>
          {/* Module 3 : Cas avec investissementInitial, fluxTresorerie, etc. */}
          {investmentData ? (
            // Affichage pour les cas du Module 3 (VAN/TRI, DCF, M&A, etc.)
            <div className="space-y-4">
              {investmentData.investissementInitial !== undefined && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Investissement initial</p>
                    <p className="text-lg font-semibold text-gray-900">{formatNumber(investmentData.investissementInitial)} €</p>
                  </div>
                  {investmentData.fluxTresorerie && (
                    <div>
                      <p className="text-sm text-gray-600">Flux de trésorerie</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {investmentData.fluxTresorerie.map((flux, index) => (
                          <span key={index}>
                            {formatNumber(flux)} €{index < investmentData.fluxTresorerie!.length - 1 ? " • " : ""}
                          </span>
                        ))}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {investmentData.coutCapital !== undefined && (
                <div>
                  <p className="text-sm text-gray-600">Coût du capital</p>
                  <p className="text-lg font-semibold text-gray-900">{(investmentData.coutCapital * 100).toFixed(1)}%</p>
                </div>
              )}

              {investmentData.fcf && (
                <div>
                  <p className="text-sm text-gray-600">Free Cash Flow (FCF)</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {investmentData.fcf.map((flux, index) => (
                      <span key={index}>
                        {formatNumber(flux)} €{index < investmentData.fcf!.length - 1 ? " • " : ""}
                      </span>
                    ))}
                  </p>
                </div>
              )}

              {investmentData.tauxCroissance !== undefined && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Taux de croissance à long terme</p>
                  <p className="text-lg font-semibold text-gray-900">{(investmentData.tauxCroissance * 100).toFixed(1)}%</p>
                </div>
              )}

              {investmentData.valeurStandalone !== undefined && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Valeur stand alone</p>
                    <p className="text-lg font-semibold text-gray-900">{formatNumber(investmentData.valeurStandalone)} €</p>
                  </div>
                  {investmentData.valeurMarche !== undefined && (
                    <div>
                      <p className="text-sm text-gray-600">Valeur de marché</p>
                      <p className="text-lg font-semibold text-gray-900">{formatNumber(investmentData.valeurMarche)} €</p>
                    </div>
                  )}
                  {investmentData.prixPropose !== undefined && (
                    <div>
                      <p className="text-sm text-gray-600">Prix proposé</p>
                      <p className="text-lg font-semibold text-gray-900">{formatNumber(investmentData.prixPropose)} €</p>
                    </div>
                  )}
                  {investmentData.synergiesAttendues !== undefined && (
                    <div>
                      <p className="text-sm text-gray-600">Synergies attendues</p>
                      <p className="text-lg font-semibold text-gray-900">{formatNumber(investmentData.synergiesAttendues)} €</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : timeSeriesData ? (
            // Affichage pour les cas avec données sur 3 ans (Module 2)
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left py-2 px-3 font-semibold text-gray-900">Indicateur</th>
                    <th className="text-right py-2 px-3 font-semibold text-gray-900">N-2</th>
                    <th className="text-right py-2 px-3 font-semibold text-gray-900">N-1</th>
                    <th className="text-right py-2 px-3 font-semibold text-gray-900">N</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 px-3 text-gray-700">Chiffre d&apos;affaires</td>
                    <td className="text-right py-2 px-3 font-semibold text-gray-900">{formatNumber(timeSeriesData.chiffreAffaires[0])} €</td>
                    <td className="text-right py-2 px-3 font-semibold text-gray-900">{formatNumber(timeSeriesData.chiffreAffaires[1])} €</td>
                    <td className="text-right py-2 px-3 font-semibold text-gray-900">{formatNumber(timeSeriesData.chiffreAffaires[2])} €</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 px-3 text-gray-700">Résultat net</td>
                    <td className="text-right py-2 px-3 font-semibold text-gray-900">{formatNumber(timeSeriesData.resultatNet[0])} €</td>
                    <td className="text-right py-2 px-3 font-semibold text-gray-900">{formatNumber(timeSeriesData.resultatNet[1])} €</td>
                    <td className="text-right py-2 px-3 font-semibold text-gray-900">{formatNumber(timeSeriesData.resultatNet[2])} €</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 px-3 text-gray-700">Résultat d&apos;exploitation</td>
                    <td className="text-right py-2 px-3 font-semibold text-gray-900">{formatNumber(timeSeriesData.resultatExploitation[0])} €</td>
                    <td className="text-right py-2 px-3 font-semibold text-gray-900">{formatNumber(timeSeriesData.resultatExploitation[1])} €</td>
                    <td className="text-right py-2 px-3 font-semibold text-gray-900">{formatNumber(timeSeriesData.resultatExploitation[2])} €</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 px-3 text-gray-700">Amortissements</td>
                    <td className="text-right py-2 px-3 font-semibold text-gray-900">{formatNumber(timeSeriesData.amortissements[0])} €</td>
                    <td className="text-right py-2 px-3 font-semibold text-gray-900">{formatNumber(timeSeriesData.amortissements[1])} €</td>
                    <td className="text-right py-2 px-3 font-semibold text-gray-900">{formatNumber(timeSeriesData.amortissements[2])} €</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 px-3 text-gray-700">Actif total</td>
                    <td className="text-right py-2 px-3 font-semibold text-gray-900">{formatNumber(timeSeriesData.actifTotal[0])} €</td>
                    <td className="text-right py-2 px-3 font-semibold text-gray-900">{formatNumber(timeSeriesData.actifTotal[1])} €</td>
                    <td className="text-right py-2 px-3 font-semibold text-gray-900">{formatNumber(timeSeriesData.actifTotal[2])} €</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 px-3 text-gray-700">Capitaux propres</td>
                    <td className="text-right py-2 px-3 font-semibold text-gray-900">{formatNumber(timeSeriesData.capitauxPropres[0])} €</td>
                    <td className="text-right py-2 px-3 font-semibold text-gray-900">{formatNumber(timeSeriesData.capitauxPropres[1])} €</td>
                    <td className="text-right py-2 px-3 font-semibold text-gray-900">{formatNumber(timeSeriesData.capitauxPropres[2])} €</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 px-3 text-gray-700">Dettes financières</td>
                    <td className="text-right py-2 px-3 font-semibold text-gray-900">{formatNumber(timeSeriesData.dettesFinancieres[0])} €</td>
                    <td className="text-right py-2 px-3 font-semibold text-gray-900">{formatNumber(timeSeriesData.dettesFinancieres[1])} €</td>
                    <td className="text-right py-2 px-3 font-semibold text-gray-900">{formatNumber(timeSeriesData.dettesFinancieres[2])} €</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-gray-700">Flux de trésorerie d&apos;exploitation</td>
                    <td className="text-right py-2 px-3 font-semibold text-gray-900">{formatNumber(timeSeriesData.fluxTresorerieExploitation[0])} €</td>
                    <td className="text-right py-2 px-3 font-semibold text-gray-900">{formatNumber(timeSeriesData.fluxTresorerieExploitation[1])} €</td>
                    <td className="text-right py-2 px-3 font-semibold text-gray-900">{formatNumber(timeSeriesData.fluxTresorerieExploitation[2])} €</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : corporateData ? (
            // Affichage pour les cas avec données sur 1 an (Module 1)
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Chiffre d&apos;affaires</p>
                <p className="text-lg font-semibold text-gray-900">{formatNumber(corporateData.chiffreAffaires)} €</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Résultat net</p>
                <p className="text-lg font-semibold text-gray-900">{formatNumber(corporateData.resultatNet)} €</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Actif total</p>
                <p className="text-lg font-semibold text-gray-900">{formatNumber(corporateData.actifTotal)} €</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Capitaux propres</p>
                <p className="text-lg font-semibold text-gray-900">{formatNumber(corporateData.capitauxPropres)} €</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Dettes financières</p>
                <p className="text-lg font-semibold text-gray-900">{formatNumber(corporateData.dettesFinancieres)} €</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Taux d&apos;imposition</p>
                <p className="text-lg font-semibold text-gray-900">{(corporateData.tauxImposition * 100).toFixed(0)}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Coût des fonds propres</p>
                <p className="text-lg font-semibold text-gray-900">{(corporateData.coutFondsPropres * 100).toFixed(0)}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Coût de la dette</p>
                <p className="text-lg font-semibold text-gray-900">{(corporateData.coutDette * 100).toFixed(0)}%</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6 mb-8">
        {examCase.questions.map((question, questionIndex) => {
          const isCorrect = selectedAnswers[questionIndex] === question.correctAnswer;
          const userAnswer = selectedAnswers[questionIndex];

          return (
            <div
              key={questionIndex}
              className={`border rounded-lg p-5 ${
                isSubmitted
                  ? isCorrect
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-start gap-3 mb-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0A2540] text-white flex items-center justify-center text-sm font-bold">
                  {questionIndex + 1}
                </span>
                <h4 className="text-lg font-semibold text-gray-900 flex-1">{question.question}</h4>
              </div>

              <div className="space-y-3 ml-11">
                {question.options.map((option, optionIndex) => {
                  const isSelected = userAnswer === option;
                  const isCorrectOption = option === question.correctAnswer;

                  return (
                    <label
                      key={optionIndex}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                        isSubmitted
                          ? isCorrectOption
                            ? "bg-green-100 border-2 border-green-400"
                            : isSelected && !isCorrectOption
                            ? "bg-red-100 border-2 border-red-400"
                            : "bg-gray-50 border-2 border-transparent"
                          : isSelected
                          ? "bg-blue-50 border-2 border-[#0A2540]"
                          : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
                      } ${isSubmitted ? "cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <input
                        type="radio"
                        name={`question-${questionIndex}`}
                        value={option}
                        checked={isSelected}
                        onChange={() => handleAnswerChange(questionIndex, option)}
                        disabled={isSubmitted}
                        className="w-4 h-4 text-[#0A2540] focus:ring-[#0A2540] focus:ring-2"
                      />
                      <span className="flex-1 text-gray-900">{option}</span>
                      {isSubmitted && isCorrectOption && (
                        <span className="text-green-600 font-bold">✓</span>
                      )}
                      {isSubmitted && isSelected && !isCorrectOption && (
                        <span className="text-red-600 font-bold">✗</span>
                      )}
                    </label>
                  );
                })}
              </div>

              {isSubmitted && !isCorrect && (
                <div className="mt-3 ml-11 text-sm text-gray-600">
                  <span className="font-semibold">Bonne réponse :</span>{" "}
                  <span className="text-green-700">{question.correctAnswer}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!isSubmitted ? (
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={
              Object.keys(selectedAnswers).length !== examCase.questions.length || isProcessing
            }
            className="px-6 py-3 bg-[#F5B301] text-[#0A2540] font-semibold rounded-md hover:bg-[#e3a500] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Validation..." : "Valider mes réponses"}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div
            className={`rounded-lg p-6 text-center ${
              hasPassed
                ? "bg-green-50 border-2 border-green-400"
                : "bg-red-50 border-2 border-red-400"
            }`}
          >
            <div className="text-4xl mb-3">{hasPassed ? "✅" : "❌"}</div>
            <p className="text-xl font-bold text-gray-900 mb-2">Score : {score}%</p>
            {hasPassed ? (
              <div>
                <p className="text-green-700 font-semibold mb-2">
                  Examen réussi — tu obtiens le badge Analyste Junior 🎓
                </p>
                <p className="text-green-600 text-sm">+500 XP attribués !</p>
              </div>
            ) : (
              <div>
                <p className="text-red-700 font-semibold mb-2">
                  Examen échoué, révise et réessaie.
                </p>
                <p className="text-red-600 text-sm">
                  Un nouveau cas d&apos;examen sera sélectionné aléatoirement.
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300 transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      )}

      {!isSubmitted && Object.keys(selectedAnswers).length < examCase.questions.length && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          {examCase.questions.length - Object.keys(selectedAnswers).length} question
          {examCase.questions.length - Object.keys(selectedAnswers).length > 1 ? "s" : ""} restante
          {examCase.questions.length - Object.keys(selectedAnswers).length > 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}

