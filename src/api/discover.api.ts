import { fetchFacilities, fetchFacilityById } from "@/src/api/facility.api";
import { fetchRoutesByFacilityId } from "@/src/api/routes.api";
import challengesData from "@/src/data/challenges.json";
import recommendedRoutesData from "@/src/data/recommended-routes.json";
import type { Challenge, Gym, RecommendedRoute, RouteStyleTags } from "@/src/types/discover";

/**
 * Fetches climbing facilities (ścianki) from GET /facilities.
 */
export async function fetchFeaturedGyms(): Promise<Gym[]> {
  return fetchFacilities();
}

export async function fetchGymById(gymId: string): Promise<Gym | null> {
  return fetchFacilityById(gymId);
}

export async function fetchRecommendedRoutes(): Promise<RecommendedRoute[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(recommendedRoutesData.map(toRecommendedRoute));
    }, 300);
  });
}

export async function fetchRoutesByGymId(gymId: string, gymName = ""): Promise<RecommendedRoute[]> {
  return fetchRoutesByFacilityId(gymId, gymName);
}

function toRecommendedRoute(route: (typeof recommendedRoutesData)[number]): RecommendedRoute {
  return {
    ...(route as unknown as Omit<RecommendedRoute, "styleTags">),
    styleTags: normalizeRouteStyleTags(route.styleTags),
  };
}

function normalizeRouteStyleTags(tags: readonly string[]): RouteStyleTags {
  const [primaryTag, secondaryTag] = tags;

  if (!primaryTag) {
    return ["Personalizacja"];
  }

  return secondaryTag ? [primaryTag, secondaryTag] : [primaryTag];
}
export async function fetchWeeklyChallenges(): Promise<Challenge[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(challengesData as unknown as Challenge[]);
    }, 300);
  });
}

export async function fetchChallengeById(challengeId: string): Promise<Challenge | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const allChallenges = challengesData as unknown as Challenge[];
      resolve(allChallenges.find((challenge) => challenge.id === challengeId) ?? null);
    }, 300);
  });
}

export async function fetchChallengesByGymId(gymId: string): Promise<Challenge[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const allChallenges = challengesData as unknown as Challenge[];
      resolve(allChallenges.filter((chal) => chal.gymId === gymId));
    }, 300);
  });
}
