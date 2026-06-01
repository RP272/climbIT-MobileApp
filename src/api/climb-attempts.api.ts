import { apiRequest } from "@/src/api/client";
import type {
  ClimbAttemptApiEntry,
  ClimbAttemptCreateRequestDto,
  ClimbAttemptCreateResponseDto,
  ClimbAttemptListApiEntry,
} from "@/src/types/api";

export async function fetchClimbAttempts(): Promise<ClimbAttemptListApiEntry[]> {
  return apiRequest<ClimbAttemptListApiEntry[]>("/climb-attempts");
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
