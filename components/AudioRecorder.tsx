"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob, duration: number) => void;
  existingRecording: Blob | null;
}

const waveVariants = {
  animate: (index: number) => ({
    scaleY: [1, 2.4, 1],
    opacity: [0.35, 1, 0.35],
    transition: {
      duration: 1.05,
      ease: "easeInOut",
      repeat: Infinity,
      delay: index * 0.08,
    },
  }),
};

export default function AudioRecorder({ onRecordingComplete, existingRecording }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (existingRecording) {
      const url = URL.createObjectURL(existingRecording);
      setAudioURL(url);
      return () => URL.revokeObjectURL(url);
    }
    setAudioURL(null);
    setRecordingTime(0);
  }, [existingRecording]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        onRecordingComplete(blob, recordingTime);

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Erreur d'accès au microphone:", err);
      setError("Impossible d'accéder au microphone. Autorisez le micro dans votre navigateur.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const pauseRecording = () => {
    if (!mediaRecorderRef.current || !isRecording) return;

    if (isPaused) {
      mediaRecorderRef.current.resume();
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      mediaRecorderRef.current.pause();
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    setIsPaused((prev) => !prev);
  };

  const deleteRecording = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }
    setAudioURL(null);
    setRecordingTime(0);
    chunksRef.current = [];
    setIsPaused(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const statusMessage = isRecording
    ? isPaused
      ? "Enregistrement en pause"
      : "Enregistrement en cours…"
    : audioURL
    ? "Réponse enregistrée. Réécoutez ou recommencez si besoin."
    : "Préparez-vous puis lancez l’enregistrement quand vous êtes prêt.";

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white p-8 lg:p-10 text-slate-700 shadow-[0_45px_140px_-100px_rgba(15,23,42,0.35)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(148,180,255,0.18),transparent_65%)]" />
      <div className="pointer-events-none absolute inset-x-0 -bottom-32 h-64 bg-[radial-gradient(circle_at_bottom,rgba(56,189,248,0.12),transparent_70%)]" />

      <div className="relative space-y-8">
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            <div className="flex items-start gap-3">
              <svg className="mt-0.5 h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>{error}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center gap-4 text-center">
          <div className="text-[2.75rem] font-mono font-semibold leading-none tracking-tight text-cyan-600">
            {formatTime(recordingTime)}
          </div>
          <p className="text-sm text-slate-500">{statusMessage}</p>
        </div>

        <div className="flex flex-col items-center gap-6">
          {!isRecording && !audioURL && (
            <motion.button
              onClick={startRecording}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 shadow-[0_20px_60px_-30px_rgba(56,189,248,0.65)]"
            >
              <motion.span
                className="absolute inset-[-18px] rounded-full border border-cyan-400/40"
                animate={{ opacity: [0.2, 0.7, 0.2], scale: [1, 1.15, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="h-12 w-12 rounded-full bg-white/35" />
            </motion.button>
          )}

          {isRecording && (
            <div className="flex flex-col items-center gap-6">
              <div className="flex h-24 items-end gap-1.5">
                {Array.from({ length: 14 }).map((_, index) => (
                  <motion.span
                    key={index}
                    className="w-1.5 rounded-full bg-gradient-to-b from-cyan-400 via-blue-500 to-indigo-600"
                    variants={waveVariants}
                    animate="animate"
                    custom={index}
                  />
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={pauseRecording}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-600 transition-colors hover:border-cyan-200"
                >
                  {isPaused ? (
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={stopRecording}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_15px_45px_-25px_rgba(56,189,248,0.65)] transition-transform hover:-translate-y-0.5"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="6" width="12" height="12" rx="2" />
                  </svg>
                  Terminer
                </button>
              </div>
            </div>
          )}

          {audioURL && !isRecording && (
            <div className="w-full space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <audio src={audioURL} controls className="w-full" />
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => {
                    deleteRecording();
                    startRecording();
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-600 transition-colors hover:border-cyan-200"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 5v14m7-7H5" />
                  </svg>
                  Recommencer
                </button>
                <button
                  onClick={deleteRecording}
                  className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-5 py-2 text-sm font-semibold text-red-500 transition-colors hover:border-red-300"
                >
                  Supprimer
                </button>
              </div>
            </div>
          )}
        </div>

        {!isRecording && !audioURL && (
          <div className="space-y-1 text-center text-xs text-slate-500">
            <p>Durée idéale : 60 à 120 secondes.</p>
            <p>Astuce : annoncez votre plan, illustrez d’un cas, concluez avec l’impact.</p>
          </div>
        )}
      </div>
    </div>
  );
}

