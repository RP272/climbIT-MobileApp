import {
  MAX_RADIUS_KM,
  type ChallengeMode,
  type ClimbingType,
  type DiscoverContentType,
  type DiscoverFilters,
  type RouteCharacter,
  type RouteStatus,
  type SessionGoal,
} from "@/src/types/discover-filters";
import type { Challenge, Gym, RecommendedRoute } from "@/src/types/discover";
import {
  challengeMatchesFilters,
  getHasActiveFilters,
  gymMatchesFilters,
  normalizeSearchValue,
  routeMatchesFilters,
} from "@/src/features/discover/services/discover-filtering.service";

export type DiscoverLayoutMode =
  | "discovery"
  | "filtered-results"
  | "search-results"
  | "empty-results";

export type DiscoverResultGroup =
  | {
      kind: "routes";
      title: string;
      items: RecommendedRoute[];
    }
  | {
      kind: "gyms";
      title: string;
      items: Gym[];
    }
  | {
      kind: "challenges";
      title: string;
      items: Challenge[];
    };

export type ActiveDiscoverFilterChip = {
  id: string;
  label: string;
};

export type DiscoverResultSuggestion = {
  id: "increase-radius" | "show-closed" | "clear-grade" | "clear-all";
  label: string;
};

export type DiscoverResultsViewModel = {
  mode: DiscoverLayoutMode;
  groups: DiscoverResultGroup[];
  totalResultsCount: number;
  activeFilterChips: ActiveDiscoverFilterChip[];
  suggestions: DiscoverResultSuggestion[];
  supportingMessage?: string;
};

type DiscoverResultsInput = {
  filters: DiscoverFilters;
  searchQuery: string;
  gyms: readonly Gym[];
  routes: readonly RecommendedRoute[];
  challenges: readonly Challenge[];
};

const CLIMBING_TYPE_LABELS: Record<ClimbingType, string> = {
  bouldering: "Bouldering",
  rope: "Lina",
  "auto-belay": "Auto-belay",
};

const ROUTE_CHARACTER_LABELS: Record<RouteCharacter, string> = {
  technical: "Technika",
  power: "Siła",
  balance: "Balans",
  dynamic: "Dynamika",
  endurance: "Wytrzymałość",
  overhang: "Przewieszenie",
};

const SESSION_GOAL_LABELS: Record<SessionGoal, string> = {
  warmup: "Rozgrzewka",
  training: "Trening",
  project: "Projekt",
  technique: "Technika",
  fun: "Zabawa",
};

const ROUTE_STATUS_LABELS: Record<RouteStatus, string> = {
  new: "Nowe",
  popular: "Popularne",
  "not-done": "Nieukończone",
};

const CHALLENGE_MODE_LABELS: Record<ChallengeMode, string> = {
  "with-challenge": "Z wyzwaniem",
};

const CONTENT_TYPE_LABELS: Record<DiscoverContentType, string> = {
  gyms: "Ścianki",
  routes: "Trasy",
  challenges: "Wyzwania",
};

export function getDiscoverResultsViewModel({
  filters,
  searchQuery,
  gyms,
  routes,
  challenges,
}: DiscoverResultsInput): DiscoverResultsViewModel {
  const normalizedSearchQuery = normalizeSearchValue(searchQuery);
  const hasSearchQuery = normalizedSearchQuery.length > 0;
  const hasActiveFilters = getHasActiveFilters(filters, true);
  const activeFilterChips = getActiveFilterChips(filters);

  if (!hasSearchQuery && !hasActiveFilters) {
    return {
      mode: "discovery",
      groups: [],
      totalResultsCount: 0,
      activeFilterChips,
      suggestions: [],
    };
  }

  const shouldIncludeRoutes = shouldIncludeContentType(filters, "routes");
  const shouldIncludeGyms = shouldIncludeContentType(filters, "gyms");
  const shouldIncludeChallenges = shouldIncludeContentType(filters, "challenges");
  const filteredRoutes = shouldIncludeRoutes
    ? routes.filter((route) => matchesRoute(route, filters, normalizedSearchQuery))
    : [];
  const filteredGyms = shouldIncludeGyms
    ? gyms.filter((gym) => matchesGym(gym, filters, normalizedSearchQuery))
    : [];
  const filteredChallenges = shouldIncludeChallenges
    ? challenges.filter((challenge) => matchesChallenge(challenge, filters, normalizedSearchQuery))
    : [];
  const groups = getOrderedGroups({
    filters,
    hasSearchQuery,
    routes: filteredRoutes,
    gyms: filteredGyms,
    challenges: filteredChallenges,
  });
  const totalResultsCount = groups.reduce((total, group) => total + group.items.length, 0);

  return {
    mode:
      totalResultsCount === 0
        ? "empty-results"
        : hasSearchQuery
          ? "search-results"
          : "filtered-results",
    groups,
    totalResultsCount,
    activeFilterChips,
    suggestions: getResultSuggestions(filters),
    supportingMessage: getSupportingMessage({
      filters,
      routesCount: filteredRoutes.length,
      gymsCount: filteredGyms.length,
      challengesCount: filteredChallenges.length,
    }),
  };
}

