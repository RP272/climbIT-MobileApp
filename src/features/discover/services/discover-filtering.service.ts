import { DEFAULT_PERSONAL_STATUSES } from "@/src/types/all-routes.constants";
import type { RouteViewModel, UserRouteStatus } from "@/src/types/all-routes.types";
import type { Challenge, Gym, RecommendedRoute } from "@/src/types/discover";
import {
  MAX_RADIUS_KM,
  NEARBY_RADIUS_KM,
  type ChallengeMode,
  type ClimbingGrade,
  type ClimbingType,
  type DiscoverFilters,
} from "@/src/types/discover-filters";

type FilterableRoute = Pick<
  RecommendedRoute,
  | "name"
  | "gymName"
  | "sector"
  | "grade"
  | "gradeScale"
  | "climbingType"
  | "climbingTypeLabel"
  | "distanceKm"
  | "isOpenNow"
  | "styleTags"
  | "routeCharacters"
  | "sessionGoals"
  | "routeStatuses"
  | "hasChallenge"
>;

type FilterableGym = Pick<
  Gym,
  | "name"
  | "city"
  | "distanceKm"
  | "isOpenNow"
  | "tags"
  | "climbingTypes"
  | "gradeScaleRange"
  | "routeCharacters"
  | "sessionGoals"
  | "routeStatuses"
  | "hasChallenges"
  | "description"
  | "address"
  | "priceLabel"
  | "settingSchedule"
  | "amenities"
>;

type FilterableChallenge = Pick<
  Challenge,
  | "title"
  | "progressLabel"
  | "distanceKm"
  | "isOpenNow"
  | "climbingTypes"
  | "gradeScaleRange"
  | "routeCharacters"
  | "sessionGoals"
  | "routeStatuses"
  | "mode"
>;

export function normalizeSearchValue(value: string | null | undefined) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pl-PL")
    .trim();
}

export function matchesSearch(
  values: readonly (string | null | undefined)[],
  normalizedSearchQuery: string,
) {
  if (!normalizedSearchQuery) {
    return true;
  }

  return values.some((value) => normalizeSearchValue(value).includes(normalizedSearchQuery));
}

export function matchesLocation(
  distanceKm: number | null | undefined,
  isOpenNow: boolean | null | undefined,
  filters: DiscoverFilters,
) {
  const safeDistanceKm = typeof distanceKm === "number" ? distanceKm : MAX_RADIUS_KM;

  return safeDistanceKm <= filters.radiusKm && (!filters.openNow || isOpenNow === true);
}

export function matchesSelected<T extends string>(
  selectedValues: readonly T[],
  itemValues: readonly T[],
) {
  if (selectedValues.length === 0) {
    return true;
  }

  return selectedValues.some((selectedValue) => itemValues.includes(selectedValue));
}

export function matchesGrade(
  selectedMin: ClimbingGrade | null,
  selectedMax: ClimbingGrade | null,
  itemMin: ClimbingGrade | null,
  itemMax: ClimbingGrade | null,
) {
  if (!selectedMin && !selectedMax) {
    return true;
  }

  if (!itemMin || !itemMax) {
    return false;
  }

  const min = Number(selectedMin ?? "1");
  const max = Number(selectedMax ?? "9");
  const itemMinValue = Number(itemMin);
  const itemMaxValue = Number(itemMax);

  return itemMaxValue >= min && itemMinValue <= max;
}

export function matchesChallengeMode(
  selectedModes: readonly ChallengeMode[],
  hasChallenge: boolean,
) {
  return selectedModes.length === 0 || hasChallenge;
}

export function getClimbingTypeValues(
  values: ClimbingType | string | readonly (ClimbingType | string)[] | null | undefined,
  fallbackLabels: readonly string[] = [],
) {
  const sourceValues = Array.isArray(values) ? values : values ? [values] : [];
  const inferredValues = [...sourceValues, ...fallbackLabels];
  const climbingTypes = inferredValues
    .map((value) => getClimbingTypeValue(value))
    .filter((value): value is ClimbingType => Boolean(value));

  return Array.from(new Set(climbingTypes));
}

