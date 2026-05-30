import { fetchRoutesByGymId } from "@/src/api/discover.api";
import { useQuery } from "@tanstack/react-query";

export function useGymRoutes(gymId?: string, gymName?: string) {
  return useQuery({
    queryKey: ["gymRoutes", gymId, gymName],
    queryFn: () => (gymId ? fetchRoutesByGymId(gymId, gymName ?? "") : Promise.resolve([])),
    enabled: Boolean(gymId),
    staleTime: 5 * 60 * 1000,
  });
}
