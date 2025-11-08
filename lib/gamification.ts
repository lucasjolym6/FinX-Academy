/**
 * Fonction pour calculer l'XP gagné selon l'action
 */
export function xpForAction(action: 'lesson' | 'quiz' | 'perfectScore'): number {
  switch (action) {
    case 'lesson':
      return 10; // Leçon terminée → +10 XP
    case 'quiz':
      return 20; // Quiz complété → +20 XP
    case 'perfectScore':
      return 10; // 100% quiz → +10 XP bonus
    default:
      return 0;
  }
}

/**
 * Fonction pour calculer le niveau selon l'XP total
 */
export function calculateLevel(xp: number): number {
  if (xp < 100) {
    return 1; // 0-99 XP → Niveau 1
  } else if (xp < 250) {
    return 2; // 100-249 XP → Niveau 2
  } else if (xp < 500) {
    return 3; // 250-499 XP → Niveau 3
  } else {
    // 500+ XP → Niveau 4, puis chaque 500 XP supplémentaire = +1 niveau
    return 4 + Math.floor((xp - 500) / 500);
  }
}

/**
 * Fonction pour calculer l'XP nécessaire pour atteindre le niveau suivant
 */
export function xpToNextLevel(currentXp: number): number {
  const currentLevel = calculateLevel(currentXp);
  const xpForCurrentLevel = getXpForLevel(currentLevel);
  const xpForNextLevel = getXpForLevel(currentLevel + 1);
  
  return xpForNextLevel - currentXp;
}

/**
 * Fonction helper pour obtenir l'XP minimum requis pour un niveau donné
 */
function getXpForLevel(level: number): number {
  if (level <= 1) {
    return 0;
  } else if (level === 2) {
    return 100;
  } else if (level === 3) {
    return 250;
  } else if (level === 4) {
    return 500;
  } else {
    // Niveau 5+ : 500 + (niveau - 4) * 500
    return 500 + (level - 4) * 500;
  }
}

/**
 * Fonction pour obtenir l'XP minimum du niveau actuel
 */
export function getXpForCurrentLevel(currentXp: number): number {
  const level = calculateLevel(currentXp);
  return getXpForLevel(level);
}

/**
 * Fonction pour obtenir l'XP minimum du niveau suivant
 */
export function getXpForNextLevel(currentXp: number): number {
  const level = calculateLevel(currentXp);
  return getXpForLevel(level + 1);
}

