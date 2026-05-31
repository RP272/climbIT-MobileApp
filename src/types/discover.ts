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
  description?: string;
  address?: string;
  coordinates?: GymCoordinates;
  phone?: string;
  websiteUrl?: string;
  openingHours?: readonly GymOpeningHours[];
  amenities?: readonly string[];
  priceLabel?: string;
  settingSchedule?: string;
  busyHoursLabel?: string;
};

export type GymCoordinates = {
  latitude: number;
  longitude: number;
};

export type GymWeekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type GymOpeningHours = {
  day: GymWeekday;
  label: string;
  hours: string;
};

export type RouteStyleTags = readonly [string] | readonly [string, string];
export type ClimbProfile = "Slab" | "Vertical" | "Overhang";
export type ClimbStyle = "Warmup" | "Dyno" | "Power" | "Endurance" | "Technical" | "Balance";
export type ClimbStyleTags = readonly [ClimbStyle] | readonly [ClimbStyle, ClimbStyle];

export type RecommendedRoute = {
  id: string;
  gymId: string;
  grade: string;
  gradeScale: ClimbingGrade;
  name: string;
  gymName: string;
  sector: string;
  routeSetterId?: string;
  climbingType: ClimbingType;
  climbingTypeLabel: string;
  distanceKm: number;
  isOpenNow: boolean;
  imageUrl: string;
  holdLabel: string;
  climbProfile: ClimbProfile;
  climbStyles: ClimbStyleTags;
  styleTags: RouteStyleTags;
  holdColorHex?: string;
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
  gymId?: string;
  title: string;
  description?: string;
  progressLabel: string;
  progress: number;
  progressCount: number;
  requiredCount: number;
  rewardXp: number;
  rewardLabel?: string;
  expiresLabel?: string;
  difficultyLabel?: string;
  suggestedActionLabel?: string;
  rules?: readonly string[];
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
