import { fetchRecommendedRoutes, fetchRouteSetterById } from "@/src/api/discover.api";
import { useQuery } from "@tanstack/react-query";

export const recommendedRoutesKeys = {
  all: ["discover", "routes"] as const,
  recommended: () => [...recommendedRoutesKeys.all, "recommended"] as const,
  routeSetter: (routeSetterId: string) =>
    [...recommendedRoutesKeys.all, "route-setter", routeSetterId] as const,
};

export function useRecommendedRoutes() {
  return useQuery({
    queryKey: recommendedRoutesKeys.recommended(),
    queryFn: () => fetchRecommendedRoutes(),
  });
}

export function useRouteSetterDetails(routeSetterId: string | undefined) {
  return useQuery({
    queryKey: recommendedRoutesKeys.routeSetter(routeSetterId ?? ""),
    queryFn: () => fetchRouteSetterById(routeSetterId ?? ""),
    enabled: Boolean(routeSetterId),
  });
}
