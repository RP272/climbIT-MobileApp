import type { GymSortId } from "@/components/discover/gyms/all-gyms.types";
import { useDebouncedValue } from "@/src/features/discover/hooks/useDebouncedValue";
import { useDiscoverFilters } from "@/src/features/discover/hooks/useDiscoverFilters";
import {
  getDiscoverResultsViewModel,
  type DiscoverResultSuggestion,
} from "@/src/features/discover/utils/discover-results.utils";
import { createRouteViewModel } from "@/src/features/discover/utils/all-routes.utils";
import {
  getGymQuickFilterIds,
  getHasActiveFilters,
  getRouteQuickFilterIds,
  challengeMatchesFilters,
  gymMatchesFilters,
  normalizeSearchValue,
  routeMatchesFilters,
  routeViewModelMatchesPersonalFilters,
  routeViewModelMatchesSearch,
} from "@/src/features/discover/services/discover-filtering.service";
import type { RouteViewModel, SortId, UserRouteStatus } from "@/src/types/all-routes.types";
import type { Challenge, Gym, RecommendedRoute } from "@/src/types/discover";
import { MAX_RADIUS_KM } from "@/src/types/discover-filters";
import debounce from "lodash.debounce";
import { useCallback, useMemo, useState } from "react";

type UseDiscoverResultsFilteringInput = {
  gyms: readonly Gym[];
  routes: readonly RecommendedRoute[];
  challenges: readonly Challenge[];
};

export function useDiscoverResultsFiltering({
  gyms,
  routes,
  challenges,
}: UseDiscoverResultsFilteringInput) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 200);
  const { filters, actions, activeQuickFilterIds, activeFiltersCount } = useDiscoverFilters();
  const deferredFilters = useDebouncedValue(filters, 150);
  const isFiltering = filters !== deferredFilters || searchQuery !== debouncedSearchQuery;

  const resultsViewModel = useMemo(
    () =>
      getDiscoverResultsViewModel({
        filters: deferredFilters,
        searchQuery: debouncedSearchQuery,
        gyms,
        routes,
        challenges,
      }),
    [challenges, debouncedSearchQuery, deferredFilters, gyms, routes],
  );

  const handleResultSuggestionPress = useMemo(
    () =>
      debounce((suggestionId: DiscoverResultSuggestion["id"]) => {
        switch (suggestionId) {
          case "increase-radius":
            actions.setRadiusKm(MAX_RADIUS_KM);
            break;
          case "show-closed":
            actions.setOpenNow(false);
            break;
          case "clear-grade":
            actions.setGradeRange({ min: null, max: null });
            break;
          case "clear-all":
            actions.resetFilters();
            setSearchQuery("");
            break;
        }
      }, 50),
    [actions],
  );

  return {
    resultsViewModel,
    searchQuery,
    setSearchQuery,
    filters,
    actions,
    activeQuickFilterIds,
    activeFiltersCount,
    isFiltering,
    handleResultSuggestionPress,
  };
}

export function useGymsFiltering(gyms: readonly Gym[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 180);
  const { filters, actions, activeFiltersCount } = useDiscoverFilters();
  const [sortId, setSortId] = useState<GymSortId | null>(null);
  const activeQuickFilterIds = useMemo(() => getGymQuickFilterIds(filters), [filters]);

  const visibleItems = useMemo(
    () =>
      getVisibleGyms({
        gyms,
        searchQuery: debouncedSearchQuery,
        filters,
        sortId,
      }),
    [debouncedSearchQuery, filters, gyms, sortId],
  );

  const hasActiveCriteria = debouncedSearchQuery.trim().length > 0 || getHasActiveFilters(filters);

  const handleQuickFilterToggle = useCallback(
    (filterId: string) => {
      switch (filterId) {
        case "open-now":
          actions.setOpenNow(!filters.openNow);
          break;
        case "fresh":
          actions.toggleRouteStatus("new");
          break;
        case "bouldering":
          actions.toggleClimbingType("bouldering");
          break;
        case "rope":
          actions.toggleClimbingType("rope");
          break;
        case "challenges":
          actions.toggleChallengeMode("with-challenge");
          break;
      }
    },
    [actions, filters.openNow],
  );

  const resetView = useCallback(() => {
    setSearchQuery("");
    actions.resetFilters();
    setSortId(null);
  }, [actions]);

  return {
    visibleItems,
    searchQuery,
    setSearchQuery,
    filters,
    actions,
    activeQuickFilterIds,
    activeFiltersCount,
    sortId,
    setSortId,
    hasActiveCriteria,
    handleQuickFilterToggle,
    resetView,
  };
}

