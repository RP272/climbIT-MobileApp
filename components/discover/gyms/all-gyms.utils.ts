import type { GymSortId, VisibleGymsInput } from "@/components/discover/gyms/all-gyms.types";
import type { Gym } from "@/src/types/discover";

export function getVisibleGyms({ gyms, searchQuery, activeFilterIds, sortId }: VisibleGymsInput) {
  const normalizedSearchQuery = normalizeSearchValue(searchQuery);
  const filteredGyms = gyms
    .filter((gym) => matchesSearchQuery(gym, normalizedSearchQuery))
    .filter((gym) => matchesQuickFilters(gym, activeFilterIds));

  return filteredGyms
    .slice()
    .sort((firstGym, secondGym) => compareGyms(firstGym, secondGym, sortId));
}

function compareGyms(firstGym: Gym, secondGym: Gym, sortId: GymSortId | null) {
  switch (sortId) {
    case "distance":
      return firstGym.distanceKm - secondGym.distanceKm;
    case "rating":
      return secondGym.rating - firstGym.rating;
    case "fresh":
      return secondGym.newRoutesCount - firstGym.newRoutesCount;
    case "name":
      return firstGym.name.localeCompare(secondGym.name, "pl");
    default:
      return getGymScore(secondGym) - getGymScore(firstGym);
  }
}

function matchesSearchQuery(gym: Gym, searchQuery: string) {
  if (!searchQuery) {
    return true;
  }

  const searchableValues = [
    gym.name,
    gym.city,
    gym.description,
    gym.address,
    gym.priceLabel,
    gym.settingSchedule,
    ...(gym.tags ?? []),
    ...(gym.amenities ?? []),
  ];

  return searchableValues
    .filter(Boolean)
    .some((value) => normalizeSearchValue(value).includes(searchQuery));
}

function matchesQuickFilters(gym: Gym, activeFilterIds: readonly string[]) {
  if (activeFilterIds.length === 0) {
    return true;
  }

  return activeFilterIds.every((filterId) => {
    switch (filterId) {
      case "open-now":
        return gym.isOpenNow;
      case "fresh":
        return gym.newRoutesCount >= 15 || gym.routeStatuses.includes("new");
      case "bouldering":
        return gym.climbingTypes.includes("bouldering");
      case "rope":
        return gym.climbingTypes.includes("rope");
      case "challenges":
        return gym.hasChallenges;
      default:
        return true;
    }
  });
}

function getGymScore(gym: Gym) {
  return (
    gym.rating * 8 +
    gym.newRoutesCount * 0.25 +
    (gym.isOpenNow ? 5 : 0) +
    (gym.hasChallenges ? 2 : 0) -
    gym.distanceKm * 0.35
  );
}

function normalizeSearchValue(value: string | undefined) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}
