import { fetchWatchReels } from "@/src/api/watch.api";
import { useAuth } from "@/src/providers/auth-provider";
import { useQuery } from "@tanstack/react-query";

export const watchKeys = {
  all: ["watch"] as const,
  reels: () => [...watchKeys.all, "reels"] as const,
};

export function useWatchReels() {
  const { isReady, accessToken } = useAuth();

  return useQuery({
    queryKey: watchKeys.reels(),
    queryFn: () => fetchWatchReels(),
    enabled: isReady && Boolean(accessToken),
  });
}
