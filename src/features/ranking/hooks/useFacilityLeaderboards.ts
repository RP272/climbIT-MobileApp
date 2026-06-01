import { fetchActiveFacilityLeaderboards, fetchFacilityLeaderboard } from "@/src/api/ranking.api";
import type {
  FetchActiveFacilityLeaderboardsOptions,
  FetchFacilityLeaderboardOptions,
} from "@/src/types/ranking";
import { useQuery } from "@tanstack/react-query";
import { rankingKeys } from "./useLeaderboard";

export function useActiveFacilityLeaderboards(options?: FetchActiveFacilityLeaderboardsOptions) {
  return useQuery({
    queryKey: rankingKeys.facilityLeaderboards(options),
    queryFn: () => fetchActiveFacilityLeaderboards(options),
  });
}

export function useFacilityLeaderboard(
  facilityId: string | null,
  options?: FetchFacilityLeaderboardOptions,
) {
  return useQuery({
    queryKey: rankingKeys.facilityLeaderboard(facilityId, options),
    queryFn: () => fetchFacilityLeaderboard(facilityId!, options),
    enabled: Boolean(facilityId),
  });
}
