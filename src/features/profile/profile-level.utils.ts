export interface LevelInfo {
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number;
  xpToNextLevel: number;
}

/**
 * Oblicza poziom oraz postęp na podstawie łącznej liczby punktów.
 *
 * Wymagana liczba punktów do osiągnięcia kolejnego poziomu jest wyliczana według wzoru:
 * wymaganie dla następnego poziomu = aktualne wymaganie + 200 + (poziom * 50)
 *
 * Uwaga: progi są tymczasowe i powinny zostać zsynchronizowane z logiką backendu.
 * Przykładowe progi punktowe:
 * Poziom 1: 0 pkt
 * Poziom 2: 250 pkt (0 + 200 + 50)
 * Poziom 3: 550 pkt (250 + 200 + 100)
 * Poziom 4: 900 pkt (550 + 200 + 150)
 */
export function calculateLevelContext(totalPoints: number): LevelInfo {
  let level = 1;
  let currentLevelXp = 0;
  let nextLevelXp = 250;

  while (totalPoints >= nextLevelXp) {
    level++;
    currentLevelXp = nextLevelXp;
    nextLevelXp = currentLevelXp + (200 + level * 50);
  }

  const xpRequiredForNextLevel = nextLevelXp - currentLevelXp;
  const xpEarnedInCurrentLevel = Math.max(0, totalPoints - currentLevelXp);
  const progressPercent = Math.min(
    100,
    Math.round((xpEarnedInCurrentLevel / xpRequiredForNextLevel) * 100),
  );
  const xpToNextLevel = nextLevelXp - totalPoints;

  return {
    level,
    currentLevelXp,
    nextLevelXp,
    progressPercent,
    xpToNextLevel,
  };
}