export function useRoutesFiltering(routes: readonly RecommendedRoute[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 180);
  const { filters, actions, activeFiltersCount } = useDiscoverFilters();
  const [activePersonalFilterIds, setActivePersonalFilterIds] = useState<string[]>([]);
  const [sortId, setSortId] = useState<SortId | null>(null);
  const [personalStatuses, setPersonalStatuses] = useState<Record<string, UserRouteStatus>>({});
  const routeQuickFilterIds = useMemo(() => getRouteQuickFilterIds(filters), [filters]);
  const activeQuickFilterIds = useMemo(
    () => [...activePersonalFilterIds, ...routeQuickFilterIds],
    [activePersonalFilterIds, routeQuickFilterIds],
  );

  const routeViewModels = useMemo(
    () =>
      routes.map((route, index) => createRouteViewModel(route, index, personalStatuses[route.id])),
    [personalStatuses, routes],
  );

  const visibleItems = useMemo(
    () =>
      getVisibleRoutes({
        routes: routeViewModels,
        searchQuery: debouncedSearchQuery,
        activePersonalFilterIds,
        filters,
        sortId,
      }),
    [activePersonalFilterIds, debouncedSearchQuery, filters, routeViewModels, sortId],
  );

  const hasActiveCriteria =
    debouncedSearchQuery.trim().length > 0 ||
    activePersonalFilterIds.length > 0 ||
    getHasActiveFilters(filters);

  const handleQuickFilterToggle = useCallback(
    (filterId: string) => {
      switch (filterId) {
        case "project":
        case "completed":
          setActivePersonalFilterIds((currentFilterIds) =>
            currentFilterIds.includes(filterId)
              ? currentFilterIds.filter((currentFilterId) => currentFilterId !== filterId)
              : [...currentFilterIds, filterId],
          );
          break;
        case "balance":
          actions.toggleRouteCharacter("balance");
          break;
        case "power":
          actions.toggleRouteCharacter("power");
          break;
        case "dynamic":
          actions.toggleRouteCharacter("dynamic");
          break;
        case "overhang":
          actions.toggleRouteCharacter("overhang");
          break;
      }
    },
    [actions],
  );

  const handleLogAscent = useCallback((routeId: string) => {
    setPersonalStatuses((currentStatuses) => ({
      ...currentStatuses,
      [routeId]: "top",
    }));
  }, []);

  const handleProjectToggle = useCallback((routeId: string, currentStatus: UserRouteStatus) => {
    setPersonalStatuses((currentStatuses) => ({
      ...currentStatuses,
      [routeId]: currentStatus === "project" ? "untouched" : "project",
    }));
  }, []);

  const resetView = useCallback(() => {
    setSearchQuery("");
    setActivePersonalFilterIds([]);
    actions.resetFilters();
    setSortId(null);
  }, [actions]);

  return {
    visibleItems,
    routeViewModels,
    searchQuery,
    setSearchQuery,
    filters,
    actions,
    activeQuickFilterIds,
    activeFiltersCount: activeFiltersCount + activePersonalFilterIds.length,
    sortId,
    setSortId,
    hasActiveCriteria,
    handleQuickFilterToggle,
    handleLogAscent,
    handleProjectToggle,
    resetView,
  };
}

export type ChallengeSortId = "progress" | "xp" | "ending" | "difficulty";

