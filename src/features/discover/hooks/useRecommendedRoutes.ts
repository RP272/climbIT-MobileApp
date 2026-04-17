import { fetchRecommendedRoutes } from "@/src/api/discover.api";
import { useQuery } from "@tanstack/react-query";

export const recommendedRoutesKeys = {
  all: ["discover", "routes"] as const,
  recommended: () => [...recommendedRoutesKeys.all, "recommended"] as const,
};

export function useRecommendedRoutes() {
  return useQuery({
    queryKey: recommendedRoutesKeys.recommended(),
    queryFn: () => fetchRecommendedRoutes(),
  });
}
