import {
  fetchChallengeById,
  fetchChallengeRoutes,
  fetchWeeklyChallenges,
} from "@/src/api/discover.api";
import { useQuery } from "@tanstack/react-query";

export const discoverChallengeKeys = {
  all: ["discover"] as const,
  challenges: () => [...discoverChallengeKeys.all, "challenges"] as const,
  weekly: () => [...discoverChallengeKeys.challenges(), "weekly"] as const,
  detail: (challengeId: string) =>
    [...discoverChallengeKeys.challenges(), "detail", challengeId] as const,
  routes: (challengeId: string) =>
    [...discoverChallengeKeys.challenges(), "routes", challengeId] as const,
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

export function useChallengeRoutes(challengeId: string | undefined) {
  return useQuery({
    queryKey: discoverChallengeKeys.routes(challengeId ?? ""),
    queryFn: () => fetchChallengeRoutes(challengeId ?? ""),
    enabled: Boolean(challengeId),
    staleTime: 5 * 60 * 1000,
  });
}