export function useChallengesFiltering(challenges: readonly Challenge[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 180);
  const { filters, actions, activeFiltersCount } = useDiscoverFilters();
  const [sortId, setSortId] = useState<ChallengeSortId | null>(null);
  const activeQuickFilterIds = useMemo(() => getChallengeQuickFilterIds(filters), [filters]);

  const visibleItems = useMemo(
    () =>
      getVisibleChallenges({
        challenges,
        searchQuery: debouncedSearchQuery,
        filters,
        sortId,
      }),
    [challenges, debouncedSearchQuery, filters, sortId],
  );

  const hasActiveCriteria = debouncedSearchQuery.trim().length > 0 || getHasActiveFilters(filters);

  const handleQuickFilterToggle = useCallback(
    (filterId: string) => {
      switch (filterId) {
        case "open-now":
          actions.setOpenNow(!filters.openNow);
          break;
        case "new":
          actions.toggleRouteStatus("new");
          break;
        case "bouldering":
          actions.toggleClimbingType("bouldering");
          break;
        case "rope":
          actions.toggleClimbingType("rope");
          break;
        case "training":
          actions.toggleSessionGoal("training");
          break;
        case "project":
          actions.toggleSessionGoal("project");
          break;
      }
    },
    [actions, filters.openNow],
  );

  const resetView = useCallback(() => {
    setSearchQuery("");
    actions.resetFilters();
    setSortId(null);
  }, [actions]);

  return {
    visibleItems,
    searchQuery,
    setSearchQuery,
    filters,
    actions,
    activeQuickFilterIds,
    activeFiltersCount,
    sortId,
    setSortId,
    hasActiveCriteria,
    handleQuickFilterToggle,
    resetView,
  };
}

function getVisibleGyms({
  gyms,
  searchQuery,
  filters,
  sortId,
}: {
  gyms: readonly Gym[];
  searchQuery: string;
  filters: Parameters<typeof gymMatchesFilters>[1];
  sortId: GymSortId | null;
}) {
  const normalizedSearchQuery = normalizeSearchValue(searchQuery);
  const filteredGyms = gyms.filter((gym) => gymMatchesFilters(gym, filters, normalizedSearchQuery));

  return filteredGyms
    .slice()
    .sort((firstGym, secondGym) => compareGyms(firstGym, secondGym, sortId));
}

function getVisibleRoutes({
  routes,
  searchQuery,
  activePersonalFilterIds,
  filters,
  sortId,
}: {
  routes: readonly RouteViewModel[];
  searchQuery: string;
  activePersonalFilterIds: readonly string[];
  filters: Parameters<typeof routeMatchesFilters>[1];
  sortId: SortId | null;
}) {
  const normalizedSearchQuery = normalizeSearchValue(searchQuery);
  const filteredRoutes = routes
    .filter((routeViewModel) => routeViewModelMatchesSearch(routeViewModel, normalizedSearchQuery))
    .filter((routeViewModel) =>
      routeViewModelMatchesPersonalFilters(routeViewModel, activePersonalFilterIds),
    )
    .filter((routeViewModel) => routeMatchesFilters(routeViewModel.route, filters));

  return sortId
    ? filteredRoutes.slice().sort((a, b) => compareRoutes(a, b, sortId))
    : filteredRoutes;
}

function getVisibleChallenges({
  challenges,
  searchQuery,
  filters,
  sortId,
}: {
  challenges: readonly Challenge[];
  searchQuery: string;
  filters: Parameters<typeof challengeMatchesFilters>[1];
  sortId: ChallengeSortId | null;
}) {
  const normalizedSearchQuery = normalizeSearchValue(searchQuery);
  const filteredChallenges = challenges.filter((challenge) =>
    challengeMatchesFilters(challenge, filters, normalizedSearchQuery),
  );

  return filteredChallenges
    .slice()
    .sort((firstChallenge, secondChallenge) =>
      compareChallenges(firstChallenge, secondChallenge, sortId),
    );
}

function compareGyms(firstGym: Gym, secondGym: Gym, sortId: GymSortId | null) {
  switch (sortId) {
    case "distance":
      return firstGym.distanceKm - secondGym.distanceKm;
    case "rating":
      return secondGym.rating - firstGym.rating;
    case "fresh":
      return secondGym.newRoutesCount - firstGym.newRoutesCount;
    case "name":
      return firstGym.name.localeCompare(secondGym.name, "pl");
    default:
      return getGymScore(secondGym) - getGymScore(firstGym);
  }
}

