import { apiRequest } from "@/src/api/client";
import type {
  OnboardingCompleteRequestDto,
  OnboardingCompleteResponseDto,
  OnboardingStatusResponseDto,
} from "@/src/types/api";

export async function fetchOnboardingStatus(): Promise<OnboardingStatusResponseDto> {
  return apiRequest<OnboardingStatusResponseDto>("/onboarding/status");
}

export async function completeOnboarding(
  payload: OnboardingCompleteRequestDto,
): Promise<OnboardingCompleteResponseDto> {
  return apiRequest<OnboardingCompleteResponseDto>("/onboarding/complete", {
    method: "POST",
    data: payload,
  });
}
