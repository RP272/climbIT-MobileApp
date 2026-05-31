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
