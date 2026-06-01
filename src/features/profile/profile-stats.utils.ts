import type {
  GradeSummary,
  ProfileStat,
  StatLevelProgress,
} from "@/src/features/profile/profile-stats.types";

const STAT_LABELS: Record<string, string> = {
  tops: "Zaliczone trasy",
  flashes: "Flashe",
  projects: "Projekty",
  "max-grade": "Najwyższa wycena",
};

const LEVEL_LABELS: Record<number, string> = {
  1: "I",
  2: "II",
  3: "III",
  4: "IV",
  5: "V",
};

export function getProfileStatLabel(stat: ProfileStat) {
  return STAT_LABELS[stat.id] ?? stat.label;
}

export function getStatLevelProgress(stat: ProfileStat): StatLevelProgress | null {
  if (typeof stat.currentValue !== "number" || !stat.levels || stat.levels.length === 0) {
    return null;
  }

  const currentValue = stat.currentValue;
  const levels = getSortedStatLevels(stat);
  const currentLevel = [...levels].reverse().find((level) => currentValue >= level.threshold);
  const nextLevel = levels.find((level) => currentValue < level.threshold);

  if (!nextLevel) {
    return {
      levelLabel: currentLevel ? `Poziom ${formatLevel(currentLevel.level)}` : "Poziom 0",
      nextLabel: "Maksymalny poziom",
      progress: 100,
    };
  }

  const previousThreshold = currentLevel?.threshold ?? 0;
  const progressRange = Math.max(nextLevel.threshold - previousThreshold, 1);
  const rawProgress = ((currentValue - previousThreshold) / progressRange) * 100;
  const progress = Math.max(0, Math.min(Math.round(rawProgress), 100));

  return {
    levelLabel: currentLevel ? `Poziom ${formatLevel(currentLevel.level)}` : "Poziom 0",
    nextLabel: `Następny próg: ${nextLevel.label}`,
    progress,
  };
}

export function getGradeSummary(stat: ProfileStat): GradeSummary {
  const levels = getSortedStatLevels(stat);
  const currentValue = stat.currentValue ?? 0;
  const currentLevel = [...levels].reverse().find((level) => currentValue >= level.threshold);
  const nextLevel = levels.find((level) => currentValue < level.threshold);

  return {
    levels,
    currentThreshold: currentLevel?.threshold ?? currentValue,
    currentLevelLabel: currentLevel ? `Poziom ${formatLevel(currentLevel.level)}` : "Poziom 0",
    nextLabel: nextLevel?.label,
  };
}

function getSortedStatLevels(stat: ProfileStat) {
  return [...(stat.levels ?? [])].sort((first, second) => first.threshold - second.threshold);
}

function formatLevel(level: number) {
  return LEVEL_LABELS[level] ?? String(level);
}
