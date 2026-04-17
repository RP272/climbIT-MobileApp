export type Gym = {
  id: string;
  name: string;
  city: string;
  distanceKm: number;
  newRoutesCount: number;
  rating: number;
  imageUrl: string;
  tags: readonly string[];
};

export type ChallengeTone = "primary" | "cyan" | "amber" | "rose" | "sky" | "emerald";

export type ChallengeIconName = "flame" | "mountain" | "repeat" | "sparkles" | "star" | "zap";

export type Challenge = {
  id: string;
  title: string;
  progressLabel: string;
  progress: number;
  rewardXp: number;
  iconName: ChallengeIconName;
  tone: ChallengeTone;
};
