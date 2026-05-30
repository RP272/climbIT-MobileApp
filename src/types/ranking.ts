export type LeaderboardScope = "global" | "friends";

export type LeaderboardEntryDto = {
  id: string;
  name: string;
  points: number;
  avatarUrl: string;
  rank: number;
  skillLevel: string | null;
};

export type FetchLeaderboardOptions = {
  limit?: number;
  offset?: number;
};
