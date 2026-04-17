import type {
  ChallengeMode,
  ClimbingGrade,
  ClimbingType,
  RouteCharacter,
  RouteStatus,
  SessionGoal,
} from "@/src/types/discover-filters";

export type Gym = {
  id: string;
  name: string;
  city: string;
  distanceKm: number;
  newRoutesCount: number;
  rating: number;
  imageUrl: string;
  tags: readonly string[];
  isOpenNow: boolean;
  climbingTypes: readonly ClimbingType[];
  gradeScaleRange: readonly [ClimbingGrade, ClimbingGrade];
  routeCharacters: readonly RouteCharacter[];
  sessionGoals: readonly SessionGoal[];
  routeStatuses: readonly RouteStatus[];
  hasChallenges: boolean;
};

export type RouteStyleTags = readonly [string] | readonly [string, string];

export type RecommendedRoute = {
  id: string;
  grade: string;
  gradeScale: ClimbingGrade;
  name: string;
  gymName: string;
  sector: string;
  climbingType: ClimbingType;
  climbingTypeLabel: string;
  distanceKm: number;
  isOpenNow: boolean;
  imageUrl: string;
  styleTags: RouteStyleTags;
  routeCharacters: readonly RouteCharacter[];
  sessionGoals: readonly SessionGoal[];
  routeStatuses: readonly RouteStatus[];
  hasChallenge: boolean;
  recommendationReason: string;
  badge?: string;
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
  distanceKm: number;
  isOpenNow: boolean;
  climbingTypes: readonly ClimbingType[];
  gradeScaleRange?: readonly [ClimbingGrade, ClimbingGrade];
  routeCharacters: readonly RouteCharacter[];
  sessionGoals: readonly SessionGoal[];
  routeStatuses: readonly RouteStatus[];
  mode: ChallengeMode;
};
