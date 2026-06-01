import { apiClient } from "@/src/api/api.client";
import { ClimbAttemptPerDayDto, ClimberResponseDto, FacilityResponseDto } from "@/src/types/api";

export interface ClimberProfileDetails {
  climber: ClimberResponseDto;
  favouriteFacility?: FacilityResponseDto;
}

export async function fetchClimberProfile(climberId: string): Promise<ClimberResponseDto> {
  const response = await apiClient.get<ClimberResponseDto>(`/climbers/${climberId}`);
  return response.data;
}

export async function fetchFacility(facilityId: string): Promise<FacilityResponseDto> {
  const response = await apiClient.get<FacilityResponseDto>(`/facilities/${facilityId}`);
  return response.data;
}

export async function fetchWeeklyClimbAttempts(): Promise<ClimbAttemptPerDayDto[]> {
  const response = await apiClient.get<ClimbAttemptPerDayDto[]>("/statistics/climb-attempts");
  return response.data;
}

export async function fetchClimberProfileDetails(
  climberId: string,
): Promise<ClimberProfileDetails> {
  const climber = await fetchClimberProfile(climberId);
  const favouriteFacilityId = climber.favouriteFacilityId;

  if (!favouriteFacilityId) {
    return { climber };
  }

  const favouriteFacility = await fetchFacility(favouriteFacilityId);

  return {
    climber,
    favouriteFacility,
  };
}
