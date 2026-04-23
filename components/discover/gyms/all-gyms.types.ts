import type { Gym } from "@/src/types/discover";

export type GymSortId = "distance" | "rating" | "fresh" | "name";

export type VisibleGymsInput = {
  gyms: readonly Gym[];
  searchQuery: string;
  activeFilterIds: readonly string[];
  sortId: GymSortId | null;
};
