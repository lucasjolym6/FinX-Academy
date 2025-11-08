import ProgressBar from "./ProgressBar";
import { getXpForCurrentLevel, getXpForNextLevel } from "@/lib/gamification";

interface LevelCardProps {
  level: number;
  currentXP: number;
  xpNeeded: number;
  totalXP: number;
}

export default function LevelCard({
  level,
  currentXP,
  xpNeeded,
  totalXP,
}: LevelCardProps) {
  // Calculer correctement la progression dans le niveau actuel
  const xpForCurrentLevel = getXpForCurrentLevel(currentXP);
  const xpForNextLevel = getXpForNextLevel(currentXP);
  const xpInCurrentLevel = currentXP - xpForCurrentLevel;
  const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;
  const progress = xpNeededForNextLevel > 0 
    ? Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeededForNextLevel) * 100))
    : 100;

  return (
    <div className="bg-gradient-to-br from-accent via-accent-light to-accent rounded-2xl p-8 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-primary/80 text-sm font-semibold mb-1">Niveau actuel</p>
          <p className="text-5xl font-bold text-primary">{level}</p>
        </div>
        <div className="text-right">
          <p className="text-primary/80 text-sm font-semibold mb-1">XP total</p>
          <p className="text-3xl font-bold text-primary">{totalXP.toLocaleString()}</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-primary font-semibold text-sm">
            {xpInCurrentLevel} / {xpNeededForNextLevel} XP
          </span>
          <span className="text-primary font-semibold text-sm">
            {Math.round(progress)}% vers le niveau {level + 1}
          </span>
        </div>
        <ProgressBar progress={progress} color="primary" height="lg" />
      </div>

      <div className="bg-white/20 rounded-lg p-4 text-center">
        <p className="text-primary font-semibold text-sm">
          Continue à apprendre pour débloquer le niveau {level + 1} ! 🚀
        </p>
      </div>
    </div>
  );
}

