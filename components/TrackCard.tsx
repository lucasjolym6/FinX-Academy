import Link from "next/link";

export type Track = {
  id: string;
  title: string;
  difficulty: "Débutant" | "Intermédiaire" | "Avancé";
  description: string;
  slug: string;
  comingSoon?: boolean;
};

interface TrackCardProps {
  track: Track;
  index?: number;
  isLocked?: boolean;
  previousModuleCompleted?: boolean;
  variant?: "default" | "blue" | "yellow";
  label?: string;
  ctaLabel?: string;
  showStepIndicator?: boolean;
  showDifficultyBadge?: boolean;
}

function badgeClassesForDifficulty(level: Track["difficulty"]) {
  const base =
    "inline-flex items-center rounded px-2.5 py-1 text-xs font-semibold";
  switch (level) {
    case "Débutant":
      return base + " bg-green-50 text-green-800 border border-green-200";
    case "Intermédiaire":
      return base + " bg-blue-50 text-blue-800 border border-blue-200";
    case "Avancé":
      return base + " bg-purple-50 text-purple-800 border border-purple-200";
  }
}

function difficultyBarClass(level: Track["difficulty"]) {
  switch (level) {
    case "Débutant":
      return "bg-green-400";
    case "Intermédiaire":
      return "bg-blue-400";
    case "Avancé":
      return "bg-purple-400";
  }
}

