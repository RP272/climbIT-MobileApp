import type { VideoSource } from "expo-video";

export type WatchReel = {
  id: string;
  videoSource: VideoSource;
  title: string;
  routeName: string;
  place: string;
  authorName: string;
  authorHandle: string;
  viewsLabel: string;
  likesLabel: string;
  dislikesLabel: string;
  commentsLabel: string;
  musicTrack: string;
  musicArtist: string;
};

export type UploadWatchVideoPayload = {
  videoUri: string;
  routeId?: string;
  gymId?: string;
  title?: string;
  routeName?: string;
  place?: string;
  musicTrack?: string;
  musicArtist?: string;
};

export type FetchWatchReelsOptions = {
  limit?: number;
  offset?: number;
};
