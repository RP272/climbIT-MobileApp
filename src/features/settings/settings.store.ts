import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type ClimbingStyle = "bouldering" | "lead" | "speed";

export type SettingsState = {
  // Preferencje wspinaczkowe
  homeGymId: string | null;
  climbingStyle: ClimbingStyle;

  // Powiadomienia
  notificationsEnabled: boolean;
  notifyNewRoutes: boolean;
  notifyWeeklyGoal: boolean;
  notifyRankingChanges: boolean;

  // Prywatność
  privateProfile: boolean;
  hideInLocalRankings: boolean;

  // App
  darkMode: boolean;

  // Akcje
  setHomeGymId: (id: string | null) => void;
  setClimbingStyle: (style: ClimbingStyle) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setNotifyNewRoutes: (enabled: boolean) => void;
  setNotifyWeeklyGoal: (enabled: boolean) => void;
  setNotifyRankingChanges: (enabled: boolean) => void;
  setPrivateProfile: (enabled: boolean) => void;
  setHideInLocalRankings: (enabled: boolean) => void;
  setDarkMode: (enabled: boolean) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Domyślne wartości
      homeGymId: null,
      climbingStyle: "bouldering",

      notificationsEnabled: true,
      notifyNewRoutes: true,
      notifyWeeklyGoal: true,
      notifyRankingChanges: true,

      privateProfile: false,
      hideInLocalRankings: false,

      darkMode: false,

      setHomeGymId: (id) => set({ homeGymId: id }),
      setClimbingStyle: (style) => set({ climbingStyle: style }),

      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
      setNotifyNewRoutes: (enabled) => set({ notifyNewRoutes: enabled }),
      setNotifyWeeklyGoal: (enabled) => set({ notifyWeeklyGoal: enabled }),
      setNotifyRankingChanges: (enabled) => set({ notifyRankingChanges: enabled }),

      setPrivateProfile: (enabled) => set({ privateProfile: enabled }),
      setHideInLocalRankings: (enabled) => set({ hideInLocalRankings: enabled }),

      setDarkMode: (enabled) => set({ darkMode: enabled }),
    }),
    {
      name: "settings-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
