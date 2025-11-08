#!/usr/bin/env node

/**
 * Script pour recadrer et optimiser le logo FinX Academy
 * 
 * Ce script :
 * - Recadre automatiquement le logo pour supprimer les marges blanches
 * - Garde le fond transparent
 * - Optimise le poids du PNG (compression sans perte)
 * - Génère finx-logo-navbar.png optimisé pour la navbar
 */

const fs = require('fs');
const path = require('path');

console.log('📸 Optimisation du logo FinX Academy\n');

// Vérifier si sharp est disponible
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('❌ Erreur: sharp n\'est pas installé.');
  console.log('\n📦 Installation de sharp...');
  console.log('   Exécutez: npm install --save-dev sharp\n');
  process.exit(1);
}

const inputPath = path.join(__dirname, '../public/images/Logo.png');
const outputPath = path.join(__dirname, '../public/images/finx-logo-navbar.png');

// Vérifier que le fichier source existe
if (!fs.existsSync(inputPath)) {
  console.error(`❌ Erreur: Le fichier ${inputPath} n'existe pas.`);
  console.log('   Assurez-vous que Logo.png est dans public/images/\n');
  process.exit(1);
}

async function optimizeLogo() {
  try {
    console.log('🔍 Analyse du logo...');
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    console.log(`   Dimensions: ${metadata.width}x${metadata.height}px`);
    console.log(`   Format: ${metadata.format}`);
    console.log(`   Taille actuelle: ${(fs.statSync(inputPath).size / 1024).toFixed(2)} KB\n`);

    console.log('✂️  Recadrage et optimisation (sans détourage automatique)...');
    
    // Recadrer et optimiser le logo
    // Le détourage sera fait manuellement par l'utilisateur
    const trimmed = await image
      .ensureAlpha() // Garantir un canal alpha (RGBA)
      .trim({
        threshold: 10, // Seuil pour détecter les bords transparents/blancs
        lineArt: false
      })
      .png({
        compressionLevel: 9, // Compression maximale sans perte
        adaptiveFiltering: true, // Filtrage adaptatif pour meilleure compression
        force: true, // Forcer le format PNG
        palette: false // Forcer RGBA (pas de palette) pour garantir la transparence alpha
      })
      .toFile(outputPath);

    const newSize = fs.statSync(outputPath).size;
    const reduction = ((1 - newSize / fs.statSync(inputPath).size) * 100).toFixed(1);

    console.log('✅ Optimisation terminée !\n');
    console.log(`   Nouveau fichier: finx-logo-navbar.png`);
    console.log(`   Dimensions: ${trimmed.width}x${trimmed.height}px`);
    console.log(`   Nouvelle taille: ${(newSize / 1024).toFixed(2)} KB`);
    console.log(`   Réduction: ${reduction}%\n`);
    console.log('🎉 Logo optimisé et prêt pour la navbar !\n');

  } catch (error) {
    console.error('❌ Erreur lors de l\'optimisation:', error.message);
    process.exit(1);
  }
}

optimizeLogo();

