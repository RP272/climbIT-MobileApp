import type { RecentActivity } from "@/components/profile/activity-history";
import { apiClient } from "@/src/api/api.client";
import { fetchRouteById } from "@/src/api/discover.api";
import {
  ClimbAttemptListRecordDto,
  ClimbAttemptPerDayDto,
  ClimberResponseDto,
  ClimberRouteListDto,
  FacilityResponseDto,
  RouteListCreateRequestDto,
} from "@/src/types/api";
import type { RecommendedRoute } from "@/src/types/discover";

export interface ClimberProfileDetails {
  climber: ClimberResponseDto;
  favouriteFacility?: FacilityResponseDto;
}

export async function fetchClimberProfile(climberId: string): Promise<ClimberResponseDto> {
  const response = await apiClient.get<ClimberResponseDto>(`/climbers/${climberId}`);
  return response.data;
}

export async function fetchFacility(facilityId: string): Promise<FacilityResponseDto> {
  const response = await apiClient.get<FacilityResponseDto>(`/facilities/${facilityId}`);
  return response.data;
}

export async function fetchWeeklyClimbAttempts(): Promise<ClimbAttemptPerDayDto[]> {
  const response = await apiClient.get<ClimbAttemptPerDayDto[]>("/statistics/climb-attempts");
  return response.data;
}

export const RECENT_ACTIVITIES_PAGE_SIZE = 15;

export async function fetchRecentActivities({
  limit = RECENT_ACTIVITIES_PAGE_SIZE,
  offset = 0,
}: {
  limit?: number;
  offset?: number;
} = {}): Promise<RecentActivity[]> {
  const response = await apiClient.get<ClimbAttemptListRecordDto[]>("/climb-attempts/climber", {
    params: {
      limit,
      offset,
    },
  });
  const attempts = response.data.slice().sort((firstAttempt, secondAttempt) => {
    return (
      getAttemptTime(getClimbAttemptDate(secondAttempt)) -
      getAttemptTime(getClimbAttemptDate(firstAttempt))
    );
  });
  const routesById = await fetchAttemptRoutes(attempts);

  return attempts.map((attempt) => {
    const routeId = getClimbAttemptRouteId(attempt);

    return toRecentActivity(attempt, routeId ? routesById.get(routeId) : undefined);
  });
}

export async function fetchSavedRoutes(): Promise<RecommendedRoute[]> {
  const routeList = dedupeRouteListByRouteId(
    (await fetchClimberRouteList()).slice().sort((firstRoute, secondRoute) => {
      return getRouteListTime(secondRoute) - getRouteListTime(firstRoute);
    }),
  );
  const routeResults = await Promise.allSettled(
    routeList.map((routeListEntry) => {
      const routeId = getRouteListRouteId(routeListEntry);

      return routeId ? fetchRouteById(routeId) : Promise.resolve(null);
    }),
  );

  return routeResults
    .map((result) => (result.status === "fulfilled" ? result.value : null))
    .filter((route): route is RecommendedRoute => Boolean(route));
}

export async function fetchSavedRouteIds(): Promise<string[]> {
  return dedupeRouteListByRouteId(await fetchClimberRouteList())
    .map(getRouteListRouteId)
    .filter(isString);
}

export async function addRouteToSavedRoutes(routeId: string): Promise<ClimberRouteListDto> {
  const payload = { routeId } satisfies RouteListCreateRequestDto;
  const response = await apiClient.post<ClimberRouteListDto>("/climbers/route-list", payload);

  return response.data;
}

export async function removeRouteFromSavedRoutes(routeId: string): Promise<void> {
  await apiClient.delete(`/climbers/route-list/${routeId}`);
}

function dedupeRouteListByRouteId(routeList: readonly ClimberRouteListDto[]) {
  const seenRouteIds = new Set<string>();

  return routeList.filter((routeListEntry) => {
    const routeId = getRouteListRouteId(routeListEntry);

    if (!routeId) {
      return false;
    }

    if (seenRouteIds.has(routeId)) {
      return false;
    }

    seenRouteIds.add(routeId);
    return true;
  });
}

async function fetchClimberRouteList(): Promise<ClimberRouteListDto[]> {
  const response = await apiClient.get<ClimberRouteListDto[]>("/climbers/route-list");

  return response.data;
}

