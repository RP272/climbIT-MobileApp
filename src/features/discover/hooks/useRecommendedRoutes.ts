import {
  fetchRecommendedRoutes,
  fetchRouteById,
  fetchRouteSetterById,
} from "@/src/api/discover.api";
import { useQuery } from "@tanstack/react-query";

export const recommendedRoutesKeys = {
  all: ["discover", "routes"] as const,
  recommended: () => [...recommendedRoutesKeys.all, "recommended"] as const,
  details: (routeId: string) => [...recommendedRoutesKeys.all, "details", routeId] as const,
  routeSetter: (routeSetterId: string) =>
    [...recommendedRoutesKeys.all, "route-setter", routeSetterId] as const,
};

export function useRecommendedRoutes() {
  return useQuery({
    queryKey: recommendedRoutesKeys.recommended(),
    queryFn: () => fetchRecommendedRoutes(),
  });
}

export function useRouteDetails(routeId?: string) {
  return useQuery({
    queryKey: recommendedRoutesKeys.details(routeId ?? ""),
    queryFn: () => fetchRouteById(routeId ?? ""),
    enabled: Boolean(routeId),
  });
}

export function useRouteSetterDetails(routeSetterId: string | undefined) {
  return useQuery({
    queryKey: recommendedRoutesKeys.routeSetter(routeSetterId ?? ""),
    queryFn: () => fetchRouteSetterById(routeSetterId ?? ""),
    enabled: Boolean(routeSetterId),
  });
}