export default function TrackCard({
  track,
  index = 0,
  isLocked = false,
  previousModuleCompleted = true,
  variant = "default",
  label,
  ctaLabel,
  showStepIndicator = true,
  showDifficultyBadge = true,
}: TrackCardProps) {
  const stepLabel = `Étape ${index + 1}`;
  const isFirstModule = index === 0;
  const isComingSoon = track.comingSoon === true;
  const isDisabled = isLocked || isComingSoon;
  const isBlueVariant = variant === "blue";
  const isYellowVariant = variant === "yellow";
  const isColoredVariant = isBlueVariant || isYellowVariant;

  // Styles selon la variante
  const containerClasses = isColoredVariant
    ? isDisabled
      ? isBlueVariant
        ? "border-white/20 bg-white/5 opacity-60 cursor-not-allowed"
        : "border-[#0A2540]/20 bg-white/10 opacity-60 cursor-not-allowed"
      : isBlueVariant
        ? "border-white/30 bg-white/10 hover:bg-white/15 hover:border-white/40"
        : "border-[#0A2540]/30 bg-white/20 hover:bg-white/30 hover:border-[#0A2540]/40"
    : isDisabled
      ? "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
      : "border-gray-200 bg-white hover:shadow-md hover:border-gray-300";

  const textColorClasses = isColoredVariant
    ? isDisabled
      ? isBlueVariant
        ? "text-white/60"
        : "text-[#0A2540]/60"
      : isBlueVariant
        ? "text-white"
        : "text-[#0A2540]"
    : isDisabled
      ? "text-gray-400"
      : "text-gray-900";

  const secondaryTextColorClasses = isColoredVariant
    ? isDisabled
      ? isBlueVariant
        ? "text-white/50"
        : "text-[#0A2540]/50"
      : isBlueVariant
        ? "text-white/80"
        : "text-[#0A2540]/80"
    : isDisabled
      ? "text-gray-400"
      : "text-gray-700";

  const shouldRenderHeader =
     showStepIndicator ||
     isComingSoon ||
     isLocked ||
     (showDifficultyBadge && !isComingSoon && !isLocked);
 
   return (
     <div className={`flex h-full flex-col rounded-lg border px-6 py-6 shadow-sm transition-all ${containerClasses}`}>
       {shouldRenderHeader && (
        <div className="mb-4 flex items-center gap-3">
          {showStepIndicator && (
            <div className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded text-sm font-bold ${
                  isColoredVariant
                    ? isDisabled
                      ? isBlueVariant
                        ? "bg-white/10 text-white/60"
                        : "bg-[#0A2540]/10 text-[#0A2540]/60"
                      : isBlueVariant
                        ? "bg-white/20 text-white"
                        : "bg-[#0A2540]/20 text-[#0A2540]"
                    : isDisabled
                      ? "bg-gray-200 text-gray-400"
                      : "bg-gray-100 text-gray-700"
                }`}
              >
                {index + 1}
              </div>
              <span className={`text-xs font-medium uppercase tracking-wider ${secondaryTextColorClasses}`}>
                {label ? label : `Module ${index + 1}`}
              </span>
            </div>
          )}
          <div className="ml-auto">
            {isComingSoon ? (
              <span
                className={`inline-flex items-center gap-1 rounded px-2.5 py-1 text-xs font-semibold ${
                  isColoredVariant
                    ? isBlueVariant
                      ? "bg-white/20 text-white border border-white/30"
                      : "bg-[#0A2540]/20 text-[#0A2540] border border-[#0A2540]/30"
                    : "bg-blue-50 text-blue-700 border border-blue-200"
                }`}
              >
                🚀 Bientôt disponible
              </span>
            ) : isLocked ? (
              <span
                className={`inline-flex items-center gap-1 rounded px-2.5 py-1 text-xs font-semibold ${
                  isColoredVariant
                    ? isBlueVariant
                      ? "bg-white/10 text-white/70 border border-white/20"
                      : "bg-[#0A2540]/10 text-[#0A2540]/70 border border-[#0A2540]/20"
                    : "bg-gray-200 text-gray-500 border border-gray-300"
                }`}
              >
                🔒 Verrouillé
              </span>
            ) : showDifficultyBadge ? (
              <span className={badgeClassesForDifficulty(track.difficulty)}>
                {track.difficulty}
              </span>
            ) : null}
          </div>
        </div>
      )}

      {/* Contenu */}
      <h3 className={`text-lg md:text-xl font-bold mb-3 leading-tight ${textColorClasses}`}>
        {track.title}
      </h3>
      <p className={`text-sm md:text-base leading-relaxed flex-1 mb-6 ${secondaryTextColorClasses}`}>
        {track.description}
      </p>

      {/* Message de verrouillage */}
      {isLocked && !isFirstModule && !previousModuleCompleted && !isComingSoon && (
        <div className={`mb-4 p-3 rounded-lg ${
          isColoredVariant
            ? isBlueVariant
              ? "bg-white/10 border border-white/20"
              : "bg-[#0A2540]/10 border border-[#0A2540]/20"
            : "bg-yellow-50 border border-yellow-200"
        }`}>
          <p className={`text-xs ${
            isColoredVariant
              ? isBlueVariant
                ? "text-white/90"
                : "text-[#0A2540]/90"
              : "text-yellow-800"
          }`}>
            ⚠️ Complétez le module précédent pour débloquer ce module.
          </p>
        </div>
      )}

      {/* Message bientôt disponible */}
      {isComingSoon && (
        <div className={`mb-4 p-3 rounded-lg ${
          isColoredVariant
            ? isBlueVariant
              ? "bg-white/10 border border-white/20"
              : "bg-[#0A2540]/10 border border-[#0A2540]/20"
            : "bg-blue-50 border border-blue-200"
        }`}>
          <p className={`text-xs ${
            isColoredVariant
              ? isBlueVariant
                ? "text-white/90"
                : "text-[#0A2540]/90"
              : "text-blue-800"
          }`}>
            🚀 Ce module sera bientôt disponible. Restez connecté !
          </p>
        </div>
      )}

      {/* Footer */}
      <div className={`mt-auto pt-4 border-t ${
        isColoredVariant
          ? isBlueVariant
            ? "border-white/20"
            : "border-[#0A2540]/20"
          : "border-gray-100"
      }`}>
        {isComingSoon ? (
          <div className={`inline-flex items-center justify-center w-full rounded-md px-4 py-2.5 text-sm font-semibold cursor-not-allowed ${
            isColoredVariant
              ? isBlueVariant
                ? "bg-white/20 text-white"
                : "bg-[#0A2540]/20 text-[#0A2540]"
              : "bg-blue-100 text-blue-700"
          }`}>
            🚀 Bientôt disponible
          </div>
        ) : isLocked ? (
          <div className={`inline-flex items-center justify-center w-full rounded-md px-4 py-2.5 text-sm font-semibold cursor-not-allowed ${
            isColoredVariant
              ? isBlueVariant
                ? "bg-white/10 text-white/70"
                : "bg-[#0A2540]/10 text-[#0A2540]/70"
              : "bg-gray-200 text-gray-500"
          }`}>
            🔒 Module verrouillé
          </div>
        ) : (
          <Link
            href={track.slug || "#"}
            className={`inline-flex items-center justify-center w-full rounded-md px-4 py-2.5 text-sm font-semibold transition-colors ${
              isColoredVariant
                ? isBlueVariant
                  ? "bg-white text-[#0A2540] hover:bg-white/90"
                  : "bg-[#0A2540] text-white hover:bg-[#12335f]"
                : "bg-gray-900 text-white hover:bg-gray-800"
            }`}
          >
            {ctaLabel ?? "Accéder au module"}
          </Link>
        )}
      </div>
    </div>
  );
}
