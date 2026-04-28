import {
  getClimbingTypeValues,
  getGymQuickFilterIds,
  gymMatchesFilters,
  matchesGrade,
  matchesLocation,
  matchesSearch,
  normalizeSearchValue,
  routeMatchesFilters,
  routeViewModelMatchesPersonalFilters,
} from "@/src/features/discover/services/discover-filtering.service";
import { DEFAULT_DISCOVER_FILTERS, type DiscoverFilters } from "@/src/types/discover-filters";
import type { RouteViewModel } from "@/src/types/all-routes.types";
import type { Gym, RecommendedRoute } from "@/src/types/discover";

function createFilters(overrides: Partial<DiscoverFilters>): DiscoverFilters {
  return {
    ...DEFAULT_DISCOVER_FILTERS,
    ...overrides,
    gradeRange: {
      ...DEFAULT_DISCOVER_FILTERS.gradeRange,
      ...overrides.gradeRange,
    },
  };
}

const route = {
  id: "edge-balance",
  gymId: "crux-lab",
  grade: "6b+",
  gradeScale: "6",
  name: "Krawedz Balansu",
  gymName: "Crux Lab",
  sector: "Plyta A",
  climbingType: "bouldering",
  climbingTypeLabel: "Boulder",
  distanceKm: 1.2,
  isOpenNow: true,
  imageUrl: "",
  styleTags: ["Technika", "Balans"],
  routeCharacters: ["technical", "balance"],
  sessionGoals: ["technique", "warmup"],
  routeStatuses: ["new", "not-done"],
  hasChallenge: true,
  recommendationReason: "",
} satisfies RecommendedRoute;

const gym = {
  id: "crux-lab",
  name: "Crux Lab",
  city: "Warszawa",
  distanceKm: 1.2,
  newRoutesCount: 24,
  rating: 4.9,
  imageUrl: "",
  tags: ["Nowe sety", "Boulder"],
  isOpenNow: true,
  climbingTypes: ["bouldering", "auto-belay"],
  gradeScaleRange: ["3", "8"],
  routeCharacters: ["technical", "balance", "dynamic"],
  sessionGoals: ["training", "project", "technique"],
  routeStatuses: ["new", "popular"],
  hasChallenges: true,
} satisfies Gym;

describe("discover filtering service", () => {
  it("normalizes search values and matches search without accents or case sensitivity", () => {
    const query = normalizeSearchValue("SCIANKA");

    expect(normalizeSearchValue("Ścianka")).toBe("scianka");
    expect(matchesSearch(["Najlepsza ścianka"], query)).toBe(true);
  });

  it("matches single route grades and gym grade ranges", () => {
    expect(matchesGrade("5", "7", route.gradeScale, route.gradeScale)).toBe(true);
    expect(matchesGrade("7", "9", route.gradeScale, route.gradeScale)).toBe(false);
    expect(matchesGrade("7", "9", gym.gradeScaleRange[0], gym.gradeScaleRange[1])).toBe(true);
  });

  it("applies location and availability filters", () => {
    expect(matchesLocation(1.2, true, createFilters({ radiusKm: 2, openNow: true }))).toBe(true);
    expect(matchesLocation(3.2, true, createFilters({ radiusKm: 2 }))).toBe(false);
    expect(matchesLocation(1.2, false, createFilters({ radiusKm: 2, openNow: true }))).toBe(false);
  });

  it("infers climbing types from values and fallback labels", () => {
    expect(getClimbingTypeValues(["auto-belay"], ["Lead", "Boulder"])).toEqual([
      "auto-belay",
      "rope",
      "bouldering",
    ]);
  });

  it("filters routes and gyms with advanced filters", () => {
    const filters = createFilters({
      radiusKm: 2,
      climbingTypes: ["bouldering"],
      gradeRange: { min: "5", max: "7" },
      routeCharacters: ["balance"],
      routeStatuses: ["new"],
      challengeModes: ["with-challenge"],
    });

    expect(routeMatchesFilters(route, filters, normalizeSearchValue("crux"))).toBe(true);
    expect(gymMatchesFilters(gym, filters, normalizeSearchValue("warszawa"))).toBe(true);
    expect(routeMatchesFilters(route, { ...filters, climbingTypes: ["rope"] })).toBe(false);
  });

  it("maps gym quick filters from discover filters", () => {
    const filters = createFilters({
      openNow: true,
      climbingTypes: ["bouldering"],
      routeStatuses: ["new"],
      challengeModes: ["with-challenge"],
    });

    expect(getGymQuickFilterIds(filters)).toEqual([
      "open-now",
      "fresh",
      "bouldering",
      "challenges",
    ]);
  });

  it("filters route view models by personal project and completed state", () => {
    const projectRoute = { personalStatus: "project" } as RouteViewModel;
    const completedRoute = { personalStatus: "top" } as RouteViewModel;

    expect(routeViewModelMatchesPersonalFilters(projectRoute, ["project"])).toBe(true);
    expect(routeViewModelMatchesPersonalFilters(completedRoute, ["completed"])).toBe(true);
    expect(routeViewModelMatchesPersonalFilters(projectRoute, ["completed"])).toBe(false);
  });
});
