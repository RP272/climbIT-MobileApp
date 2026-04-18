import { fetchChallengesByGymId } from "@/src/api/discover.api";
import { useQuery } from "@tanstack/react-query";

export function useGymChallenges(gymId?: string) {
  return useQuery({
    queryKey: ["gymChallenges", gymId],
    queryFn: () => (gymId ? fetchChallengesByGymId(gymId) : Promise.resolve([])),
    enabled: Boolean(gymId),
    staleTime: 5 * 60 * 1000,
  });
}