function getRouteListRouteId(routeListEntry: ClimberRouteListDto) {
  return routeListEntry.routeId ?? routeListEntry.route_id;
}

function getRouteListTime(routeListEntry: ClimberRouteListDto) {
  return getAttemptTime(routeListEntry.createdAt ?? routeListEntry.created_at);
}

export async function fetchClimberProfileDetails(
  climberId: string,
): Promise<ClimberProfileDetails> {
  const climber = await fetchClimberProfile(climberId);
  const favouriteFacilityId = climber.favouriteFacilityId;

  if (!favouriteFacilityId) {
    return { climber };
  }

  const favouriteFacility = await fetchFacility(favouriteFacilityId);

  return {
    climber,
    favouriteFacility,
  };
}

async function fetchAttemptRoutes(
  attempts: readonly ClimbAttemptListRecordDto[],
): Promise<ReadonlyMap<string, RecommendedRoute>> {
  const routeIds = Array.from(new Set(attempts.map(getClimbAttemptRouteId).filter(isString)));
  const routeResults = await Promise.allSettled(routeIds.map((routeId) => fetchRouteById(routeId)));
  const routes = routeResults
    .map((result) => (result.status === "fulfilled" ? result.value : null))
    .filter((route): route is RecommendedRoute => Boolean(route));

  return new Map(routes.map((route) => [route.id, route]));
}

function isString(value: string | undefined): value is string {
  return Boolean(value);
}

function toRecentActivity(
  attempt: ClimbAttemptListRecordDto,
  route?: RecommendedRoute,
): RecentActivity {
  const awardedPoints = getClimbAttemptAwardedPoints(attempt);
  const routeId = route?.id ?? getClimbAttemptRouteId(attempt);

  return {
    id: attempt.id,
    routeId,
    status: getActivityStatus(attempt),
    routeName: route?.name ?? attempt.route?.name ?? "Trasa",
    gymName: route?.gymName ?? attempt.route?.facility?.name ?? "Ścianka",
    grade: route?.grade ?? "?",
    dateLabel: formatActivityDateLabel(getClimbAttemptDate(attempt)),
    xpDelta: awardedPoints ? `+${awardedPoints} XP` : undefined,
  };
}

function getActivityStatus(attempt: ClimbAttemptListRecordDto): RecentActivity["status"] {
  const attemptType = attempt.type?.toUpperCase();

  if (attemptType === "FLASH") {
    return "flash";
  }

  if (
    attempt.finalSuccess ||
    attempt.final_success ||
    attempt.adminDecision ||
    attempt.admin_decision ||
    attemptType === "TOP"
  ) {
    return "top";
  }

  return "project";
}

function getClimbAttemptDate(attempt: ClimbAttemptListRecordDto) {
  return attempt.attemptDate ?? attempt.attempt_date;
}

function getClimbAttemptRouteId(attempt: ClimbAttemptListRecordDto) {
  return attempt.routeId ?? attempt.route_id ?? attempt.route?.id;
}

function getClimbAttemptAwardedPoints(attempt: ClimbAttemptListRecordDto) {
  return attempt.awardedPoints ?? attempt.awarded_points;
}

function getAttemptTime(attemptDate: string | undefined) {
  if (!attemptDate) {
    return 0;
  }

  const time = new Date(attemptDate).getTime();

  return Number.isFinite(time) ? time : 0;
}

function formatActivityDateLabel(attemptDate: string | undefined) {
  if (!attemptDate) {
    return "Starsze";
  }

  const attemptTime = new Date(attemptDate).getTime();

  if (!Number.isFinite(attemptTime)) {
    return "Starsze";
  }

  const today = new Date();
  const attemptDay = new Date(attemptTime);
  today.setHours(0, 0, 0, 0);
  attemptDay.setHours(0, 0, 0, 0);

  const daysAgo = Math.round((today.getTime() - attemptDay.getTime()) / (24 * 60 * 60 * 1000));

  if (daysAgo <= 0) {
    return "Dzisiaj";
  }

  if (daysAgo === 1) {
    return "Wczoraj";
  }

  if (daysAgo <= 7) {
    return `${daysAgo} dni temu`;
  }

  return new Date(attemptTime).toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "short",
  });
}
