"use client";

import { useState } from "react";

interface BadgeCardProps {
  icon: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedDate?: string;
  onClick?: () => void;
}

export default function BadgeCard({
  icon,
  title,
  description,
  unlocked,
  unlockedDate,
  onClick,
}: BadgeCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (unlocked && onClick) {
      setIsAnimating(true);
      onClick();
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`relative rounded-2xl p-6 transition-all cursor-pointer ${
        unlocked
          ? "bg-white shadow-lg hover:shadow-xl hover:scale-105 border-2 border-accent"
          : "bg-gray-100 border-2 border-gray-300 opacity-50"
      } ${isAnimating ? "animate-pulse" : ""}`}
    >
      {/* Badge Icon */}
      <div
        className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-4xl transition-all ${
          unlocked
            ? "bg-gradient-to-br from-accent to-accent-light shadow-lg"
            : "bg-gray-300"
        } ${isAnimating ? "scale-125 rotate-12" : ""}`}
      >
        {icon}
      </div>

      {/* Badge Title */}
      <h3
        className={`text-lg font-bold text-center mb-2 ${
          unlocked ? "text-primary" : "text-gray-500"
        }`}
      >
        {title}
      </h3>

      {/* Badge Description */}
      <p
        className={`text-sm text-center ${
          unlocked ? "text-gray-600" : "text-gray-400"
        }`}
      >
        {description}
      </p>

      {/* Unlocked Date */}
      {unlocked && unlockedDate && (
        <p className="text-xs text-gray-500 text-center mt-2">
          {unlockedDate}
        </p>
      )}

      {/* Locked Badge Overlay */}
      {!unlocked && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xl">🔒</span>
          </div>
        </div>
      )}

      {/* Sparkle animation for unlocked badges */}
      {unlocked && (
        <div className="absolute top-2 right-2">
          <span className="text-accent text-lg animate-pulse">✨</span>
        </div>
      )}
    </div>
  );
}

