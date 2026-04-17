export type RadiusKm = number;

export const MIN_RADIUS_KM = 0;
export const MAX_RADIUS_KM = 50;
export const RADIUS_STEP_KM = 0.1;
export const NEARBY_RADIUS_KM = 5;

export type ClimbingType = "bouldering" | "rope" | "auto-belay";

export type ClimbingGrade = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

export type RouteCharacter =
  | "technical"
  | "power"
  | "balance"
  | "dynamic"
  | "endurance"
  | "overhang";

export type SessionGoal = "warmup" | "training" | "project" | "technique" | "fun";

export type RouteStatus = "new" | "popular" | "not-done";

export type ChallengeMode = "with-challenge";

export type GradeRange = {
  min: ClimbingGrade | null;
  max: ClimbingGrade | null;
};

export type DiscoverFilters = {
  radiusKm: RadiusKm;
  openNow: boolean;
  climbingTypes: ClimbingType[];
  gradeRange: GradeRange;
  routeCharacters: RouteCharacter[];
  sessionGoals: SessionGoal[];
  routeStatuses: RouteStatus[];
  challengeModes: ChallengeMode[];
};

export const DEFAULT_DISCOVER_FILTERS: DiscoverFilters = {
  radiusKm: MAX_RADIUS_KM,
  openNow: false,
  climbingTypes: [],
  gradeRange: {
    min: null,
    max: null,
  },
  routeCharacters: [],
  sessionGoals: [],
  routeStatuses: [],
  challengeModes: [],
};
