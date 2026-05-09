import { fetchRoutesByGymId } from "@/src/api/discover.api";
import { useQuery } from "@tanstack/react-query";

export function useGymRoutes(gymId?: string) {
  return useQuery({
    queryKey: ["gymRoutes", gymId],
    queryFn: () => (gymId ? fetchRoutesByGymId(gymId) : Promise.resolve([])),
    enabled: Boolean(gymId),
    staleTime: 5 * 60 * 1000,
  });
}
