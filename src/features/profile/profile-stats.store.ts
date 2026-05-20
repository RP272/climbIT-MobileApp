import profileData from "@/src/data/profile.json";
import type { ProfileStat } from "@/src/features/profile/profile-stats.types";
import { useSyncExternalStore } from "react";

export type { ProfileStat } from "@/src/features/profile/profile-stats.types";

const baseStats = profileData.stats as ProfileStat[];
const featuredIds = profileData.featuredStatIds as string[] | undefined;
const baseStatsById = new Map(baseStats.map((stat) => [stat.id, stat]));

let orderedStatIds = getInitialStatOrder();
let orderedStatsSnapshot = buildOrderedStatsSnapshot();
const listeners = new Set<() => void>();

function getInitialStatOrder() {
  const preferredIds = featuredIds?.filter((id) => baseStatsById.has(id)) ?? [];
  const remainingIds = baseStats.map((stat) => stat.id).filter((id) => !preferredIds.includes(id));

  return [...preferredIds, ...remainingIds];
}

function emitChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function buildOrderedStatsSnapshot() {
  return orderedStatIds
    .map((id) => baseStatsById.get(id))
    .filter((stat): stat is ProfileStat => Boolean(stat));
}

function getOrderedStatsSnapshot() {
  return orderedStatsSnapshot;
}

export function useOrderedProfileStats() {
  return useSyncExternalStore(subscribe, getOrderedStatsSnapshot, getOrderedStatsSnapshot);
}

export function setProfileStatsOrder(stats: readonly ProfileStat[]) {
  const nextOrder = stats.map((stat) => stat.id).filter((id) => baseStatsById.has(id));
  const missingIds = baseStats.map((stat) => stat.id).filter((id) => !nextOrder.includes(id));
  orderedStatIds = [...nextOrder, ...missingIds];
  orderedStatsSnapshot = buildOrderedStatsSnapshot();
  emitChange();
}
