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

export interface ClimbAttemptFacilityRecordDto {
  id: string;
  name: string | null;
}

export interface ClimbAttemptRouteRecordDto {
  id: string;
  name: string | null;
  facility_id: string | null;
  facility: ClimbAttemptFacilityRecordDto | null;
}

export interface ClimbAttemptClimberRecordDto {
  id: string;
  nickname: string | null;
}

export type ClimbAttemptCreateRequestDto = {
  routeId: string;
  duration?: number | null;
  type?: string | null;
};

export type ClimbAttemptCreateResponseDto = {
  id: string;
};

export type ClimbAttemptApiEntry = {
  id: string;
  climbAttemptId?: string;
  totalVotesFor?: number;
  totalVotesAgainst?: number;
};

export interface ClimbAttemptListApiEntry {
  id: string;
  route_id?: string | null;
  routeId?: string | null;
  attempt_date?: string | null;
  attemptDate?: string | null;
  duration?: number | null;
  type?: string | null;
  admin_decision?: boolean | null;
  adminDecision?: boolean | null;
  reviewed_by_admin_id?: string | null;
  reviewedByAdminId?: string | null;
  totalVotesFor?: number;
  totalVotesAgainst?: number;
  awarded_points?: number;
  awardedPoints?: number;
  climber: ClimbAttemptClimberRecordDto | null;
  route: ClimbAttemptRouteRecordDto | null;
}

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
