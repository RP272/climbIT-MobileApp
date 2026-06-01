import {
  fetchClimberProfileDetails,
  fetchWeeklyClimbAttempts,
  type ClimberProfileDetails,
} from "@/src/api/profile.api";
import profileData from "@/src/data/profile.json";
import type { WeeklyActivityRaw } from "@/src/features/profile/profile.types";
import { useQuery } from "@tanstack/react-query";

export const PROFILE_QUERY_KEYS = {
  details: (userId: string) => ["profile", "details", userId] as const,
  weeklyClimbAttempts: () => ["profile", "weekly-climb-attempts"] as const,
};

// Narazie zostaje ale juz dogadałem z Krysia zeby to bylo przez jwt bo w sumie po co mamy trzymac id aktualnego usera jak mamy jwt
const MOCK_CLIMBER_ID = "235917c3-de61-408c-9367-c95b3b428faa";

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

export function useProfileDetailsQuery(userId: string = MOCK_CLIMBER_ID) {
  return useQuery({
    queryKey: PROFILE_QUERY_KEYS.details(userId),
    queryFn: async () => {
      const data = await fetchClimberProfileDetails(userId);

      return data;
    },
    // narazie zostawiam placeholder jakby cos wyjebalo na backendzie bo WiP
    // docelowo sie chyba to wywali zeby nie migalo jak sie laduje i zrobimy skeletony
    placeholderData: PROFILE_PLACEHOLDER_DATA,
  });
}

const WEEKLY_CLIMB_ATTEMPTS_PLACEHOLDER_DATA = profileData.weeklyActivity as WeeklyActivityRaw[];

export function useWeeklyClimbAttemptsQuery() {
  return useQuery({
    queryKey: PROFILE_QUERY_KEYS.weeklyClimbAttempts(),
    queryFn: async () => {
      const data = await fetchWeeklyClimbAttempts();
      console.log("Fetched weekly climb attempts:", data);
      return data.map((day) => ({
        date: day.date,
        count: day.numberOfAttempts,
      }));
    },
    placeholderData: WEEKLY_CLIMB_ATTEMPTS_PLACEHOLDER_DATA,
  });
}
