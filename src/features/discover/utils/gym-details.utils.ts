import type { Gym, RecommendedRoute } from "@/src/types/discover";

export function getGymById(gyms: readonly Gym[], gymId: string | null | undefined) {
  if (!gymId) {
    return null;
  }

  return gyms.find((gym) => gym.id === gymId) ?? null;
}

export function getRecommendedRoutesForGym(
  routes: readonly RecommendedRoute[],
  gymId: string | null | undefined,
) {
  if (!gymId) {
    return [];
  }

  return routes.filter((route) => route.gymId === gymId);
}
