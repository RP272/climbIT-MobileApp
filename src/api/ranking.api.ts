import { apiRequest } from "@/src/api/client";
import type { LeaderboardApiEntry } from "@/src/types/api";
import type {
  FacilityLeaderboardDto,
  FacilityLeaderboardEntryDto,
  FetchActiveFacilityLeaderboardsOptions,
  FetchFacilityLeaderboardOptions,
  FetchLeaderboardOptions,
  LeaderboardEntryDto,
  LeaderboardScope,
} from "@/src/types/ranking";

function toLeaderboardEntry(entry: LeaderboardApiEntry): LeaderboardEntryDto {
  const id = `${entry.rank}-${entry.nickname ?? "anonymous"}`;
  const name = entry.nickname?.trim() || "Anonimowy wspinacz";

  return {
    id,
    name,
    points: entry.totalPoints,
    avatarUrl: `https://i.pravatar.cc/160?u=${encodeURIComponent(id)}`,
    rank: entry.rank,
    skillLevel: entry.skillLevel,
  };
}

function toFacilityLeaderboardEntry(entry: FacilityLeaderboardEntryDto): LeaderboardEntryDto {
  const name = entry.nickname?.trim() || "Anonimowy wspinacz";

  return {
    id: entry.climberId,
    name,
    points: entry.totalPoints,
    avatarUrl:
      entry.profilePhotoUrl?.trim() ||
      `https://i.pravatar.cc/160?u=${encodeURIComponent(entry.climberId)}`,
    rank: entry.rank,
    skillLevel: entry.skillLevel,
  };
}

export function mapFacilityLeaderboardToEntries(
  leaderboard: FacilityLeaderboardDto,
): LeaderboardEntryDto[] {
  return leaderboard.entries.map(toFacilityLeaderboardEntry);
}

/**
 * Fetches leaderboard entries for the given scope.
 * Global ranking uses GET /leaderboard/global.
 */
export async function fetchLeaderboard(
  scope: LeaderboardScope,
  options: FetchLeaderboardOptions = {},
): Promise<LeaderboardEntryDto[]> {
  const limit = options.limit ?? 50;
  const offset = options.offset ?? 0;

  const entries = await apiRequest<LeaderboardApiEntry[]>("/leaderboard/global", {
    searchParams: { limit, offset },
  });

  return entries.map(toLeaderboardEntry);
}

export async function fetchActiveFacilityLeaderboards(
  options: FetchActiveFacilityLeaderboardsOptions = {},
): Promise<FacilityLeaderboardDto[]> {
  const facilityLimit = options.facilityLimit ?? 10;
  const entryLimit = options.entryLimit ?? 5;
  const facilityOffset = options.facilityOffset ?? 0;

  return apiRequest<FacilityLeaderboardDto[]>("/leaderboard/facilities/active", {
    searchParams: { facilityLimit, entryLimit, facilityOffset },
  });
}

export async function fetchFacilityLeaderboard(
  facilityId: string,
  options: FetchFacilityLeaderboardOptions = {},
): Promise<FacilityLeaderboardDto> {
  const limit = options.limit ?? 50;
  const offset = options.offset ?? 0;

  return apiRequest<FacilityLeaderboardDto>(`/leaderboard/facilities/${facilityId}`, {
    searchParams: { limit, offset },
  });
}
