import { apiRequest } from "@/src/api/client";
import type {
  ClimbAttemptApiEntry,
  ClimbAttemptCreateRequestDto,
  ClimbAttemptCreateResponseDto,
  ClimbAttemptDetailApiEntry,
  ClimbAttemptListApiEntry,
} from "@/src/types/api";

export type FetchClimbAttemptsByClimberOptions = {
  limit?: number;
  offset?: number;
};

export async function fetchClimbAttempts(): Promise<ClimbAttemptListApiEntry[]> {
  return apiRequest<ClimbAttemptListApiEntry[]>("/climb-attempts");
}

export async function fetchClimbAttemptsByClimber(
  options: FetchClimbAttemptsByClimberOptions = {},
): Promise<ClimbAttemptListApiEntry[]> {
  const limit = options.limit ?? 10;
  const offset = options.offset ?? 0;

  return apiRequest<ClimbAttemptListApiEntry[]>("/climb-attempts/climber", {
    searchParams: { limit, offset },
  });
}

export async function fetchClimbAttemptById(
  climbAttemptId: string,
): Promise<ClimbAttemptDetailApiEntry> {
  return apiRequest<ClimbAttemptDetailApiEntry>(`/climb-attempts/${climbAttemptId}`);
}

export async function createClimbAttempt(
  payload: ClimbAttemptCreateRequestDto,
): Promise<ClimbAttemptCreateResponseDto> {
  return apiRequest<ClimbAttemptCreateResponseDto>("/climb-attempts", {
    method: "POST",
    data: payload,
  });
}

export async function voteOnClimbAttempt(
  climbAttemptId: string,
  isValid: boolean,
): Promise<ClimbAttemptApiEntry> {
  return apiRequest<ClimbAttemptApiEntry>(`/climb-attempts/${climbAttemptId}/vote`, {
    method: "POST",
    data: { isValid },
  });
}
