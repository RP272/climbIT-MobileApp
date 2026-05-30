import { apiRequest } from "@/src/api/client";
import leaderboardData from "@/src/data/leaderboard.json";
import type { LeaderboardApiEntry } from "@/src/types/api";
import type {
  FetchLeaderboardOptions,
  LeaderboardEntryDto,
  LeaderboardScope,
} from "@/src/types/ranking";

const FRIENDS_LEADERBOARD = leaderboardData.friends as LeaderboardEntryDto[];

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

function normalizeFriendsEntry(
  entry: (typeof leaderboardData.friends)[number],
  index: number,
): LeaderboardEntryDto {
  return {
    id: entry.id,
    name: entry.name,
    points: entry.points,
    avatarUrl: entry.avatarUrl,
    rank: index + 1,
    skillLevel: null,
  };
}

/**
 * Fetches leaderboard entries for the given scope.
 * Global ranking uses GET /leaderboard/global. Friends ranking still uses mock data
 * until a dedicated backend endpoint exists.
 */
export async function fetchLeaderboard(
  scope: LeaderboardScope,
  options: FetchLeaderboardOptions = {},
): Promise<LeaderboardEntryDto[]> {
  if (scope === "friends") {
    return FRIENDS_LEADERBOARD.map(normalizeFriendsEntry);
  }

  const limit = options.limit ?? 50;
  const offset = options.offset ?? 0;

  const entries = await apiRequest<LeaderboardApiEntry[]>("/leaderboard/global", {
    searchParams: { limit, offset },
  });

  return entries.map(toLeaderboardEntry);
}
