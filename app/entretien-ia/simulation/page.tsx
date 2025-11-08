"use client";

import {
  useMemo,
  useState,
  useEffect,
  useRef,
  Suspense,
} from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, RefreshCcw, AlertCircle, Mic } from "lucide-react";
import { jobs, type CareerPath } from "@/data/jobs";
import { useUser } from "@/hooks/useUser";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const PREP_TIME_SECONDS = 90;
const MAX_RESPONSE_SECONDS = 180;
const MAX_ATTEMPTS = 3;

type RecordingEntry = {
  question: string;
  audioBlob: Blob;
  duration: number;
};

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

function SimulationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [recordings, setRecordings] = useState<Array<RecordingEntry | undefined>>([]);
  const [attemptCounts, setAttemptCounts] = useState<Record<number, number>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [prepTimeLeft, setPrepTimeLeft] = useState(PREP_TIME_SECONDS);
  const [isComplete, setIsComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [visibleAnalysisMessages, setVisibleAnalysisMessages] = useState<string[]>([]);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [runId, setRunId] = useState<string | null>(null);
  const [isInitializingRun, setIsInitializingRun] = useState(false);
  const [runError, setRunError] = useState<string | null>(null);
  const [responseMetadata, setResponseMetadata] = useState<Record<number, { responseId: string; recordingPath: string; snapshotPath?: string }>>({});

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);
  const recordingSecondsRef = useRef(0);

  const captureSnapshotFromVideo = async (): Promise<{ blob: Blob; dataUrl: string } | null> => {
    const video = previewVideoRef.current;
    if (!video) return null;
    const width = video.videoWidth;
    const height = video.videoHeight;
    if (!width || !height) return null;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, width, height);
    const dataUrl = canvas.toDataURL("image/png");
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    return { blob, dataUrl };
  };

  const careerPath = searchParams.get("career") as CareerPath | null;
  const jobId = searchParams.get("job");

  const selectedJob = jobs.find((job) => job.id === jobId);

  useEffect(() => {
    if (!careerPath || !jobId || !selectedJob) {
      router.push("/entretien-ia");
    }
  }, [careerPath, jobId, selectedJob, router]);

  const questions = useMemo(() => selectedJob?.exampleQuestions ?? [], [selectedJob]);
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex] ?? "";

  useEffect(() => {
    if (userLoading) return;
    if (!user) return;
    if (!selectedJob || totalQuestions === 0) return;
    if (runId) return;

    let cancelled = false;
    const initializeRun = async () => {
      try {
        setIsInitializingRun(true);
        const { data, error } = await supabase
          .from("interview_runs")
          .insert({
            user_id: user.id,
            career_path: careerPath,
            job_id: jobId,
            job_title: selectedJob.title,
            total_questions: totalQuestions,
            status: "in_progress",
          })
          .select("id")
          .single();

        if (cancelled) return;

        if (error) {
          console.error("Erreur création session entretien", error);
          setRunError("Impossible de démarrer la simulation. Réessayez plus tard.");
        } else if (data) {
          setRunId(data.id);
          setRunError(null);
        }
      } catch (error) {
        if (cancelled) return;
        console.error("Erreur inattendue création session", error);
        setRunError("Erreur inattendue lors de la création de la session.");
      } finally {
        if (!cancelled) {
          setIsInitializingRun(false);
        }
      }
    };

    initializeRun();

    return () => {
      cancelled = true;
    };
  }, [userLoading, user, selectedJob, totalQuestions, runId, supabase, careerPath, jobId]);

  const currentRecording = recordings[currentQuestionIndex];
  const attemptsUsed = attemptCounts[currentQuestionIndex] ?? 0;
  const attemptsLeft = Math.max(0, MAX_ATTEMPTS - attemptsUsed);
  const hasRecording = Boolean(currentRecording?.audioBlob);
  const prepProgress = Math.min(
    100,
    ((PREP_TIME_SECONDS - prepTimeLeft) / PREP_TIME_SECONDS) * 100
  );

  useEffect(() => {
    setPrepTimeLeft(PREP_TIME_SECONDS);
    setRecordingTime(0);
    setIsRecording(false);
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (isRecording || hasRecording || prepTimeLeft <= 0) return;
    const timer = setInterval(() => {
      setPrepTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isRecording, hasRecording, prepTimeLeft]);

  useEffect(() => {
    let mounted = true;

    async function initializeCamera() {
      try {
        const primaryConstraints: MediaStreamConstraints = {
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
          },
        };

        let stream: MediaStream | null = null;
        try {
          stream = await navigator.mediaDevices.getUserMedia(primaryConstraints);
        } catch (primaryError) {
          console.warn("getUserMedia primary constraints failed", primaryError);
          const fallbackConstraints: MediaStreamConstraints = {
            video: true,
            audio: true,
          };
          stream = await navigator.mediaDevices.getUserMedia(fallbackConstraints);
        }

        if (!mounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        cameraStreamRef.current = stream;

        setCameraError(null);
        setIsCameraReady(true);
      } catch (error) {
        console.error("Camera error", error);
        if (!mounted) return;
        setCameraError(
          "Impossible d'activer la caméra. Vérifiez les permissions du navigateur."
        );
        setIsCameraReady(false);
      }
    }

    initializeCamera();

    return () => {
      mounted = false;
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach((track) => track.stop());
        cameraStreamRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const stream = cameraStreamRef.current;
    const video = previewVideoRef.current;
    if (!stream || !video) return;

    if (video.srcObject !== stream) {
      video.srcObject = stream;
    }
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "true");
    video.setAttribute("webkit-playsinline", "true");
    video.setAttribute("muted", "true");
    video.autoplay = true;
    video.controls = false;

    const startPlayback = async () => {
      try {
        await new Promise((resolve) => requestAnimationFrame(resolve));
        await video.play();
        setCameraError(null);
      } catch (error) {
        console.warn("Impossible de lancer la prévisualisation camera", error);
        setCameraError(
          "La prévisualisation est bloquée. Touchez la zone vidéo pour réessayer."
        );
      }
    };

    if (video.readyState >= 2) {
      void startPlayback();
    } else {
      const handleLoaded = () => {
        video.removeEventListener("loadedmetadata", handleLoaded);
        void startPlayback();
      };
      video.addEventListener("loadedmetadata", handleLoaded);
      return () => {
        video.removeEventListener("loadedmetadata", handleLoaded);
      };
    }
  }, [isCameraReady, currentQuestionIndex]);

  const stopRecordingTimer = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  };

  const handleRecordingComplete = async (
    videoBlob: Blob,
    duration: number,
    questionIndex: number,
    questionText: string
  ) => {
    if (!runId || !user) {
      alert("Vous devez être connecté pour sauvegarder la simulation.");
      return;
    }

    const attemptNumber = (attemptCounts[questionIndex] ?? 0) + 1;
    const safeDuration = Math.max(1, duration);
    const storagePath = `${user.id}/${runId}/question-${questionIndex + 1}-attempt-${attemptNumber}-${Date.now()}.webm`;
    let snapshotPath: string | undefined;
    let snapshotDataUrl: string | undefined;

    const snapshot = await captureSnapshotFromVideo();
    if (snapshot) {
      snapshotPath = `${user.id}/${runId}/question-${questionIndex + 1}-attempt-${attemptNumber}-snapshot-${Date.now()}.png`;
      const { error: snapshotUploadError } = await supabase.storage
        .from("interview-recordings")
        .upload(snapshotPath, snapshot.blob, {
          cacheControl: "3600",
          contentType: "image/png",
          upsert: true,
        });

      if (snapshotUploadError) {
        console.error("Upload snapshot Supabase", snapshotUploadError);
        snapshotPath = undefined;
      } else {
        snapshotDataUrl = snapshot.dataUrl;
      }
    }

    const { error: uploadError } = await supabase.storage
      .from("interview-recordings")
      .upload(storagePath, videoBlob, {
        cacheControl: "3600",
        contentType: "video/webm",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload vidéo Supabase", uploadError);
      alert("Erreur lors de l'enregistrement vidéo. Réessayez.");
      return;
    }

    const { data: responseRow, error: insertError } = await supabase
      .from("interview_responses")
      .insert({
        run_id: runId,
        question_index: questionIndex,
        question_text: questionText,
        attempt_number: attemptNumber,
        duration_seconds: safeDuration,
        recording_url: storagePath,
        snapshot_url: snapshotPath ?? null,
        is_active: true,
      })
      .select("id")
      .single();

    if (insertError || !responseRow) {
      console.error("Insertion réponse entretien", insertError);
      await supabase.storage.from("interview-recordings").remove([storagePath]);
      alert("Impossible de sauvegarder cette tentative. Réessayez.");
      return;
    }

    setResponseMetadata((prev) => ({
      ...prev,
      [questionIndex]: {
        responseId: responseRow.id,
        recordingPath: storagePath,
        snapshotPath: snapshotPath ?? undefined,
      },
    }));

    setRecordings((prev) => {
      const next = [...prev];
      while (next.length < totalQuestions) {
        next.push(undefined);
      }
      next[questionIndex] = {
        question: questionText,
        audioBlob: videoBlob,
        duration: safeDuration,
      };
      return next;
    });

    setAttemptCounts((prev) => {
      const used = prev[questionIndex] ?? 0;
      return {
        ...prev,
        [questionIndex]: Math.min(MAX_ATTEMPTS, used + 1),
      };
    });

    if (snapshotDataUrl) {
      try {
        const visualResponse = await fetch("/api/interviews/analyze-visuals", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ frameDataUrl: snapshotDataUrl }),
        });

        if (visualResponse.ok) {
          const { visualFeedback } = await visualResponse.json();
          await supabase
            .from("interview_responses")
            .update({ visual_feedback_json: visualFeedback ?? null })
            .eq("id", responseRow.id);
        }
      } catch (error) {
        console.error("Erreur analyse visuelle", error);
      }
    }

    setPrepTimeLeft(PREP_TIME_SECONDS);
  };

  const startRecording = async () => {
    if (isRecording || attemptsLeft <= 0) return;

    if (!runId || !user) {
      alert("Veuillez vous connecter pour démarrer la simulation.");
      return;
    }

    try {
      if (!cameraStreamRef.current) {
        setCameraError(
          "Caméra indisponible. Autorisez la caméra dans votre navigateur."
        );
        setIsCameraReady(false);
        return;
      }

      const recorder = new MediaRecorder(cameraStreamRef.current);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      recordingSecondsRef.current = 0;
      setRecordingTime(0);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
         const blob = new Blob(chunksRef.current, { type: "video/webm" });
         chunksRef.current = [];
         const duration = recordingSecondsRef.current;
         const questionIndex = currentQuestionIndex;
         const questionText = questions[questionIndex] ?? "";
         void handleRecordingComplete(blob, duration, questionIndex, questionText);
         stopRecordingTimer();
         setIsRecording(false);
      };

      recorder.start();
      setIsRecording(true);

      recordingTimerRef.current = setInterval(() => {
        recordingSecondsRef.current += 1;
        setRecordingTime(recordingSecondsRef.current);
      }, 1000);
    } catch (error) {
      console.error("Erreur d'accès aux médias", error);
      alert("Impossible de démarrer l'enregistrement. Vérifiez vos permissions caméra/micro.");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (!isRecording || !mediaRecorderRef.current) return;
    mediaRecorderRef.current.stop();
    mediaRecorderRef.current = null;
    setIsRecording(false);
    stopRecordingTimer();
  };

  const handleDiscardRecording = async () => {
     const meta = responseMetadata[currentQuestionIndex];
 
     if (meta) {
       try {
         await supabase
           .from("interview_responses")
           .update({ is_active: false, discarded_at: new Date().toISOString() })
           .eq("id", meta.responseId);
 
         const pathsToRemove = [meta.recordingPath];
         if (meta.snapshotPath) {
           pathsToRemove.push(meta.snapshotPath);
         }
         await supabase.storage
           .from("interview-recordings")
           .remove(pathsToRemove);
       } catch (error) {
         console.error("Erreur suppression tentative", error);
       }
 
       setResponseMetadata((prev) => {
         const next = { ...prev };
         delete next[currentQuestionIndex];
         return next;
       });
     }
 
     setRecordings((prev) => {
       const next = [...prev];
       next[currentQuestionIndex] = undefined;
       return next;
     });
     setPrepTimeLeft(PREP_TIME_SECONDS);
     setRecordingTime(0);
   };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleFinish = async () => {
    setIsProcessing(true);
    setVisibleAnalysisMessages([]);

    try {
      if (!runId || !user) {
        alert("Session invalide. Veuillez vous reconnecter.");
        setIsProcessing(false);
        return;
      }

      const transcriptions: string[] = [];
      
      for (let i = 0; i < recordings.length; i += 1) {
        const audioBlob = recordings[i]?.audioBlob;
        if (audioBlob) {
          const formData = new FormData();
          formData.append("audio", audioBlob, `question-${i}.webm`);

          const response = await fetch("/api/transcribe", {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            const data = await response.json();
            transcriptions.push(data.text);
          } else {
            transcriptions.push("");
          }
        } else {
          transcriptions.push("");
        }
      }

      const analysisResponse = await fetch("/api/analyze-interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobTitle: selectedJob?.title ?? "",
          questions: selectedJob?.exampleQuestions ?? [],
          transcriptions,
        }),
      });

      if (!analysisResponse.ok) {
        throw new Error("Analyse en échec");
      }

      const feedback = await analysisResponse.json();

      for (const [indexKey, meta] of Object.entries(responseMetadata)) {
        if (!meta) continue;
        const index = Number(indexKey);
        const transcript = transcriptions[index] ?? "";
        const { error: updateError } = await supabase
          .from("interview_responses")
          .update({ transcript: transcript || null })
          .eq("id", meta.responseId);
        if (updateError) {
          console.error("Erreur mise à jour transcript", updateError);
        }
      }

      await supabase
        .from("interview_runs")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
          feedback_json: feedback,
        })
        .eq("id", runId)
        .eq("user_id", user.id);

      router.push(`/entretien-ia/feedback?run=${runId}`);
    } catch (error) {
      console.error("Erreur lors de l'analyse", error);
      alert("Une erreur est survenue pendant l'analyse. Veuillez réessayer.");
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (!isProcessing) return;

    const script = [
      "Préparation des réponses audio…",
      "Transcription des segments clés…",
      "Évaluation de la structure…",
      "Mesure de l'impact et de la clarté…",
      "Génération des recommandations personnalisées…",
    ];

    setVisibleAnalysisMessages([]);
    let index = 0;

    const interval = setInterval(() => {
      setVisibleAnalysisMessages((prev) => [...prev, script[index]]);
      index += 1;
      if (index >= script.length) {
        clearInterval(interval);
      }
    }, 700);

    return () => clearInterval(interval);
  }, [isProcessing]);

  if (!selectedJob || !careerPath || totalQuestions === 0) {
    return null;
  }

  if (userLoading || isInitializingRun) {
    return (
      <main className="min-h-screen bg-white text-[#1F2937]">
        <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-4 py-16">
          <p className="text-sm font-medium text-[#6B7280]">Initialisation de la simulation…</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-white text-[#1F2937]">
        <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-4 py-16">
          <div className="space-y-4 text-center">
            <h1 className="text-2xl font-semibold text-[#111827]">
              Connexion requise
            </h1>
            <p className="text-sm text-[#6B7280]">
              Identifiez-vous pour lancer une simulation d&apos;entretien et sauvegarder vos feedbacks.
            </p>
            <Link
              href="/auth"
              className="inline-flex items-center justify-center rounded-full bg-[#1E3A8A] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1E3A8A]/90"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (runError) {
    return (
      <main className="min-h-screen bg-white text-[#1F2937]">
        <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-4 py-16">
          <div className="space-y-4 text-center">
            <h1 className="text-2xl font-semibold text-[#111827]">
              Impossible de démarrer la simulation
            </h1>
            <p className="text-sm text-[#6B7280]">{runError}</p>
            <button
              onClick={() => {
                setRunId(null);
                setRunError(null);
              }}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 hover:border-slate-300"
            >
              Réessayer
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!runId) {
    return (
      <main className="min-h-screen bg-white text-[#1F2937]">
        <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-4 py-16">
          <p className="text-sm font-medium text-[#6B7280]">Préparation de votre session d&apos;entretien…</p>
        </div>
      </main>
    );
  }

  if (isProcessing) {
    return (
      <main className="min-h-screen bg-white text-slate-900">
        <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-4 py-16">
          <div className="w-full rounded-[32px] border border-slate-200 bg-white p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
              Analyse en cours
            </p>
            <h1 className="mt-4 text-2xl font-semibold text-slate-900">
              Nous analysons votre simulation pour {selectedJob.title}
            </h1>
            <div className="mt-8 space-y-3 font-mono text-sm text-slate-600">
              {visibleAnalysisMessages.length === 0 && (
                <span className="text-slate-400">Initialisation…</span>
              )}
              {visibleAnalysisMessages.map((message, index) => (
                <motion.div
                  key={`${message}-${index}`}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-3"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" />
                  <span>{message}</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-8 flex items-center gap-2 text-sm text-slate-500">
              <motion.span
                className="h-2 w-2 rounded-full bg-[#2563EB]"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              />
              Merci de patienter quelques secondes…
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (isComplete) {
    const answeredCount = recordings.filter((entry) => entry?.audioBlob).length;

    return (
      <main className="min-h-screen bg-white text-slate-900">
        <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-4 py-16">
          <div className="w-full rounded-[32px] border border-slate-200 bg-white p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
              Simulation terminée
            </p>
            <h1 className="mt-4 text-3xl font-semibold text-slate-900">
              Analyse prête pour {selectedJob.title}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600">
              Vous avez répondu à {answeredCount} question(s) sur {totalQuestions}. Vous pouvez maintenant lancer l&apos;analyse pour obtenir votre feedback personnalisé.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-start">
              <button
                onClick={handleFinish}
                className="inline-flex items-center justify-center rounded-full bg-[#1E3A8A] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1E3A8A]/90"
              >
                Lancer l&apos;analyse
              </button>
              <button
                onClick={() => setIsComplete(false)}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 px-8 py-3 text-sm font-semibold text-slate-600 transition-colors hover:border-slate-300"
              >
                Revoir les questions
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const canStartRecording = !isRecording && attemptsLeft > 0 && isCameraReady;
  const canProceedToNext = Boolean(currentRecording?.audioBlob);
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const statusText = isRecording
    ? "Recording in progress"
    : hasRecording
    ? "Recording saved"
    : "NOT Recording";

  return (
    <main className="min-h-screen bg-white text-[#1F2937]">
      <div className="mx-auto max-w-[1280px] px-3 py-8 sm:py-10">
        <div className="w-full flex flex-col gap-8">
          {/* Lien retour */}
          <div>
          <Link 
            href="/entretien-ia" 
              className="text-sm font-medium text-[#2563EB] hover:underline"
          >
              ← Revenir aux thèmes
          </Link>
        </div>

          {/* Bloc principal en 2 colonnes */}
          <div className="bg-white rounded-[20px] border border-[#E5E7EB] shadow-sm px-3 py-5 sm:px-5 sm:py-6 lg:px-6 lg:py-6 grid grid-cols-1 lg:grid-cols-[3fr,2fr] gap-8 lg:gap-10">
            {/* COLONNE GAUCHE : question */}
            <section className="flex flex-col gap-8">
              <header className="space-y-3">
                <p className="text-sm font-semibold text-[#1F2937]">
                  Question <span className="text-[#111827]">{currentQuestionIndex + 1}</span> sur {totalQuestions}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-[#6B7280]">
                  <span>⟳ Tentatives : {attemptsUsed} / {MAX_ATTEMPTS}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>⏱ Temps de réponse max : {Math.floor(MAX_RESPONSE_SECONDS / 60)} minute(s)</span>
                </div>
              </header>

              <div className="space-y-3">
                <h1 className="text-2xl font-semibold text-[#111827] leading-snug">
                  {selectedJob.title}
                </h1>
                <p className="text-base leading-relaxed text-[#1F2937]">
                  {currentQuestion}
                </p>
                <p className="text-sm leading-relaxed text-[#6B7280]">
                  {selectedJob.description}
                </p>
              </div>

              {/* Infos temps & tentatives */}
              <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div className="space-y-0.5">
                  <dt className="text-[#6B7280]">Temps maximum</dt>
                  <dd className="font-semibold text-[#111827]">
                    {Math.floor(MAX_RESPONSE_SECONDS / 60)} minute(s)
                  </dd>
                </div>
                <div className="space-y-0.5">
                  <dt className="text-[#6B7280]">Temps de préparation</dt>
                  <dd className="font-semibold text-[#111827]">
                    {Math.floor(PREP_TIME_SECONDS / 60)} minute(s)
                  </dd>
                </div>
                <div className="space-y-0.5">
                  <dt className="text-[#6B7280]">Tentatives</dt>
                  <dd className="font-semibold text-[#111827]">
                    {attemptsUsed} sur {MAX_ATTEMPTS}
                  </dd>
                </div>
              </dl>

              {/* Conseils */}
              <section className="space-y-2">
                <h2 className="text-sm font-semibold text-[#1F2937]">
                  Conseils pour structurer votre réponse
                </h2>
                <ul className="text-sm text-[#4B5563] space-y-1.5 list-disc list-inside">
                  <li>Introduisez brièvement le contexte du cas présenté.</li>
                  <li>Décrivez les actions menées et votre rôle précis.</li>
                  <li>Concluez avec un résultat mesurable et un apprentissage.</li>
                </ul>
              </section>

              {/* Navigation questions */}
              <div className="pt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 text-sm">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0 || isRecording}
                  className="px-3 py-2 rounded-full border border-[#E5E7EB] text-[#9CA3AF] bg-[#F3F4F6] disabled:cursor-not-allowed"
                >
                  Question précédente
                </button>
                <button
                  onClick={handleNextQuestion}
                  disabled={!canProceedToNext || isRecording}
                  className="px-4 py-2 rounded-full border border-[#E5E7EB] text-[#1F2937] bg-white hover:bg-[#F9FAFB] transition disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                >
                  {isLastQuestion ? "Terminer" : "Question suivante"}
                </button>
              </div>
            </section>

            {/* COLONNE DROITE : vidéo */}
            <section className="flex flex-col gap-6">
              <h2 className="text-base font-semibold text-[#1F2937]">
                Réponse vidéo
              </h2>

              {/* Barre de préparation */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium text-[#6B7280]">
                  <span>Temps de préparation</span>
                  <span>{formatTime(prepTimeLeft)}</span>
                </div>
                <div className="w-full h-3 rounded-full bg-[#E5E7EB] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                    animate={{ width: `${prepProgress}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="h-full bg-[#2563EB]"
                />
              </div>
            </div>

              {/* Zone vidéo */}
              <div className="relative flex-1 min-h-[220px] rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] overflow-hidden">
                {isCameraReady ? (
                  <video
                    ref={previewVideoRef}
                    autoPlay
                    muted
                    playsInline
                    controls={false}
                    className="h-full w-full object-cover bg-black transform scale-x-[-1]"
                    onClick={() => {
                      if (!previewVideoRef.current) return;
                      previewVideoRef.current.play().then(() => setCameraError(null)).catch((error) => {
                        console.warn("Lecture vidéo bloquée", error);
                      });
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
                    <div className="w-36 h-36 border border-dashed border-[#CBD5F5] rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-[#6B7280] tracking-wide">
                        Caméra
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-[#1F2937] tracking-[0.28em] uppercase">
                      {cameraError ? "Camera inactive" : "Initialisation"}
                    </p>
                  </div>
                )}
                <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-[#1F2937] shadow-sm">
                  {statusText}
                </div>
              </div>
              {cameraError && (
                <p className="text-xs text-[#DC2626]">
                  {cameraError}
                </p>
              )}

              {/* Barre micro + temps */}
              <div className="flex items-center justify-between text-xs text-[#6B7280]">
                <div className="flex items-center gap-3 flex-1">
                  <span
                    className={`inline-flex h-2 w-2 rounded-full ${
                      isRecording ? "bg-[#10B981]" : "bg-[#D1D5DB]"
                    }`}
                    aria-hidden="true"
                  />
                  <div className="flex-1 h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#10B981] transition-all"
                      style={{ width: isRecording ? "90%" : hasRecording ? "40%" : "0%" }}
                    />
                  </div>
                  <span className="text-[#6B7280]">
                    Micro {isRecording ? "actif" : hasRecording ? "en veille" : "en attente"}
                  </span>
                </div>
                <span className="ml-4 font-mono text-sm text-[#374151]">
                  {formatTime(recordingTime)}
                </span>
              </div>

              {/* Bouton enregistrement */}
              {!isRecording && !hasRecording && (
                <button
                  onClick={startRecording}
                  disabled={!canStartRecording}
                  className="w-full py-3.5 rounded-full bg-[#3F3F46] text-white text-sm font-semibold tracking-wide hover:bg-[#4B5563] transition disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  Démarrer l&apos;enregistrement
                </button>
              )}

              {isRecording && (
                <button
                  onClick={stopRecording}
                  className="w-full py-3.5 rounded-full bg-[#DC2626] text-white text-sm font-semibold tracking-wide hover:bg-[#B91C1C] transition"
                >
                  Arrêter l&apos;enregistrement
                </button>
              )}

              {!isRecording && hasRecording && (
                <div className="flex flex-col gap-3">
                  <div className="rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-xs text-[#6B7280]">
                    Enregistrement sauvegardé. Vous pouvez recommencer si des tentatives restent.
                  </div>
                  <button
                    onClick={handleDiscardRecording}
                    disabled={attemptsLeft <= 0}
                    className="w-full py-3 rounded-full border border-[#E5E7EB] text-xs font-semibold uppercase tracking-[0.3em] text-[#4B5563] hover:border-[#D1D5DB] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Refaire
                  </button>
                </div>
              )}

              {/* Tentatives restantes */}
              <p className="text-xs text-[#9CA3AF] text-right">
                {attemptsLeft} tentative(s) restante(s)
              </p>
            </section>
          </div>

          {/* Footer actions */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
              <AlertCircle className="h-4 w-4" />
              <span>{attemptsLeft} tentative(s) restante(s)</span>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0 || isRecording}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition-colors hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Question précédente
              </button>
              <button
                onClick={handleNextQuestion}
                disabled={!canProceedToNext || isRecording}
                className="inline-flex items-center justify-center rounded-full bg-[#1E3A8A] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1E3A8A]/90 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isLastQuestion ? "Terminer la simulation" : "Question suivante"}
              </button>
            </div>
                </div>
                </div>
      </div>
    </main>
  );
}

export default function SimulationEntretien() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}> 
      <SimulationContent />
    </Suspense>
  );
}