function getOrderedGroups({
  filters,
  hasSearchQuery,
  routes,
  gyms,
  challenges,
}: {
  filters: DiscoverFilters;
  hasSearchQuery: boolean;
  routes: RecommendedRoute[];
  gyms: Gym[];
  challenges: Challenge[];
}) {
  const routeGroup = {
    kind: "routes" as const,
    title: hasSearchQuery ? "Trasy" : "Trasy spełniające filtry",
    items: routes,
  };
  const gymGroup = {
    kind: "gyms" as const,
    title: hasSearchQuery ? "Ścianki" : "Ścianki spełniające filtry",
    items: gyms,
  };
  const challengeGroup = {
    kind: "challenges" as const,
    title: hasSearchQuery ? "Wyzwania" : "Wyzwania dla Ciebie",
    items: challenges,
  };

  if (hasSearchQuery) {
    return filterGroupsByContentType([routeGroup, gymGroup, challengeGroup], filters);
  }

  if (filters.challengeModes.length > 0) {
    return filterGroupsByContentType([challengeGroup, routeGroup, gymGroup], filters);
  }

  if (getHasRouteSpecificFilters(filters)) {
    return filterGroupsByContentType([routeGroup, gymGroup, challengeGroup], filters);
  }

  return filterGroupsByContentType([gymGroup, routeGroup, challengeGroup], filters);
}

function hasItems(group: DiscoverResultGroup) {
  return group.items.length > 0;
}

function filterGroupsByContentType(groups: DiscoverResultGroup[], filters: DiscoverFilters) {
  return groups.filter((group) => {
    if (!hasItems(group)) {
      return false;
    }

    if (filters.contentTypes.length === 0) {
      return true;
    }

    return filters.contentTypes.includes(group.kind);
  });
}

function shouldIncludeContentType(filters: DiscoverFilters, contentType: DiscoverContentType) {
  return filters.contentTypes.length === 0 || filters.contentTypes.includes(contentType);
}

function matchesRoute(route: RecommendedRoute, filters: DiscoverFilters, searchQuery: string) {
  return routeMatchesFilters(route, filters, searchQuery);
}

function matchesGym(gym: Gym, filters: DiscoverFilters, searchQuery: string) {
  return gymMatchesFilters(gym, filters, searchQuery);
}

function matchesChallenge(challenge: Challenge, filters: DiscoverFilters, searchQuery: string) {
  return challengeMatchesFilters(challenge, filters, searchQuery);
}

function getHasRouteSpecificFilters(filters: DiscoverFilters) {
  return (
    filters.climbingTypes.length > 0 ||
    Boolean(filters.gradeRange.min) ||
    Boolean(filters.gradeRange.max) ||
    filters.routeCharacters.length > 0 ||
    filters.sessionGoals.length > 0 ||
    filters.routeStatuses.length > 0
  );
}

function getActiveFilterChips(filters: DiscoverFilters) {
  const chips: ActiveDiscoverFilterChip[] = [];

  if (filters.radiusKm < MAX_RADIUS_KM) {
    chips.push({ id: "radius", label: `do ${filters.radiusKm} km` });
  }

  if (filters.openNow) {
    chips.push({ id: "open-now", label: "Otwarte teraz" });
  }

  filters.climbingTypes.forEach((climbingType) => {
    chips.push({ id: `type-${climbingType}`, label: CLIMBING_TYPE_LABELS[climbingType] });
  });

  if (filters.gradeRange.min || filters.gradeRange.max) {
    chips.push({
      id: "grade-range",
      label: `Poziom ${filters.gradeRange.min ?? "1"}-${filters.gradeRange.max ?? "9"}`,
    });
  }

  filters.routeCharacters.forEach((routeCharacter) => {
    chips.push({
      id: `character-${routeCharacter}`,
      label: ROUTE_CHARACTER_LABELS[routeCharacter],
    });
  });

  filters.sessionGoals.forEach((sessionGoal) => {
    chips.push({ id: `goal-${sessionGoal}`, label: SESSION_GOAL_LABELS[sessionGoal] });
  });

  filters.routeStatuses.forEach((routeStatus) => {
    chips.push({ id: `status-${routeStatus}`, label: ROUTE_STATUS_LABELS[routeStatus] });
  });

  filters.challengeModes.forEach((challengeMode) => {
    chips.push({ id: `challenge-${challengeMode}`, label: CHALLENGE_MODE_LABELS[challengeMode] });
  });

  filters.contentTypes.forEach((contentType) => {
    chips.push({ id: `content-${contentType}`, label: CONTENT_TYPE_LABELS[contentType] });
  });

  return chips;
}

function getResultSuggestions(filters: DiscoverFilters) {
  const suggestions: DiscoverResultSuggestion[] = [];

  if (filters.radiusKm < MAX_RADIUS_KM) {
    suggestions.push({ id: "increase-radius", label: "Zwiększ dystans" });
  }

  if (filters.openNow) {
    suggestions.push({ id: "show-closed", label: "Pokaż też zamknięte" });
  }

  if (filters.gradeRange.min || filters.gradeRange.max) {
    suggestions.push({ id: "clear-grade", label: "Usuń poziom" });
  }

  suggestions.push({ id: "clear-all", label: "Wyczyść filtry" });

  return suggestions;
}

function getSupportingMessage({
  filters,
  routesCount,
  gymsCount,
  challengesCount,
}: {
  filters: DiscoverFilters;
  routesCount: number;
  gymsCount: number;
  challengesCount: number;
}) {
  if (routesCount === 0 && getHasRouteSpecificFilters(filters) && gymsCount > 0) {
    return `Brak tras dla tych ustawień. Znaleźliśmy ${gymsCount} ścianki, które pasują do pozostałych filtrów.`;
  }

  if (filters.challengeModes.length > 0 && challengesCount === 0 && routesCount + gymsCount > 0) {
    return "Brak wyzwań dla tych filtrów. Poniżej są miejsca i trasy spełniające pozostałe warunki.";
  }

  return undefined;
}
