export type LeaderboardApiEntry = {
  rank: number;
  nickname: string | null;
  skillLevel: string | null;
  totalPoints: number;
};

export type VideoApiEntry = {
  id: string | null;
  climbAttemptId: string;
  fileUrl: string | null;
  fileFormat: string | null;
  size: number | null;
  uploadedAt: string | null;
};

export type FacilityApiEntry = {
  id: string;
  name: string;
  address: string | null;
  description: string | null;
};

export type RouteApiEntry = {
  id: string;
  name: string;
  description: string | null;
  facilityId: string | null;
  sector: string | null;
  difficultyLevel: string | null;
  basePoints: number | null;
  status: string | null;
};
