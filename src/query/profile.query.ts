import type { RecentActivity } from "@/components/profile/activity-history";
import {
  fetchClimberProfileDetails,
  fetchRecentActivities,
  fetchSavedRoutes,
  fetchWeeklyClimbAttempts,
  RECENT_ACTIVITIES_PAGE_SIZE,
  type ClimberProfileDetails,
} from "@/src/api/profile.api";
import { DEV_CLIMBER_ID } from "@/src/api/api.constants";
import profileData from "@/src/data/profile.json";
import recommendedRoutesData from "@/src/data/recommended-routes.json";
import type { WeeklyActivityRaw } from "@/src/features/profile/profile.types";
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

export function useProfileDetailsQuery(userId: string = DEV_CLIMBER_ID) {
  return useQuery({
    queryKey: PROFILE_QUERY_KEYS.details(userId),
    queryFn: async () => {
      const data = await fetchClimberProfileDetails(userId);

      return data;
    },
    placeholderData: PROFILE_PLACEHOLDER_DATA,
  });
}

const WEEKLY_CLIMB_ATTEMPTS_PLACEHOLDER_DATA = profileData.weeklyActivity as WeeklyActivityRaw[];
const RECENT_ACTIVITIES_PLACEHOLDER_DATA = profileData.recentActivity as RecentActivity[];
const SAVED_ROUTES_PLACEHOLDER_DATA = (
  recommendedRoutesData as unknown as RecommendedRoute[]
).filter((route) => DEFAULT_PERSONAL_STATUSES[route.id] === "project");

export function useWeeklyClimbAttemptsQuery() {
  return useQuery({
    queryKey: PROFILE_QUERY_KEYS.weeklyClimbAttempts(),
    queryFn: async () => {
      const data = await fetchWeeklyClimbAttempts();

      return data.map((day) => ({
        date: day.date,
        count: day.numberOfAttempts,
      }));
    },
    placeholderData: WEEKLY_CLIMB_ATTEMPTS_PLACEHOLDER_DATA,
  });
}

export function useRecentActivitiesQuery() {
  return useQuery({
    queryKey: PROFILE_QUERY_KEYS.recentActivities(),
    queryFn: () => fetchRecentActivities(),
    placeholderData: RECENT_ACTIVITIES_PLACEHOLDER_DATA,
  });
}

export function useRecentActivitiesInfiniteQuery() {
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
    placeholderData: {
      pages: [RECENT_ACTIVITIES_PLACEHOLDER_DATA],
      pageParams: [0],
    },
  });
}

export function useSavedRoutesQuery() {
  return useQuery({
    queryKey: PROFILE_QUERY_KEYS.savedRoutes(),
    queryFn: async () => {
      const data = await fetchSavedRoutes();
      return data;
    },
    placeholderData: SAVED_ROUTES_PLACEHOLDER_DATA,
  });
}