export function routeMatchesFilters(
  route: FilterableRoute,
  filters: DiscoverFilters,
  normalizedSearchQuery = "",
) {
  const routeGrade = getGradeScale(route.gradeScale, route.grade);

  return (
    matchesSearch(
      [
        route.name,
        route.gymName,
        route.sector,
        route.grade,
        route.climbingTypeLabel,
        ...safeArray(route.styleTags),
      ],
      normalizedSearchQuery,
    ) &&
    matchesLocation(route.distanceKm, route.isOpenNow, filters) &&
    matchesSelected(filters.climbingTypes, getClimbingTypeValues(route.climbingType)) &&
    matchesGrade(filters.gradeRange.min, filters.gradeRange.max, routeGrade, routeGrade) &&
    matchesSelected(filters.routeCharacters, safeArray(route.routeCharacters)) &&
    matchesSelected(filters.sessionGoals, safeArray(route.sessionGoals)) &&
    matchesSelected(filters.routeStatuses, safeArray(route.routeStatuses)) &&
    matchesChallengeMode(filters.challengeModes, route.hasChallenge)
  );
}

export function gymMatchesFilters(
  gym: FilterableGym,
  filters: DiscoverFilters,
  normalizedSearchQuery = "",
) {
  const [minGrade, maxGrade] = getGradeRange(gym.gradeScaleRange);

  return (
    matchesSearch(
      [
        gym.name,
        gym.city,
        gym.description,
        gym.address,
        gym.priceLabel,
        gym.settingSchedule,
        ...safeArray(gym.tags),
        ...safeArray(gym.amenities),
      ],
      normalizedSearchQuery,
    ) &&
    matchesLocation(gym.distanceKm, gym.isOpenNow, filters) &&
    matchesSelected(filters.climbingTypes, getClimbingTypeValues(gym.climbingTypes, gym.tags)) &&
    matchesGrade(filters.gradeRange.min, filters.gradeRange.max, minGrade, maxGrade) &&
    matchesSelected(filters.routeCharacters, safeArray(gym.routeCharacters)) &&
    matchesSelected(filters.sessionGoals, safeArray(gym.sessionGoals)) &&
    matchesSelected(filters.routeStatuses, safeArray(gym.routeStatuses)) &&
    matchesChallengeMode(filters.challengeModes, gym.hasChallenges)
  );
}

export function challengeMatchesFilters(
  challenge: FilterableChallenge,
  filters: DiscoverFilters,
  normalizedSearchQuery = "",
) {
  const [minGrade, maxGrade] = getGradeRange(challenge.gradeScaleRange);

  return (
    matchesSearch([challenge.title, challenge.progressLabel], normalizedSearchQuery) &&
    matchesLocation(challenge.distanceKm, challenge.isOpenNow, filters) &&
    matchesSelected(filters.climbingTypes, getClimbingTypeValues(challenge.climbingTypes)) &&
    matchesGrade(filters.gradeRange.min, filters.gradeRange.max, minGrade, maxGrade) &&
    matchesSelected(filters.routeCharacters, safeArray(challenge.routeCharacters)) &&
    matchesSelected(filters.sessionGoals, safeArray(challenge.sessionGoals)) &&
    matchesSelected(filters.routeStatuses, safeArray(challenge.routeStatuses)) &&
    matchesSelected(filters.challengeModes, challenge.mode ? [challenge.mode] : [])
  );
}

export function routeViewModelMatchesSearch(
  routeViewModel: RouteViewModel,
  normalizedSearchQuery: string,
) {
  const { route, color, routeSetter, wallProfile } = routeViewModel;

  return matchesSearch(
    [
      route.name,
      route.grade,
      route.sector,
      route.gymName,
      route.climbingTypeLabel,
      routeSetter,
      wallProfile,
      color.label,
      ...route.styleTags,
    ],
    normalizedSearchQuery,
  );
}

export function routeViewModelMatchesPersonalFilters(
  routeViewModel: RouteViewModel,
  activeFilterIds: readonly string[],
) {
  if (activeFilterIds.length === 0) {
    return true;
  }

  return activeFilterIds.every((filterId) => {
    const { personalStatus } = routeViewModel;

    switch (filterId) {
      case "project":
        return personalStatus === "project";
      case "completed":
        return personalStatus === "top" || personalStatus === "flash";
      default:
        return true;
    }
  });
}