function compareRoutes(a: RouteViewModel, b: RouteViewModel, sortId: SortId) {
  switch (sortId) {
    case "grade-asc":
      return getGradeRank(a.route) - getGradeRank(b.route);
    case "grade-desc":
      return getGradeRank(b.route) - getGradeRank(a.route);
    case "popular":
      return b.popularity - a.popularity;
    case "rating":
      return b.rating - a.rating;
    case "latest":
    default:
      return a.setDaysAgo - b.setDaysAgo;
  }
}

function compareChallenges(
  firstChallenge: Challenge,
  secondChallenge: Challenge,
  sortId: ChallengeSortId | null,
) {
  switch (sortId) {
    case "progress":
      return secondChallenge.progress - firstChallenge.progress;
    case "xp":
      return secondChallenge.rewardXp - firstChallenge.rewardXp;
    case "difficulty":
      return (
        getChallengeDifficultyRank(secondChallenge.difficultyLabel) -
        getChallengeDifficultyRank(firstChallenge.difficultyLabel)
      );
    case "ending":
      return (
        getChallengeExpiryRank(firstChallenge.expiresLabel) -
        getChallengeExpiryRank(secondChallenge.expiresLabel)
      );
    default:
      return getChallengeScore(secondChallenge) - getChallengeScore(firstChallenge);
  }
}

function getChallengeQuickFilterIds(filters: Parameters<typeof challengeMatchesFilters>[1]) {
  const activeFilterIds: string[] = [];

  if (filters.openNow) {
    activeFilterIds.push("open-now");
  }

  if (filters.routeStatuses.includes("new")) {
    activeFilterIds.push("new");
  }

  if (filters.climbingTypes.includes("bouldering")) {
    activeFilterIds.push("bouldering");
  }

  if (filters.climbingTypes.includes("rope")) {
    activeFilterIds.push("rope");
  }

  if (filters.sessionGoals.includes("training")) {
    activeFilterIds.push("training");
  }

  if (filters.sessionGoals.includes("project")) {
    activeFilterIds.push("project");
  }

  return activeFilterIds;
}

function getChallengeScore(challenge: Challenge) {
  return (
    challenge.rewardXp * 0.08 +
    challenge.progress * 0.18 +
    getChallengeDifficultyRank(challenge.difficultyLabel) * 8 -
    getChallengeExpiryRank(challenge.expiresLabel) * 0.4 -
    challenge.distanceKm * 0.25
  );
}

function getChallengeDifficultyRank(difficultyLabel: string | undefined) {
  switch (normalizeSearchValue(difficultyLabel)) {
    case "bardzo trudne":
      return 4;
    case "trudne":
      return 3;
    case "srednie":
      return 2;
    case "latwe":
      return 1;
    default:
      return 0;
  }
}

function getChallengeExpiryRank(expiresLabel: string | undefined) {
  const normalizedLabel = normalizeSearchValue(expiresLabel);

  if (!normalizedLabel) {
    return 99;
  }

  if (
    normalizedLabel.includes("polnoc") ||
    normalizedLabel.includes("jutro") ||
    normalizedLabel.includes("weekendu")
  ) {
    return 1;
  }

  const daysMatch = normalizedLabel.match(/(\d+)/);

  if (daysMatch) {
    return Number(daysMatch[1]);
  }

  if (normalizedLabel.includes("piatku") || normalizedLabel.includes("niedziele")) {
    return 5;
  }

  if (normalizedLabel.includes("tydzien")) {
    return 7;
  }

  return 50;
}

function getGymScore(gym: Gym) {
  return (
    gym.rating * 8 +
    gym.newRoutesCount * 0.25 +
    (gym.isOpenNow ? 5 : 0) +
    (gym.hasChallenges ? 2 : 0) -
    gym.distanceKm * 0.35
  );
}

function getGradeRank(route: RecommendedRoute) {
  const gradeScale = Number(route.gradeScale) || Number(route.grade.match(/\d/)?.[0] ?? 0);
  const normalizedGrade = normalizeSearchValue(route.grade);
  const letterBonus = normalizedGrade.includes("c")
    ? 0.66
    : normalizedGrade.includes("b")
      ? 0.33
      : 0;
  const plusBonus = normalizedGrade.includes("+") ? 0.16 : 0;

  return gradeScale + letterBonus + plusBonus;
}
