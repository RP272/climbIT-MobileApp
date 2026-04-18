import challengesData from "@/src/data/challenges.json";
import gymsData from "@/src/data/gyms.json";
import recommendedRoutesData from "@/src/data/recommended-routes.json";
import { getGymById } from "@/src/features/discover/utils/gym-details.utils";
import type { Challenge, Gym, RecommendedRoute, RouteStyleTags } from "@/src/types/discover";

const FEATURED_GYMS = gymsData as unknown as Gym[];

/**
 * Fetches featured gyms/climbing walls
 * Simulates API call with a promise
 * To be replaced with real API call when backend is ready
 * Remember to remove the files in /src/data/ and the mock function when real API is implemented
 */
export async function fetchFeaturedGyms(): Promise<Gym[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(FEATURED_GYMS);
    }, 300);
  });
}

export async function fetchGymById(gymId: string): Promise<Gym | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getGymById(FEATURED_GYMS, gymId));
    }, 300);
  });
}

export async function fetchRecommendedRoutes(): Promise<RecommendedRoute[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(recommendedRoutesData.map(toRecommendedRoute));
    }, 300);
  });
}

export async function fetchRoutesByGymId(gymId: string): Promise<RecommendedRoute[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const routes = recommendedRoutesData
        .map(toRecommendedRoute)
        .filter((route) => route.gymId === gymId);
      resolve(routes);
    }, 300);
  });
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

export async function fetchChallengesByGymId(gymId: string): Promise<Challenge[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const allChallenges = challengesData as unknown as Challenge[];
      resolve(allChallenges.filter((chal) => chal.gymId === gymId));
    }, 300);
  });
}
