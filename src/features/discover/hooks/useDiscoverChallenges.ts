import { fetchChallengeById, fetchWeeklyChallenges } from "@/src/api/discover.api";
import { useQuery } from "@tanstack/react-query";

export const discoverChallengeKeys = {
  all: ["discover"] as const,
  challenges: () => [...discoverChallengeKeys.all, "challenges"] as const,
  weekly: () => [...discoverChallengeKeys.challenges(), "weekly"] as const,
  detail: (challengeId: string) =>
    [...discoverChallengeKeys.challenges(), "detail", challengeId] as const,
};

export function useDiscoverChallenges() {
  return useQuery({
    queryKey: discoverChallengeKeys.weekly(),
    queryFn: () => fetchWeeklyChallenges(),
  });
}

export function useChallengeDetails(challengeId: string | undefined) {
  return useQuery({
    queryKey: discoverChallengeKeys.detail(challengeId ?? ""),
    queryFn: () => fetchChallengeById(challengeId ?? ""),
    enabled: Boolean(challengeId),
  });
}
