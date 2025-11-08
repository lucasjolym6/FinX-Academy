"use client";

import Image from "next/image";
import { useState } from "react";

interface NavbarLogoProps {
  className?: string;
}

/**
 * Composant Logo spécifique pour la Navbar
 * Cherche finx-logo-navbar.png (logo optimisé pour la navbar)
 * avec fallback sur Logo.png si le fichier optimisé n'existe pas
 */
export default function NavbarLogo({ className = "h-8 md:h-10 w-auto object-contain" }: NavbarLogoProps) {
  const [imageError, setImageError] = useState(false);
  const [imageName, setImageName] = useState<"finx-logo-navbar" | "Logo" | "logo">("finx-logo-navbar");
  const [imageFormat, setImageFormat] = useState<"png" | "svg">("png");

  const handleImageError = () => {
    // Essayer finx-logo-navbar.png en premier, puis Logo.png, puis logo.png, puis SVG
    if (imageName === "finx-logo-navbar" && imageFormat === "png") {
      // Essayer Logo.png (majuscule)
      setImageName("Logo");
    } else if (imageName === "Logo" && imageFormat === "png") {
      // Essayer logo.png (minuscule)
      setImageName("logo");
    } else if (imageName === "logo" && imageFormat === "png") {
      // Essayer finx-logo-navbar.svg
      setImageName("finx-logo-navbar");
      setImageFormat("svg");
    } else if (imageName === "finx-logo-navbar" && imageFormat === "svg") {
      // Essayer Logo.svg
      setImageName("Logo");
      setImageFormat("svg");
    } else {
      // Aucun format ne fonctionne, afficher le fallback
      setImageError(true);
    }
  };

  // Si l'image n'existe pas, afficher le fallback
  if (imageError) {
    return (
      <div className={`flex items-center space-x-2 ${className.includes('h-') ? '' : className}`}>
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
      width={150}
      height={60}
      className={className}
      priority
      onError={handleImageError}
      style={{
        objectFit: 'contain',
        objectPosition: 'center',
        backgroundColor: 'transparent',
        display: 'block'
      }}
    />
  );
}

