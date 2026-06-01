import type { VideoSource } from "expo-video";

export type WatchReel = {
  id: string;
  climbAttemptId: string;
  videoSource: VideoSource;
  title: string;
  routeName: string;
  place: string;
  authorName: string;
  authorHandle: string;
  likesLabel: string;
  dislikesLabel: string;
  likesCount?: number;
  dislikesCount?: number;
  commentsLabel: string;
  musicTrack: string;
  musicArtist: string;
  uploadedAtLabel: string | null;
  attemptDurationLabel: string | null;
  attemptTypeLabel: string | null;
  attemptDateLabel: string | null;
  isAdminVerified: boolean;
};

export type UploadWatchVideoPayload = {
  videoUri: string;
  climbAttemptId: string;
  title?: string;
  routeName?: string;
  place?: string;
  musicTrack?: string;
  musicArtist?: string;
};

export type PublishWatchReelPayload = {
  videoUri: string;
  routeId: string;
  title?: string;
  routeName?: string;
  place?: string;
};

export type FetchWatchReelsOptions = {
  limit?: number;
  offset?: number;
};
