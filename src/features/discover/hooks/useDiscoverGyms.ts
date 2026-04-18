import { fetchFeaturedGyms, fetchGymById } from "@/src/api/discover.api";
import { useQuery } from "@tanstack/react-query";

export const discoverKeys = {
  all: ["discover"] as const,
  gyms: () => [...discoverKeys.all, "gyms"] as const,
  featured: () => [...discoverKeys.gyms(), "featured"] as const,
  detail: (gymId: string) => [...discoverKeys.gyms(), "detail", gymId] as const,
};

export function useDiscoverGyms() {
  return useQuery({
    queryKey: discoverKeys.featured(),
    queryFn: () => fetchFeaturedGyms(),
  });
}

export function useGymDetails(gymId: string | undefined) {
  return useQuery({
    queryKey: discoverKeys.detail(gymId ?? ""),
    queryFn: () => fetchGymById(gymId ?? ""),
    enabled: Boolean(gymId),
  });
}
