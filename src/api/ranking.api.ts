import { apiRequest } from "@/src/api/client";
import type { LeaderboardApiEntry } from "@/src/types/api";
import type {
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
