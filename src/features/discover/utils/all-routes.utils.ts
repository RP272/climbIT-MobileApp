import {
  DEFAULT_PERSONAL_STATUSES,
  HOLD_COLOR_ORDER,
  HOLD_COLORS,
  ROUTE_SETTER_OVERRIDES,
  ROUTE_SETTERS,
} from "@/src/types/all-routes.constants";
import type {
  HoldColorKey,
  RouteViewModel,
  UserRouteStatus,
  WallProfile,
} from "@/src/types/all-routes.types";
import type { RecommendedRoute } from "@/src/types/discover";
import { normalizeSearchValue } from "@/src/features/discover/services/discover-filtering.service";

export function createRouteViewModel(
  route: RecommendedRoute,
  index: number,
  statusOverride: UserRouteStatus | undefined,
): RouteViewModel {
  const colorKey = getRouteHoldColorKey(route, index);
  const isNew = route.routeStatuses.includes("new");

  return {
    route,
    color: HOLD_COLORS[colorKey],
    routeSetter:
      ROUTE_SETTER_OVERRIDES[route.id] ??
      ROUTE_SETTERS[getStableIndex(`${route.id}-setter`, ROUTE_SETTERS.length)],
    personalStatus: statusOverride ?? DEFAULT_PERSONAL_STATUSES[route.id] ?? "untouched",
    wallProfile: getWallProfile(route),
    rating: getDefaultRating(route),
    communityGrade: getCommunityGrade(route),
    popularity: getDefaultPopularity(route),
    setDaysAgo: isNew
      ? 2 + getStableIndex(`${route.id}-set`, 6)
      : 12 + getStableIndex(route.id, 24),
    isExpiringSoon:
      route.id === "route-6" || (!isNew && getStableIndex(`${route.id}-expire`, 4) === 0),
    removalDays: 3 + getStableIndex(`${route.id}-removal`, 6),
  };
}

function getRouteHoldColorKey(route: RecommendedRoute, index: number): HoldColorKey {
  const searchableName = normalizeSearchValue(`${route.name} ${route.styleTags.join(" ")}`);

  if (searchableName.includes("żół") || searchableName.includes("zol")) {
    return "yellow";
  }

  if (searchableName.includes("niebies")) {
    return "blue";
  }

  if (searchableName.includes("czarn")) {
    return "black";
  }

  return HOLD_COLOR_ORDER[index % HOLD_COLOR_ORDER.length];
}

function getWallProfile(route: RecommendedRoute): WallProfile {
  const searchableRoute = normalizeSearchValue(`${route.name} ${route.styleTags.join(" ")}`);

  if (route.routeCharacters.includes("overhang") || searchableRoute.includes("okap")) {
    return "Przewieszenie";
  }

  if (
    route.routeCharacters.includes("balance") ||
    route.styleTags.some((tag) => normalizeSearchValue(tag).includes("połóg"))
  ) {
    return "Połóg";
  }

  return "Pion";
}

function getDefaultRating(route: RecommendedRoute) {
  const baseRating = route.routeStatuses.includes("popular")
    ? 4.1
    : route.routeStatuses.includes("new")
      ? 4.0
      : 3.8;
  const challengeBonus = route.hasChallenge ? 0.2 : 0;
  const ratingOffset = getStableIndex(`${route.id}-rating`, 6) * 0.1;

  return Number(Math.min(5, baseRating + challengeBonus + ratingOffset).toFixed(1));
}

function getCommunityGrade(route: RecommendedRoute) {
  const shiftSeed = getStableIndex(`${route.id}-community-grade`, 5);
  const gradeShift = shiftSeed === 0 ? -1 : shiftSeed === 4 ? 1 : 0;

  return shiftClimbingGrade(route.grade, gradeShift);
}

function shiftClimbingGrade(grade: string, shift: number) {
  if (shift === 0) {
    return grade;
  }

  const match = grade.match(/^(\d+)([a-cA-C])(\+)?$/);

  if (!match) {
    return grade;
  }

  const [, gradeNumberText, gradeLetter, hasPlus] = match;
  const isUppercase = gradeLetter === gradeLetter.toUpperCase();
  const gradeSteps = ["a", "a+", "b", "b+", "c", "c+"] as const;
  let gradeNumber = Number(gradeNumberText);
  let stepIndex = gradeSteps.indexOf(
    `${gradeLetter.toLowerCase()}${hasPlus ?? ""}` as (typeof gradeSteps)[number],
  );

  if (stepIndex === -1) {
    return grade;
  }

  stepIndex += shift;

  while (stepIndex < 0) {
    gradeNumber -= 1;
    stepIndex += gradeSteps.length;
  }

  while (stepIndex >= gradeSteps.length) {
    gradeNumber += 1;
    stepIndex -= gradeSteps.length;
  }

  const shiftedStep = gradeSteps[stepIndex];
  const shiftedLetter = isUppercase ? shiftedStep[0].toUpperCase() : shiftedStep[0];
  const shiftedPlus = shiftedStep.includes("+") ? "+" : "";

  return `${gradeNumber}${shiftedLetter}${shiftedPlus}`;
}

function getDefaultPopularity(route: RecommendedRoute) {
  const basePopularity = route.routeStatuses.includes("popular") ? 76 : 28;
  const challengeBonus = route.hasChallenge ? 12 : 0;

  return basePopularity + challengeBonus + getStableIndex(`${route.id}-popularity`, 24);
}

function getStableIndex(value: string, modulo: number) {
  const hash = value.split("").reduce((currentHash, character) => {
    return currentHash + character.charCodeAt(0);
  }, 0);

  return hash % modulo;
}
