"use client";

import { Suspense, useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { jobs } from "@/data/jobs";
import RadarChart from "@/components/RadarChart";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/useUser";

type PerQuestionEvaluation = {
  questionIndex: number;
  estimatedScore: number;
  strengths: string[];
  weaknesses: string[];
  missingElements?: string[];
  recommendedActions: string[];
};

type FeedbackData = {
  globalScore: number;
  verdict: string;
  riskLevel: "faible" | "modéré" | "élevé" | string;
  scores: {
    pertinenceTechnique: number;
    clarte: number;
    confianceOrale: number;
    vocabulaireProfessionnel: number;
  };
  perQuestion: PerQuestionEvaluation[];
  pointsForts: string[];
  pointsAmelioration: string[];
  suggestions: string[];
  commentaireGeneral: string;
};

type VisualFeedbackData = {
  summary: string;
  attire?: string;
  posture?: string;
  eyeContact?: string;
  facialExpression?: string;
  environment?: string;
  confidenceLevel?: string;
  riskFlags?: string[];
  tips?: string[];
};

type ResponseDetail = {
  questionIndex: number;
  questionText: string;
  transcript: string;
  snapshotUrl?: string;
  recordingUrl?: string;
  visualFeedback?: VisualFeedbackData | null;
};

type InterviewData = {
  runId?: string;
  jobId: string;
  jobTitle: string;
  careerPath: string;
  questions: string[];
  transcriptions: string[];
  responses: ResponseDetail[];
  feedback: FeedbackData;
  completedAt: string;
};

const EMPTY_FEEDBACK: FeedbackData = {
  globalScore: 0,
  verdict: "Analyse en cours",
  riskLevel: "modéré",
  scores: {
    pertinenceTechnique: 0,
    clarte: 0,
    confianceOrale: 0,
    vocabulaireProfessionnel: 0,
  },
  perQuestion: [],
  pointsForts: [],
  pointsAmelioration: [],
  suggestions: [],
  commentaireGeneral: "Feedback en cours de génération.",
};

function FeedbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const jobIdFromQuery = searchParams.get("job");
  const runIdParam = searchParams.get("run");
  const { user, loading: userLoading } = useUser();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  
  const [interviewData, setInterviewData] = useState<InterviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fallbackFromSession = () => {
      const data = sessionStorage.getItem("interview_feedback");
      if (data) {
        try {
          const parsed = JSON.parse(data);
          const responses: ResponseDetail[] = parsed.responses ?? (parsed.questions ?? []).map((question: string, index: number) => ({
            questionIndex: index,
            questionText: question,
            transcript: parsed.transcriptions?.[index] ?? "",
          }));
          setInterviewData({
            ...parsed,
            feedback: {
              ...EMPTY_FEEDBACK,
              ...(parsed.feedback ?? {}),
            },
            responses,
          });
        } catch (error) {
          console.error("Erreur parsing fallback feedback", error);
        }
      }
      setIsLoading(false);
    };

    if (!runIdParam) {
      fallbackFromSession();
      return;
    }

    if (userLoading) {
      return;
    }

    if (!user) {
      setFetchError("Vous devez être connecté pour consulter vos feedbacks.");
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const fetchRun = async () => {
      try {
        setIsLoading(true);
        setFetchError(null);

        const { data: run, error: runError } = await supabase
          .from("interview_runs")
          .select("id, job_id, job_title, career_path, feedback_json, completed_at, total_questions")
          .eq("id", runIdParam)
          .eq("user_id", user.id)
          .single();

        if (cancelled) return;

        if (runError || !run) {
          console.error("Erreur récupération run", runError);
          setFetchError("Impossible de récupérer cette simulation.");
          setInterviewData(null);
          setIsLoading(false);
          return;
        }

        const { data: responses, error: responsesError } = await supabase
          .from("interview_responses")
          .select("question_index, question_text, transcript, snapshot_url, recording_url, visual_feedback_json")
          .eq("run_id", run.id)
          .eq("is_active", true)
          .order("question_index", { ascending: true });

        if (cancelled) return;

        if (responsesError) {
          console.error("Erreur récupération réponses", responsesError);
          setFetchError("Impossible de récupérer les réponses de la simulation.");
          setInterviewData(null);
          setIsLoading(false);
          return;
        }

        const sortedResponses = responses ?? [];

        const responsesWithUrls: ResponseDetail[] = [];
        for (const response of sortedResponses) {
          const questionIndex = response.question_index ?? 0;
          const snapshotPath = response.snapshot_url as string | null;
          const recordingPath = response.recording_url as string | null;

          let snapshotUrl: string | undefined;
          let recordingUrl: string | undefined;

          if (snapshotPath) {
            const { data: snapshotSigned } = await supabase
              .storage
              .from("interview-recordings")
              .createSignedUrl(snapshotPath, 3600);
            if (snapshotSigned?.signedUrl) {
              snapshotUrl = snapshotSigned.signedUrl;
            }
          }

          if (recordingPath) {
            const { data: recordingSigned } = await supabase
              .storage
              .from("interview-recordings")
              .createSignedUrl(recordingPath, 3600);
            if (recordingSigned?.signedUrl) {
              recordingUrl = recordingSigned.signedUrl;
            }
          }

          responsesWithUrls.push({
            questionIndex,
            questionText: response.question_text ?? "",
            transcript: response.transcript ?? "",
            snapshotUrl,
            recordingUrl,
            visualFeedback: (response.visual_feedback_json as VisualFeedbackData | null) ?? null,
          });
        }

        setInterviewData({
          runId: run.id,
          jobId: run.job_id ?? jobIdFromQuery ?? "",
          jobTitle: run.job_title ?? "",
          careerPath: run.career_path ?? "",
          questions: sortedResponses.map((r) => r.question_text ?? ""),
          transcriptions: sortedResponses.map((r) => r.transcript ?? ""),
          responses: responsesWithUrls,
          feedback: (run.feedback_json as FeedbackData | null) ?? EMPTY_FEEDBACK,
          completedAt: run.completed_at ?? new Date().toISOString(),
        });
        setIsLoading(false);
      } catch (error) {
        if (cancelled) return;
        console.error("Erreur inattendue feedback", error);
        setFetchError("Erreur inattendue lors du chargement de la simulation.");
        setIsLoading(false);
      }
    };

    fetchRun();

    return () => {
      cancelled = true;
    };
  }, [runIdParam, user, userLoading, supabase, jobIdFromQuery]);

  if (isLoading) {
    return (
      <main className="bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 md:px-6 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      </main>
    );
  }

  if (fetchError) {
    return (
      <main className="bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-primary mb-4">{fetchError}</h1>
            <p className="text-gray-600 mb-8">Si le problème persiste, relancez une simulation.</p>
            <Link
              href="/entretien-ia"
              className="inline-block px-8 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-all shadow-lg"
            >
              Retourner aux simulations
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!interviewData) {
    return (
      <main className="bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-primary mb-4">Aucune donnée disponible</h1>
            <p className="text-gray-600 mb-8">Veuillez d&apos;abord compléter une simulation.</p>
            <Link
              href="/entretien-ia"
              className="inline-block px-8 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-all shadow-lg"
            >
              Commencer une simulation
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const jobId = interviewData.jobId ?? jobIdFromQuery ?? "";
  const selectedJob = jobs.find((j) => j.id === jobId);
  const { feedback } = interviewData;
  const scoreColor = feedback.globalScore >= 80 ? "green" : feedback.globalScore >= 60 ? "blue" : feedback.globalScore >= 40 ? "yellow" : "red";
  const scoreColorClasses = {
    green: "from-green-500 to-green-600",
    blue: "from-blue-500 to-blue-600",
    yellow: "from-yellow-500 to-yellow-600",
    red: "from-red-500 to-red-600",
  };

  return (
    <main className="bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Header avec score global */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className={`w-32 h-32 bg-gradient-to-br ${scoreColorClasses[scoreColor]} rounded-full flex flex-col items-center justify-center mx-auto mb-6 shadow-xl`}>
            <span className="text-5xl font-bold text-white">{feedback.globalScore}</span>
            <span className="text-sm text-white/90">/ 100</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Votre feedback personnalisé
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {interviewData.jobTitle}
          </p>
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-center sm:gap-6 text-sm text-gray-600">
            <span>
              <span className="font-semibold text-gray-800">Verdict :</span> {feedback.verdict}
            </span>
            <span>
              <span className="font-semibold text-gray-800">Niveau de risque :</span> {feedback.riskLevel}
            </span>
          </div>
        </motion.div>

        {/* Commentaire général */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            Commentaire général
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            {feedback.commentaireGeneral}
          </p>
        </motion.div>

        {/* Graphique radar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-primary mb-6 text-center">
            Analyse détaillée de votre performance
          </h2>
          <RadarChart scores={feedback.scores} />
          
          {/* Scores détaillés */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="text-center p-4 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl">
              <p className="text-3xl font-bold text-primary mb-1">{feedback.scores.pertinenceTechnique}</p>
              <p className="text-sm text-gray-600">Pertinence technique</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl">
              <p className="text-3xl font-bold text-primary mb-1">{feedback.scores.clarte}</p>
              <p className="text-sm text-gray-600">Clarté & structure</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl">
              <p className="text-3xl font-bold text-primary mb-1">{feedback.scores.confianceOrale}</p>
              <p className="text-sm text-gray-600">Confiance orale</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl">
              <p className="text-3xl font-bold text-primary mb-1">{feedback.scores.vocabulaireProfessionnel}</p>
              <p className="text-sm text-gray-600">Vocabulaire pro.</p>
            </div>
          </div>
        </motion.div>

        {/* Points forts et points d'amélioration */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Points forts */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8"
          >
            <h2 className="text-2xl font-bold text-green-600 mb-6 flex items-center gap-3">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Points forts
            </h2>
            <ul className="space-y-4">
              {feedback.pointsForts.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Points d'amélioration */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8"
          >
            <h2 className="text-2xl font-bold text-amber-600 mb-6 flex items-center gap-3">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Points d&apos;amélioration
            </h2>
            <ul className="space-y-4">
              {feedback.pointsAmelioration.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Recommandations pour progresser
          </h2>
          <ul className="space-y-4">
            {feedback.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-3 p-4 bg-gradient-to-r from-primary/5 to-transparent rounded-xl border-l-4 border-primary">
                <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-sm font-bold">
                  {index + 1}
                </div>
                <span className="text-gray-700 leading-relaxed">{suggestion}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {feedback.perQuestion && feedback.perQuestion.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Synthèse critique par question
            </h2>
            <div className="space-y-6">
              {feedback.perQuestion.map((item) => (
                <div key={`pq-${item.questionIndex}`} className="border border-gray-200 rounded-xl p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-[0.28em]">
                      Question {item.questionIndex + 1}
                    </p>
                    <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                      Score estimé : {item.estimatedScore}/100
                    </span>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-green-700 mb-2">
                        Points solides
                      </p>
                      <ul className="space-y-1 text-sm text-green-800">
                        {item.strengths.map((strength, idx) => (
                          <li key={`strength-${item.questionIndex}-${idx}`}>• {strength}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-red-700 mb-2">
                        Points faibles
                      </p>
                      <ul className="space-y-1 text-sm text-red-800">
                        {item.weaknesses.map((weakness, idx) => (
                          <li key={`weakness-${item.questionIndex}-${idx}`}>• {weakness}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  {item.missingElements && item.missingElements.length > 0 && (
                    <div className="mt-4 bg-amber-50 border border-amber-100 rounded-lg p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-700 mb-2">
                        Points non abordés / angles morts
                      </p>
                      <ul className="space-y-1 text-sm text-amber-800">
                        {item.missingElements.map((missing, idx) => (
                          <li key={`missing-${item.questionIndex}-${idx}`}>• {missing}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-700 mb-2">
                      Actions immédiates
                    </p>
                    <ul className="space-y-1 text-sm text-blue-800">
                      {item.recommendedActions.map((action, idx) => (
                        <li key={`action-${item.questionIndex}-${idx}`}>• {action}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {interviewData.responses?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-primary mb-6">
              Analyse par question (audio & visuel)
            </h2>
            <div className="space-y-6">
              {interviewData.responses.map((response) => (
                <div
                  key={`response-${response.questionIndex}`}
                  className="border border-gray-200 rounded-xl p-6 grid gap-6 lg:grid-cols-[240px,1fr]"
                >
                  <div className="flex flex-col items-center gap-3">
                    {response.snapshotUrl ? (
                      <img
                        src={response.snapshotUrl}
                        alt={`Capture question ${response.questionIndex + 1}`}
                        className="w-full max-w-[220px] rounded-lg border border-gray-200 object-cover"
                      />
                    ) : (
                      <div className="w-full max-w-[220px] h-[160px] bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500">
                        Capture indisponible
                      </div>
                    )}
                    {response.recordingUrl && (
                      <a
                        href={response.recordingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-blue-600 hover:underline"
                      >
                        Voir la vidéo complète
                      </a>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-gray-400">
                        Question {response.questionIndex + 1}
                      </p>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {response.questionText}
                      </h3>
                    </div>
                    {response.transcript && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm leading-relaxed text-gray-700">
                        <p className="font-semibold text-gray-800 mb-2">Transcription synthétique</p>
                        <p>{response.transcript}</p>
                      </div>
                    )}
                    {response.visualFeedback && (
                      <div className="space-y-3 text-sm text-gray-700">
                        <div>
                          <h4 className="font-semibold text-gray-900">Analyse visuelle</h4>
                          <p className="text-gray-600 leading-relaxed">
                            {response.visualFeedback.summary}
                          </p>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {response.visualFeedback.attire && (
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Tenue</p>
                              <p className="text-sm text-slate-700 mt-1">
                                {response.visualFeedback.attire}
                              </p>
                            </div>
                          )}
                          {response.visualFeedback.posture && (
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Posture</p>
                              <p className="text-sm text-slate-700 mt-1">
                                {response.visualFeedback.posture}
                              </p>
                            </div>
                          )}
                          {response.visualFeedback.eyeContact && (
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Regard</p>
                              <p className="text-sm text-slate-700 mt-1">
                                {response.visualFeedback.eyeContact}
                              </p>
                            </div>
                          )}
                          {response.visualFeedback.facialExpression && (
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Expression faciale</p>
                              <p className="text-sm text-slate-700 mt-1">
                                {response.visualFeedback.facialExpression}
                              </p>
                            </div>
                          )}
                          {response.visualFeedback.environment && (
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Environnement</p>
                              <p className="text-sm text-slate-700 mt-1">
                                {response.visualFeedback.environment}
                              </p>
                            </div>
                          )}
                          {response.visualFeedback.confidenceLevel && (
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Impact perçu</p>
                              <p className="text-sm text-slate-700 mt-1">
                                {response.visualFeedback.confidenceLevel}
                              </p>
                            </div>
                          )}
                        </div>
                        {response.visualFeedback.riskFlags && response.visualFeedback.riskFlags.length > 0 && (
                          <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-red-700 mb-2">
                              Points de vigilance visuelle
                            </p>
                            <ul className="space-y-1 text-sm text-red-800">
                              {response.visualFeedback.riskFlags.map((risk, idx) => (
                                <li key={`risk-${response.questionIndex}-${idx}`}>• {risk}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {response.visualFeedback.tips && response.visualFeedback.tips.length > 0 && (
                          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary mb-2">
                              Conseils personnalisés
                            </p>
                            <ul className="space-y-1 list-disc list-inside text-primary-dark">
                              {response.visualFeedback.tips.map((tip, index) => (
                                <li key={`tip-${response.questionIndex}-${index}`}>{tip}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}

export default function FeedbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
      <FeedbackContent />
    </Suspense>
  );
}

