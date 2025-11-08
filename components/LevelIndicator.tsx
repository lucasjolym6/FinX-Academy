import ProgressBar from "./ProgressBar";
import { calculateLevel, xpToNextLevel, getXpForCurrentLevel, getXpForNextLevel } from "@/lib/gamification";

interface LevelIndicatorProps {
  currentXp: number;
}

export default function LevelIndicator({ currentXp }: LevelIndicatorProps) {
  const level = calculateLevel(currentXp);
  const xpNeeded = xpToNextLevel(currentXp);
  const xpForCurrentLevel = getXpForCurrentLevel(currentXp);
  const xpForNextLevel = getXpForNextLevel(currentXp);
  
  // Calcul du pourcentage de progression vers le niveau suivant
  const progress = ((currentXp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-600 mb-2">Niveau actuel</p>
          <p className="text-4xl font-bold text-primary">{level}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600 mb-2">XP total</p>
          <p className="text-2xl font-bold text-accent">{currentXp.toLocaleString()} XP</p>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-700">
            {currentXp} / {xpForNextLevel} XP
          </span>
          <span className="text-sm font-semibold text-primary">
            {Math.round(progress)}%
          </span>
        </div>
        <ProgressBar progress={Math.min(100, Math.max(0, progress))} height="lg" />
      </div>

      {/* Texte informatif */}
      <div className="bg-accent/10 rounded-lg p-4 text-center">
        <p className="text-primary font-semibold">
          {xpNeeded > 0 ? (
            <span>
              {xpNeeded} XP avant le niveau {level + 1}
            </span>
          ) : (
            <span className="text-accent">🎉 Niveau maximum atteint !</span>
          )}
        </p>
      </div>
    </div>
  );
}
