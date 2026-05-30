import { fetchWatchReels } from "@/src/api/watch.api";
import { useQuery } from "@tanstack/react-query";

export const watchKeys = {
  all: ["watch"] as const,
  reels: () => [...watchKeys.all, "reels"] as const,
};

export function useWatchReels() {
  return useQuery({
    queryKey: watchKeys.reels(),
    queryFn: () => fetchWatchReels(),
  });
}
