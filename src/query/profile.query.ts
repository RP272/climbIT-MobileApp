import type { RecentActivity } from "@/components/profile/activity-history";
import {
  fetchClimberProfileDetails,
  fetchRecentActivities,
  fetchSavedRoutes,
  fetchWeeklyClimbAttempts,
  RECENT_ACTIVITIES_PAGE_SIZE,
  type ClimberProfileDetails,
} from "@/src/api/profile.api";
import { getUserIdFromAccessToken } from "@/src/api/jwt.utils";
import profileData from "@/src/data/profile.json";
import recommendedRoutesData from "@/src/data/recommended-routes.json";
import type { WeeklyActivityRaw } from "@/src/features/profile/profile.types";
import { useAuth } from "@/src/providers/auth-provider";
import { DEFAULT_PERSONAL_STATUSES } from "@/src/types/all-routes.constants";
import type { RecommendedRoute } from "@/src/types/discover";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const PROFILE_QUERY_KEYS = {
  details: (userId: string) => ["profile", "details", userId] as const,
  recentActivities: () => ["profile", "recent-activities"] as const,
  savedRoutes: () => ["profile", "saved-routes"] as const,
  weeklyClimbAttempts: () => ["profile", "weekly-climb-attempts"] as const,
};

const PROFILE_PLACEHOLDER_DATA: ClimberProfileDetails = {
  climber: {
    id: "mock-climber-id",
    nickname: "Mateusz Kowalski",
    skillLevel: "Advanced",
    totalPoints: 6840,
    favouriteFacilityId: "mock-facility-id",
    profilePhotoUrl:
      "https://images.unsplash.com/photo-1522163182402-834f871fd851?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
  },
  favouriteFacility: {
    id: "mock-facility-id",
    name: "Flow Climbing Space",
    address: "Wrocław",
    description: "Wrocław climbing gym",
  },
};

function useCurrentClimberId(): string | undefined {
  const { accessToken } = useAuth();

  return getUserIdFromAccessToken(accessToken) ?? undefined;
}

export function useProfileDetailsQuery(userId?: string) {
  const climberIdFromAuth = useCurrentClimberId();
  const climberId = userId ?? climberIdFromAuth;

  return useQuery({
    queryKey: PROFILE_QUERY_KEYS.details(climberId ?? "anonymous"),
    queryFn: async () => {
      const data = await fetchClimberProfileDetails(climberId!);

      return data;
    },
    enabled: Boolean(climberId),
    placeholderData: PROFILE_PLACEHOLDER_DATA,
  });
}

const WEEKLY_CLIMB_ATTEMPTS_PLACEHOLDER_DATA = profileData.weeklyActivity as WeeklyActivityRaw[];
const RECENT_ACTIVITIES_PLACEHOLDER_DATA = profileData.recentActivity as RecentActivity[];
const SAVED_ROUTES_PLACEHOLDER_DATA = (
  recommendedRoutesData as unknown as RecommendedRoute[]
).filter((route) => DEFAULT_PERSONAL_STATUSES[route.id] === "project");

export function useWeeklyClimbAttemptsQuery() {
  const climberId = useCurrentClimberId();

  return useQuery({
    queryKey: PROFILE_QUERY_KEYS.weeklyClimbAttempts(),
    queryFn: async () => {
      const data = await fetchWeeklyClimbAttempts();

      return data.map((day) => ({
        date: day.date,
        count: day.numberOfAttempts,
      }));
    },
    enabled: Boolean(climberId),
    placeholderData: WEEKLY_CLIMB_ATTEMPTS_PLACEHOLDER_DATA,
  });
}

export function useRecentActivitiesQuery() {
  const climberId = useCurrentClimberId();

  return useQuery({
    queryKey: PROFILE_QUERY_KEYS.recentActivities(),
    queryFn: () => fetchRecentActivities(),
    enabled: Boolean(climberId),
    placeholderData: RECENT_ACTIVITIES_PLACEHOLDER_DATA,
  });
}

export function useRecentActivitiesInfiniteQuery() {
  const climberId = useCurrentClimberId();

  return useInfiniteQuery({
    queryKey: [...PROFILE_QUERY_KEYS.recentActivities(), "infinite"],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      fetchRecentActivities({
        limit: RECENT_ACTIVITIES_PAGE_SIZE,
        offset: pageParam,
      }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === RECENT_ACTIVITIES_PAGE_SIZE
        ? allPages.length * RECENT_ACTIVITIES_PAGE_SIZE
        : undefined,
    enabled: Boolean(climberId),
    placeholderData: {
      pages: [RECENT_ACTIVITIES_PLACEHOLDER_DATA],
      pageParams: [0],
    },
  });
}

export function useSavedRoutesQuery() {
  const climberId = useCurrentClimberId();

  return useQuery({
    queryKey: PROFILE_QUERY_KEYS.savedRoutes(),
    queryFn: async () => {
      const data = await fetchSavedRoutes();
      return data;
    },
    enabled: Boolean(climberId),
    placeholderData: SAVED_ROUTES_PLACEHOLDER_DATA,
  });
}
