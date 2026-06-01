import { apiRequest } from "@/src/api/client";
import type { RouteApiEntry } from "@/src/types/api";
import type { RecommendedRoute, RouteStyleTags } from "@/src/types/discover";

export function routeToRecommendedRoute(route: RouteApiEntry, gymName = ""): RecommendedRoute {
  return {
    id: route.id,
    gymId: route.facilityId ?? "",
    grade: route.difficultyLevel ?? "—",
    gradeScale: "6",
    name: route.name,
    gymName,
    sector: route.sector ?? "",
    climbingType: "bouldering",
    climbingTypeLabel: "Boulder",
    distanceKm: 0,
    isOpenNow: true,
    imageUrl: "",
    holdLabel: "Trasa",
    climbProfile: "Vertical",
    climbStyles: ["Technical"],
    styleTags: ["Personalizacja"] as RouteStyleTags,
    routeCharacters: [],
    sessionGoals: [],
    routeStatuses: [],
    hasChallenge: false,
    recommendationReason: route.description ?? "",
  };
}

export async function fetchRoutesByFacilityId(
  facilityId: string,
  gymName = "",
): Promise<RecommendedRoute[]> {
  const routes = await apiRequest<RouteApiEntry[]>(`/routes/fetch-all/${facilityId}`);
  return routes.map((route) => routeToRecommendedRoute(route, gymName));
}

export async function fetchRouteById(routeId: string): Promise<RecommendedRoute | null> {
  try {
    const route = await apiRequest<RouteApiEntry>(`/routes/${routeId}`);
    return routeToRecommendedRoute(route);
  } catch {
    return null;
  }
}
