"use client";

import Image from "next/image";
import { useState } from "react";

interface LogoProps {
  className?: string;
  height?: number;
}

export default function Logo({ className = "h-10 w-auto", height = 40 }: LogoProps) {
  const [imageError, setImageError] = useState(false);
  const [imageName, setImageName] = useState<"Logo" | "logo">("Logo");
  const [imageFormat, setImageFormat] = useState<"png" | "svg">("png");

  const handleImageError = () => {
    // Essayer Logo.png en premier, puis logo.png, puis Logo.svg, puis logo.svg
    if (imageName === "Logo" && imageFormat === "png") {
      // Essayer logo.png (minuscule)
      setImageName("logo");
    } else if (imageName === "logo" && imageFormat === "png") {
      // Essayer Logo.svg (majuscule)
      setImageName("Logo");
      setImageFormat("svg");
    } else if (imageName === "Logo" && imageFormat === "svg") {
      // Essayer logo.svg (minuscule)
      setImageName("logo");
    } else {
      // Aucun format ne fonctionne, afficher le fallback
      setImageError(true);
    }
  };

  // Si l'image n'existe pas, afficher le fallback
  if (imageError) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
          <span className="text-accent font-bold text-xl">F</span>
        </div>
        <span className="text-xl font-bold text-primary">FinX Academy</span>
      </div>
    );
  }

  return (
    <Image
      src={`/images/${imageName}.${imageFormat}`}
      alt="FinX Academy"
      width={240}
      height={80}
      className={className}
      priority
      onError={handleImageError}
    />
  );
}

