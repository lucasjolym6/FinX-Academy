"use client";

import { useEffect, useState } from "react";
import { calculateLevel, getXpForCurrentLevel, getXpForNextLevel } from "@/lib/gamification";

interface XPAnimationProps {
  xpEarned: number;
  currentXP: number;
  onComplete?: () => void;
}

export default function XPAnimation({ xpEarned, currentXP, onComplete }: XPAnimationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [animatedXP, setAnimatedXP] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Calculer le niveau et la progression avant et après
    const oldLevel = calculateLevel(currentXP);
    const newXP = currentXP + xpEarned;
    const newLevel = calculateLevel(newXP);

    // Calculer la progression initiale
    const initialXpForCurrentLevel = getXpForCurrentLevel(currentXP);
    const initialXpForNextLevel = getXpForNextLevel(currentXP);
    const initialXpInCurrentLevel = currentXP - initialXpForCurrentLevel;
    const initialXpNeededForNextLevel = initialXpForNextLevel - initialXpForCurrentLevel;
    const initialProgress = (initialXpInCurrentLevel / initialXpNeededForNextLevel) * 100;
    setProgress(Math.max(0, Math.min(100, initialProgress)));

    // Animer l'XP gagné
    const duration = 2000; // 2 secondes
    const steps = 60;
    const stepDuration = duration / steps;
    const xpPerStep = xpEarned / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const currentAnimatedXP = Math.min(xpEarned, currentStep * xpPerStep);
      setAnimatedXP(Math.floor(currentAnimatedXP));

      // Calculer la progression pour la barre
      const tempXP = currentXP + currentAnimatedXP;
      const xpForCurrentLevel = getXpForCurrentLevel(tempXP);
      const xpForNextLevel = getXpForNextLevel(tempXP);
      const xpInCurrentLevel = tempXP - xpForCurrentLevel;
      const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;
      const currentProgress = (xpInCurrentLevel / xpNeededForNextLevel) * 100;
      setProgress(Math.min(100, Math.max(0, currentProgress)));

      if (currentStep >= steps) {
        clearInterval(interval);
        // Attendre un peu avant de fermer l'animation
        setTimeout(() => {
          setIsVisible(false);
          if (onComplete) {
            onComplete();
          }
        }, 1500);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [xpEarned, currentXP, onComplete]);

  if (!isVisible) return null;

  const newXP = currentXP + xpEarned;
  const oldLevel = calculateLevel(currentXP);
  const newLevel = calculateLevel(newXP);
  const levelUp = newLevel > oldLevel;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-scaleIn">
        {/* Icône de succès */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center animate-bounce">
            <span className="text-4xl">🎉</span>
          </div>
        </div>

        {/* Titre */}
        <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Quiz réussi !
        </h3>

        {/* XP gagné */}
        <div className="text-center mb-6">
          <div className="text-5xl font-bold text-[#F5B301] mb-2 animate-pulse">
            +{animatedXP} XP
          </div>
          {levelUp && (
            <div className="text-lg font-semibold text-[#0A2540] animate-bounce">
              🎊 Niveau {oldLevel} → {newLevel} ! 🎊
            </div>
          )}
        </div>

        {/* Barre de progression */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700">Niveau {oldLevel}</span>
            <span className="text-sm font-semibold text-gray-700">
              {progress.toFixed(0)}% vers le niveau {newLevel}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#F5B301] to-[#FFD700] h-4 rounded-full transition-all duration-300 ease-out flex items-center justify-end pr-2"
              style={{ width: `${progress}%` }}
            >
              {progress > 15 && (
                <span className="text-xs font-bold text-white">
                  {progress.toFixed(0)}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Message */}
        <p className="text-center text-gray-600 text-sm">
          {levelUp
            ? "Félicitations ! Vous avez monté de niveau !"
            : "Continuez ainsi pour progresser !"}
        </p>
      </div>
    </div>
  );
}

