"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizProps {
  questions: Question[];
  passingScore?: number; // par défaut 70
  lessonId?: string; // ID de la leçon (ex: "introduction-finance-entreprise")
  moduleId?: string; // ID du module (ex: "finance-entreprise/fondamentaux")
  onQuizPassed?: (passed: boolean) => void; // Callback appelé quand le quiz est soumis
}

export default function Quiz({ questions, passingScore = 70, lessonId, moduleId, onQuizPassed }: QuizProps) {
  const { user } = useUser();
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [hasPassed, setHasPassed] = useState(false);

  // Charger les résultats depuis Supabase ou localStorage au montage
  useEffect(() => {
    const loadResults = async () => {
      if (user && lessonId && moduleId) {
        // Essayer de charger depuis Supabase
        try {
          const supabase = createSupabaseBrowserClient();
          const { data, error } = await supabase
            .from("quiz_results")
            .select("*")
            .eq("user_id", user.id)
            .eq("lesson_id", lessonId)
            .eq("module_id", moduleId)
            .maybeSingle();

          if (!error && data) {
            setScore(data.score);
            setHasPassed(data.passed);
            setIsSubmitted(true);
            setSelectedAnswers((data.answers as Record<number, string>) || {});
            return;
          }
        } catch (error) {
          console.error("Erreur lors du chargement du résultat du quiz depuis Supabase:", error);
        }
      }

      // Fallback : charger depuis localStorage
      const savedResult = localStorage.getItem(`quiz-result-${lessonId || "default"}`);
      if (savedResult) {
        try {
          const parsed = JSON.parse(savedResult);
          if (parsed.questionsCount === questions.length) {
            setScore(parsed.score);
            setHasPassed(parsed.hasPassed);
            setIsSubmitted(true);
            setSelectedAnswers(parsed.answers || {});
          }
        } catch (error) {
          console.error("Erreur lors du chargement du résultat du quiz:", error);
        }
      }
    };

    loadResults();
  }, [user, lessonId, moduleId, questions.length]);

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    if (!isSubmitted) {
      setSelectedAnswers((prev) => ({
        ...prev,
        [questionIndex]: answer,
      }));
    }
  };

  const handleSubmit = async () => {
    // Calculer le score
    let correctCount = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / questions.length) * 100);
    const passed = calculatedScore >= passingScore;

    setScore(calculatedScore);
    setHasPassed(passed);
    setIsSubmitted(true);

    // Sauvegarder dans Supabase si l'utilisateur est connecté
    if (user && lessonId && moduleId) {
      try {
        const supabase = createSupabaseBrowserClient();
        await supabase
          .from("quiz_results")
          .upsert(
            {
              user_id: user.id,
              lesson_id: lessonId,
              module_id: moduleId,
              score: calculatedScore,
              passed: passed,
              answers: selectedAnswers,
              questions_count: questions.length,
            },
            {
              onConflict: "user_id,lesson_id,module_id",
            }
          );
      } catch (error) {
        console.error("Erreur lors de la sauvegarde du résultat du quiz dans Supabase:", error);
      }
    }

    // Sauvegarder aussi dans localStorage comme cache local
    const result = {
      score: calculatedScore,
      hasPassed: passed,
      answers: selectedAnswers,
      questionsCount: questions.length,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(`quiz-result-${lessonId || "default"}`, JSON.stringify(result));

    // Appeler le callback si fourni
    if (onQuizPassed) {
      onQuizPassed(passed);
    }
  };

  const handleReset = async () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScore(null);
    setHasPassed(false);
    localStorage.removeItem(`quiz-result-${lessonId || "default"}`);

    // Supprimer aussi de Supabase si l'utilisateur est connecté
    if (user && lessonId && moduleId) {
      try {
        const supabase = createSupabaseBrowserClient();
        await supabase
          .from("quiz_results")
          .delete()
          .eq("user_id", user.id)
          .eq("lesson_id", lessonId)
          .eq("module_id", moduleId);
      } catch (error) {
        console.error("Erreur lors de la suppression du résultat du quiz dans Supabase:", error);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Quiz</h3>

      <div className="space-y-8">
        {questions.map((question, questionIndex) => {
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
                <h4 className="text-lg font-semibold text-gray-900 flex-1">
                  {question.question}
                </h4>
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
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={Object.keys(selectedAnswers).length !== questions.length}
            className="px-6 py-3 bg-[#F5B301] text-[#0A2540] font-semibold rounded-md hover:bg-[#e3a500] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Valider mes réponses
          </button>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          <div
            className={`rounded-lg p-6 text-center ${
              hasPassed
                ? "bg-green-50 border-2 border-green-400"
                : "bg-red-50 border-2 border-red-400"
            }`}
          >
            <div className="text-4xl mb-3">{hasPassed ? "✅" : "❌"}</div>
            <p className="text-xl font-bold text-gray-900 mb-2">
              Score : {score}%
            </p>
            {hasPassed ? (
              <p className="text-green-700 font-semibold">
                Bravo ! Tu as validé le quiz avec {score}% de bonnes réponses.
              </p>
            ) : (
              <p className="text-red-700 font-semibold">
                Tu as obtenu {score}%. Revois tes cours et réessaie.
              </p>
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

      {!isSubmitted && Object.keys(selectedAnswers).length < questions.length && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          {questions.length - Object.keys(selectedAnswers).length} question
          {questions.length - Object.keys(selectedAnswers).length > 1 ? "s" : ""} restante
          {questions.length - Object.keys(selectedAnswers).length > 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}
