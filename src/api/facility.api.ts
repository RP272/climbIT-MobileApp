import { apiRequest } from "@/src/api/client";
import type { FacilityApiEntry } from "@/src/types/api";
import type { Gym } from "@/src/types/discover";

function parseCityFromAddress(address?: string | null): string {
  if (!address?.trim()) {
    return "—";
  }

  const parts = address
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  return parts[parts.length - 1] ?? address;
}

export function facilityToGym(facility: FacilityApiEntry): Gym {
  return {
    id: facility.id,
    name: facility.name,
    city: parseCityFromAddress(facility.address),
    distanceKm: 0,
    newRoutesCount: 0,
    rating: 0,
    imageUrl: "",
    tags: [],
    isOpenNow: true,
    climbingTypes: ["bouldering"],
    gradeScaleRange: ["3", "8"],
    routeCharacters: [],
    sessionGoals: [],
    routeStatuses: [],
    hasChallenges: false,
    address: facility.address ?? undefined,
    description: facility.description ?? undefined,
  };
}

export async function fetchFacilities(): Promise<Gym[]> {
  const facilities = await apiRequest<FacilityApiEntry[]>("/facilities");
  return facilities.map(facilityToGym);
}

export async function fetchFacilityById(facilityId: string): Promise<Gym | null> {
  try {
    const facility = await apiRequest<FacilityApiEntry>(`/facilities/${facilityId}`);
    return facilityToGym(facility);
  } catch {
    return null;
  }
}
