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

export type FacilityLeaderboardEntryDto = {
  rank: number;
  climberId: string;
  nickname: string | null;
  skillLevel: string | null;
  totalPoints: number;
  profilePhotoUrl: string | null;
  videoCount: number;
};

export type FacilityLeaderboardDto = {
  facilityId: string;
  facilityName: string;
  videoCount: number;
  entries: FacilityLeaderboardEntryDto[];
};

export type FetchActiveFacilityLeaderboardsOptions = {
  facilityLimit?: number;
  entryLimit?: number;
  facilityOffset?: number;
};

export type FetchFacilityLeaderboardOptions = {
  limit?: number;
  offset?: number;
};
