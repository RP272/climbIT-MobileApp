export type ProfileStatIconName =
  | "bookmark"
  | "building"
  | "flame"
  | "gauge"
  | "palette"
  | "route"
  | "sparkles"
  | "sun"
  | "target"
  | "trophy";

export type ProfileStat = {
  id: string;
  label: string;
  value: string;
  currentValue?: number;
  unit?: string;
  description: string;
  iconName: ProfileStatIconName;
  levels?: StatLevel[];
};

export type StatLevel = {
  level: number;
  threshold: number;
  label: string;
};

export type StatLevelProgress = {
  levelLabel: string;
  nextLabel: string;
  progress: number;
};

export type GradeSummary = {
  levels: StatLevel[];
  currentThreshold: number;
  currentLevelLabel: string;
  nextLabel?: string;
};
