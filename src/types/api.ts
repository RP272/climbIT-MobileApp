export type LeaderboardApiEntry = {
  rank: number;
  nickname: string | null;
  skillLevel: string | null;
  totalPoints: number;
};

export type VideoApiEntry = {
  id: string | null;
  climbAttemptId: string;
  fileUrl: string | null;
  fileFormat: string | null;
  size: number | null;
  uploadedAt: string | null;
  title?: string | null;
  authorNickname?: string | null;
  routeName?: string | null;
  facilityName?: string | null;
  total_votes_for?: number;
  total_votes_against?: number;
  totalVotesFor?: number;
  totalVotesAgainst?: number;
};

export type FacilityApiEntry = {
  id: string;
  name: string;
  address: string | null;
  description: string | null;
};

export type RouteApiEntry = {
  id: string;
  name: string;
  description: string | null;
  facilityId: string | null;
  sector: string | null;
  difficultyLevel: string | null;
  basePoints: number | null;
  status: string | null;
};

export interface ClimberResponseDto {
  id: string;
  nickname: string;
  skillLevel: string;
  totalPoints: number;
  favouriteFacilityId?: string;
  profilePhotoUrl?: string;
}

export interface FacilityResponseDto {
  id: string;
  name: string;
  address?: string;
  description?: string;
}

export interface ClimbAttemptPerDayDto {
  date: string;
  numberOfAttempts: number;
}

export interface ClimberRouteListDto {
  id?: string;
  climberId?: string;
  climber_id?: string;
  routeId?: string;
  route_id?: string;
  createdAt?: string;
  created_at?: string;
}

export interface RouteListCreateRequestDto {
  routeId: string;
}

export type RouteStatusDto = "ACTIVE" | "INACTIVE" | "PLANNED";
export type RouteTypeDto = "BOULDER" | "ROPE" | "AUTO_BELAY";
export type RouteHoldDto = "JUG" | "CRIMP" | "SLOPER" | "PINCH" | "POCKET" | "EDGE";
export type RouteClimbProfileDto = "Slab" | "Vertical" | "Overhang";
export type RouteClimbStyleDto =
  | "Warmup"
  | "Dyno"
  | "Power"
  | "Endurance"
  | "Technical"
  | "Balance";

export interface RouteProfileResponseDto {
  id?: string;
  profile?: RouteClimbProfileDto | string;
}

export interface RouteStyleResponseDto {
  id?: string;
  style?: RouteClimbStyleDto | string;
}

export interface RouteSetterResponseDto {
  id: string;
  firstName?: string;
  lastName?: string;
  siteUrl?: string;
  instagramUrl?: string;
  createdAt?: string;
}

export interface RouteResponseDto {
  id: string;
  name: string;
  description?: string;
  facilityId?: string;
  sector?: string;
  routeSetterId?: string;
  route_setter_id?: string;
  climbProfile?: RouteClimbProfileDto | string;
  climb_profile?: RouteClimbProfileDto | string;
  profile?: RouteClimbProfileDto | string;
  profiles?: readonly (RouteClimbProfileDto | RouteProfileResponseDto | string)[];
  climbStyle?: RouteClimbStyleDto | string;
  climb_style?: RouteClimbStyleDto | string;
  style?: RouteClimbStyleDto | string;
  styles?: readonly (RouteClimbStyleDto | RouteStyleResponseDto | string)[];
  difficultyGrade?: number;
  basePoints?: number;
  status?: RouteStatusDto;
  type?: RouteTypeDto;
  hold?: RouteHoldDto;
  color?: string;
  createdAt?: string;
}

export interface ChallengeResponseDto {
  id: string;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  bonusPoints?: number;
  requiredCount?: number;
  progress?: ChallengeProgressDto;
  routeIds: string[];
}

export interface ChallengeProgressDto {
  progressCount?: number;
  completed?: boolean;
  completedAt?: string;
}

export interface LeaderboardResponseDto {
  rank: number;
  nickname?: string;
  skillLevel?: string;
  totalPoints: number;
}

export interface ClimbAttemptClimberRecordDto {
  id: string;
  nickname?: string | null;
}

export interface ClimbAttemptFacilityRecordDto {
  id: string;
  name?: string | null;
}

export interface ClimbAttemptRouteRecordDto {
  id: string;
  name?: string | null;
  facilityId?: string;
  facility_id?: string | null;
  facility?: ClimbAttemptFacilityRecordDto | null;
}

export type ClimbAttemptTypeDto = "TOP" | "FLASH" | "ZONE" | "Top" | "Flash" | "Zone";

export type ClimbAttemptCreateRequestDto = {
  routeId: string;
  duration?: number | null;
  type?: string | null;
};

export type ClimbAttemptCreateResponseDto = {
  id: string;
};

export type ClimbAttemptCurrentUserVote = "for" | "against";

export type ClimbAttemptApiEntry = {
  id: string;
  climbAttemptId?: string;
  total_votes_for?: number;
  total_votes_against?: number;
  totalVotesFor?: number;
  totalVotesAgainst?: number;
};

export interface ClimbAttemptListRecordDto {
  id: string;
  climberId?: string;
  climber_id?: string;
  routeId?: string;
  route_id?: string;
  attemptDate?: string;
  attempt_date?: string;
  duration?: number;
  reviewedByAdminId?: string;
  reviewed_by_admin_id?: string;
  adminDecision?: boolean;
  admin_decision?: boolean;
  totalVotesFor?: number;
  total_votes_for?: number;
  totalVotesAgainst?: number;
  total_votes_against?: number;
  finalSuccess?: boolean;
  final_success?: boolean;
  type?: ClimbAttemptTypeDto | string | null;
  awardedPoints?: number;
  awarded_points?: number;
  currentUserVote?: ClimbAttemptCurrentUserVote | null;
  current_user_vote?: ClimbAttemptCurrentUserVote | null;
  climber?: ClimbAttemptClimberRecordDto | null;
  route?: ClimbAttemptRouteRecordDto | null;
}

export interface ClimbAttemptListApiEntry extends ClimbAttemptListRecordDto {
  climber: ClimbAttemptClimberRecordDto | null;
  route: ClimbAttemptRouteRecordDto | null;
}

export type ClimbAttemptDetailApiEntry = ClimbAttemptListApiEntry & {
  currentUserVote?: ClimbAttemptCurrentUserVote | null;
  current_user_vote?: ClimbAttemptCurrentUserVote | null;
};

export interface OnboardingStatusResponseDto {
  completed: boolean;
  skillLevel: string | null;
  nickname: string | null;
  favouriteFacilityId: string | null;
  profilePhotoUrl: string | null;
}

export interface OnboardingCompleteRequestDto {
  skillLevel: string | null;
  nickname: string | null;
  favouriteFacilityId?: string | null;
  profilePhotoUrl?: string | null;
}

export type OnboardingCompleteResponseDto = OnboardingStatusResponseDto;
