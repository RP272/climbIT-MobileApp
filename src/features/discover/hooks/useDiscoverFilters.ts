import {
  DEFAULT_DISCOVER_FILTERS,
  MAX_RADIUS_KM,
  MIN_RADIUS_KM,
  NEARBY_RADIUS_KM,
  RADIUS_STEP_KM,
  type ChallengeMode,
  type ClimbingGrade,
  type ClimbingType,
  type DiscoverFilters,
  type GradeRange,
  type RadiusKm,
  type RouteCharacter,
  type RouteStatus,
  type SessionGoal,
} from "@/src/types/discover-filters";
import { useMemo, useState } from "react";

type DiscoverFilterActions = {
  setRadiusKm: (radiusKm: RadiusKm) => void;
  setOpenNow: (openNow: boolean) => void;
  toggleClimbingType: (climbingType: ClimbingType) => void;
  setGradeRange: (gradeRange: GradeRange) => void;
  setGradeRangeMin: (grade: ClimbingGrade | null) => void;
  setGradeRangeMax: (grade: ClimbingGrade | null) => void;
  toggleRouteCharacter: (routeCharacter: RouteCharacter) => void;
  toggleSessionGoal: (sessionGoal: SessionGoal) => void;
  toggleRouteStatus: (routeStatus: RouteStatus) => void;
  toggleChallengeMode: (challengeMode: ChallengeMode) => void;
  toggleQuickFilter: (quickFilterId: string) => void;
  resetFilters: () => void;
};

function toggleValue<T extends string>(values: readonly T[], value: T) {
  return values.includes(value)
    ? values.filter((currentValue) => currentValue !== value)
    : [...values, value];
}

function normalizeRadiusKm(radiusKm: RadiusKm) {
  const [, decimals = ""] = RADIUS_STEP_KM.toString().split(".");
  const snappedRadiusKm = Math.round(radiusKm / RADIUS_STEP_KM) * RADIUS_STEP_KM;
  const normalizedRadiusKm = Number(snappedRadiusKm.toFixed(decimals.length));

  return Math.min(Math.max(normalizedRadiusKm, MIN_RADIUS_KM), MAX_RADIUS_KM);
}

function countActiveFilters(filters: DiscoverFilters) {
  return (
    (filters.radiusKm < MAX_RADIUS_KM ? 1 : 0) +
    (filters.openNow ? 1 : 0) +
    filters.climbingTypes.length +
    (filters.gradeRange.min ? 1 : 0) +
    (filters.gradeRange.max ? 1 : 0) +
    filters.routeCharacters.length +
    filters.sessionGoals.length +
    filters.routeStatuses.length +
    filters.challengeModes.length
  );
}

function getActiveQuickFilterIds(filters: DiscoverFilters) {
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
    activeFilterIds.push("challenges");
  }

  return activeFilterIds;
}

export function useDiscoverFilters() {
  const [filters, setFilters] = useState<DiscoverFilters>(DEFAULT_DISCOVER_FILTERS);

  const actions = useMemo<DiscoverFilterActions>(
    () => ({
      setRadiusKm: (radiusKm) =>
        setFilters((currentFilters) => ({
          ...currentFilters,
          radiusKm: normalizeRadiusKm(radiusKm),
        })),
      setOpenNow: (openNow) => setFilters((currentFilters) => ({ ...currentFilters, openNow })),
      toggleClimbingType: (climbingType) =>
        setFilters((currentFilters) => ({
          ...currentFilters,
          climbingTypes: toggleValue(currentFilters.climbingTypes, climbingType),
        })),
      setGradeRange: (gradeRange) =>
        setFilters((currentFilters) => ({ ...currentFilters, gradeRange })),
      setGradeRangeMin: (grade) =>
        setFilters((currentFilters) => ({
          ...currentFilters,
          gradeRange: { ...currentFilters.gradeRange, min: grade },
        })),
      setGradeRangeMax: (grade) =>
        setFilters((currentFilters) => ({
          ...currentFilters,
          gradeRange: { ...currentFilters.gradeRange, max: grade },
        })),
      toggleRouteCharacter: (routeCharacter) =>
        setFilters((currentFilters) => ({
          ...currentFilters,
          routeCharacters: toggleValue(currentFilters.routeCharacters, routeCharacter),
        })),
      toggleSessionGoal: (sessionGoal) =>
        setFilters((currentFilters) => ({
          ...currentFilters,
          sessionGoals: toggleValue(currentFilters.sessionGoals, sessionGoal),
        })),
      toggleRouteStatus: (routeStatus) =>
        setFilters((currentFilters) => ({
          ...currentFilters,
          routeStatuses: toggleValue(currentFilters.routeStatuses, routeStatus),
        })),
      toggleChallengeMode: (challengeMode) =>
        setFilters((currentFilters) => ({
          ...currentFilters,
          challengeModes: toggleValue(currentFilters.challengeModes, challengeMode),
        })),
      toggleQuickFilter: (quickFilterId) =>
        setFilters((currentFilters) => {
          switch (quickFilterId) {
            case "nearby":
              return {
                ...currentFilters,
                radiusKm:
                  currentFilters.radiusKm <= NEARBY_RADIUS_KM ? MAX_RADIUS_KM : NEARBY_RADIUS_KM,
              };
            case "new":
              return {
                ...currentFilters,
                routeStatuses: toggleValue(currentFilters.routeStatuses, "new"),
              };
            case "bouldering":
              return {
                ...currentFilters,
                climbingTypes: toggleValue(currentFilters.climbingTypes, "bouldering"),
              };
            case "rope":
              return {
                ...currentFilters,
                climbingTypes: toggleValue(currentFilters.climbingTypes, "rope"),
              };
            case "challenges":
              return {
                ...currentFilters,
                challengeModes: toggleValue(currentFilters.challengeModes, "with-challenge"),
              };
            default:
              return currentFilters;
          }
        }),
      resetFilters: () => setFilters(DEFAULT_DISCOVER_FILTERS),
    }),
    [],
  );

  const activeQuickFilterIds = useMemo(() => getActiveQuickFilterIds(filters), [filters]);
  const activeFiltersCount = useMemo(() => countActiveFilters(filters), [filters]);

  return {
    filters,
    actions,
    activeQuickFilterIds,
    activeFiltersCount,
  };
}

export type { DiscoverFilterActions };
