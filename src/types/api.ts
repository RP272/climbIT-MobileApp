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
  nickname?: string;
}

export interface ClimbAttemptFacilityRecordDto {
  id: string;
  name?: string;
}

export interface ClimbAttemptRouteRecordDto {
  id: string;
  name?: string;
  facilityId?: string;
  facility_id?: string;
  facility?: ClimbAttemptFacilityRecordDto;
}

export type ClimbAttemptTypeDto = "TOP" | "FLASH" | "ZONE" | "Top" | "Flash" | "Zone";

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
  type?: ClimbAttemptTypeDto;
  awardedPoints?: number;
  awarded_points?: number;
  climber?: ClimbAttemptClimberRecordDto;
  route?: ClimbAttemptRouteRecordDto;
}
