import type { Challenge, RecommendedRoute } from "@/src/types/discover";
import type { ClimbingGrade } from "@/src/types/discover-filters";

export function chunkIntoColumns<T>(items: readonly T[] | null | undefined, columnSize: number) {
  const columns: T[][] = [];
  const safeItems = items ?? [];

  for (let index = 0; index < safeItems.length; index += columnSize) {
    columns.push(safeItems.slice(index, index + columnSize));
  }

  return columns;
}

export function getChallengeProgressRoutes(
  challenge: Challenge,
  routes: readonly RecommendedRoute[],
) {
  return routes.filter((route) => routeMatchesChallengeProgress(route, challenge));
}

export function routeMatchesChallengeProgress(route: RecommendedRoute, challenge: Challenge) {
  return (
    matchesChallengeGym(route, challenge) &&
    matchesAny(challenge.climbingTypes, [route.climbingType]) &&
    matchesChallengeGrade(route.gradeScale, challenge.gradeScaleRange) &&
    matchesAny(challenge.routeCharacters, route.routeCharacters) &&
    matchesAny(challenge.sessionGoals, route.sessionGoals) &&
    matchesAny(challenge.routeStatuses, route.routeStatuses)
  );
}

function matchesChallengeGym(route: RecommendedRoute, challenge: Challenge) {
  return !challenge.gymId || route.gymId === challenge.gymId;
}

function matchesAny<T extends string>(requiredValues: readonly T[], itemValues: readonly T[]) {
  return requiredValues.length === 0 || requiredValues.some((value) => itemValues.includes(value));
}

function matchesChallengeGrade(
  routeGrade: ClimbingGrade,
  challengeGradeRange: readonly [ClimbingGrade, ClimbingGrade] | undefined,
) {
  if (!challengeGradeRange) {
    return true;
  }

  const [minGrade, maxGrade] = challengeGradeRange.map(Number);
  const routeGradeValue = Number(routeGrade);

  return routeGradeValue >= minGrade && routeGradeValue <= maxGrade;
}