export function getHasActiveFilters(filters: DiscoverFilters, includeContentTypes = false) {
  return (
    filters.radiusKm < MAX_RADIUS_KM ||
    filters.openNow ||
    filters.climbingTypes.length > 0 ||
    Boolean(filters.gradeRange.min) ||
    Boolean(filters.gradeRange.max) ||
    filters.routeCharacters.length > 0 ||
    filters.sessionGoals.length > 0 ||
    filters.routeStatuses.length > 0 ||
    filters.challengeModes.length > 0 ||
    (includeContentTypes && filters.contentTypes.length > 0)
  );
}

export function countActiveFilters(filters: DiscoverFilters, includeContentTypes = true) {
  return (
    (filters.radiusKm < MAX_RADIUS_KM ? 1 : 0) +
    (filters.openNow ? 1 : 0) +
    filters.climbingTypes.length +
    (filters.gradeRange.min ? 1 : 0) +
    (filters.gradeRange.max ? 1 : 0) +
    filters.routeCharacters.length +
    filters.sessionGoals.length +
    filters.routeStatuses.length +
    filters.challengeModes.length +
    (includeContentTypes ? filters.contentTypes.length : 0)
  );
}

export function getDiscoverQuickFilterIds(filters: DiscoverFilters) {
  const activeFilterIds: string[] = [];

  if (filters.radiusKm <= NEARBY_RADIUS_KM) {
    activeFilterIds.push("nearby");
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

  if (filters.challengeModes.includes("with-challenge")) {
    activeFilterIds.push("with-challenge");
  }

  if (filters.contentTypes.includes("gyms")) {
    activeFilterIds.push("gyms");
  }

  if (filters.contentTypes.includes("routes")) {
    activeFilterIds.push("routes");
  }

  if (filters.contentTypes.includes("challenges")) {
    activeFilterIds.push("challenges");
  }

  return activeFilterIds;
}

export function getGymQuickFilterIds(filters: DiscoverFilters) {
  const activeFilterIds: string[] = [];

  if (filters.openNow) {
    activeFilterIds.push("open-now");
  }

  if (filters.routeStatuses.includes("new")) {
    activeFilterIds.push("fresh");
  }

  if (filters.climbingTypes.includes("bouldering")) {
    activeFilterIds.push("bouldering");
  }

  if (filters.climbingTypes.includes("rope")) {
    activeFilterIds.push("rope");
  }

  if (filters.challengeModes.includes("with-challenge")) {
    activeFilterIds.push("challenges");
  }

  return activeFilterIds;
}

export function getRouteQuickFilterIds(filters: DiscoverFilters) {
  const activeFilterIds: string[] = [];

  if (filters.routeCharacters.includes("balance")) {
    activeFilterIds.push("balance");
  }

  if (filters.routeCharacters.includes("power")) {
    activeFilterIds.push("power");
  }

  if (filters.routeCharacters.includes("dynamic")) {
    activeFilterIds.push("dynamic");
  }

  if (filters.routeCharacters.includes("overhang")) {
    activeFilterIds.push("overhang");
  }

  return activeFilterIds;
}

export function getRoutePersonalStatus(
  routeId: string,
  personalStatuses: Record<string, UserRouteStatus>,
) {
  return personalStatuses[routeId] ?? DEFAULT_PERSONAL_STATUSES[routeId] ?? "untouched";
}

function getGradeRange(
  gradeScaleRange: readonly [ClimbingGrade, ClimbingGrade] | null | undefined,
): readonly [ClimbingGrade | null, ClimbingGrade | null] {
  return [gradeScaleRange?.[0] ?? null, gradeScaleRange?.[1] ?? null];
}

function getGradeScale(gradeScale: ClimbingGrade | string | null | undefined, gradeLabel?: string) {
  if (isClimbingGrade(gradeScale)) {
    return gradeScale;
  }

  const gradeMatch = gradeLabel?.match(/[1-9]/)?.[0];

  return isClimbingGrade(gradeMatch) ? gradeMatch : null;
}

function getClimbingTypeValue(value: string) {
  const normalizedValue = normalizeSearchValue(value);

  if (normalizedValue === "boulder" || normalizedValue === "bouldering") {
    return "bouldering";
  }

  if (normalizedValue === "lina" || normalizedValue === "lead" || normalizedValue === "rope") {
    return "rope";
  }

  if (normalizedValue === "auto-belay") {
    return "auto-belay";
  }

  return null;
}

function isClimbingGrade(value: unknown): value is ClimbingGrade {
  return typeof value === "string" && ["1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(value);
}

function safeArray<T>(values: readonly T[] | null | undefined): readonly T[] {
  return values ?? [];
}
