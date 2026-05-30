import { fetchLeaderboard } from "@/src/api/ranking.api";
import type { FetchLeaderboardOptions, LeaderboardScope } from "@/src/types/ranking";
import { useQuery } from "@tanstack/react-query";

export const rankingKeys = {
  all: ["ranking"] as const,
  leaderboard: (scope: LeaderboardScope, options?: FetchLeaderboardOptions) =>
    [
      ...rankingKeys.all,
      "leaderboard",
      scope,
      options?.limit ?? null,
      options?.offset ?? null,
    ] as const,
};

export function useLeaderboard(scope: LeaderboardScope, options?: FetchLeaderboardOptions) {
  return useQuery({
    queryKey: rankingKeys.leaderboard(scope, options),
    queryFn: () => fetchLeaderboard(scope, options),
  });
}
