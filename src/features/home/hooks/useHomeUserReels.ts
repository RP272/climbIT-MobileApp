import { fetchHomeUserReels } from "@/src/features/home/home.api";
import { useAuth } from "@/src/providers/auth-provider";
import { useQuery } from "@tanstack/react-query";

export const homeKeys = {
  all: ["home"] as const,
  userReels: () => [...homeKeys.all, "user-reels"] as const,
};

export function useHomeUserReels() {
  const { isReady, accessToken } = useAuth();

  return useQuery({
    queryKey: homeKeys.userReels(),
    queryFn: () => fetchHomeUserReels(12),
    enabled: isReady && Boolean(accessToken),
  });
}
