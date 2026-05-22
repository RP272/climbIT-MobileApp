import { fetchFeaturedGyms } from "@/src/api/discover.api";
import { useQuery } from "@tanstack/react-query";

export const discoverKeys = {
  all: ["discover"] as const,
  gyms: () => [...discoverKeys.all, "gyms"] as const,
  featured: () => [...discoverKeys.gyms(), "featured"] as const,
};

export function useDiscoverGyms() {
  return useQuery({
    queryKey: discoverKeys.featured(),
    queryFn: () => fetchFeaturedGyms(),
  });
}
