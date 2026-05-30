import { apiRequest } from "@/src/api/client";
import type { VideoApiEntry } from "@/src/types/api";
import type { FetchWatchReelsOptions, UploadWatchVideoPayload, WatchReel } from "@/src/types/watch";

const UPLOAD_LATENCY_MS = 900;

/** In-memory store for mock uploads until a real upload endpoint exists. */
const uploadedReels: WatchReel[] = [];

function toWatchReel(video: VideoApiEntry, index: number): WatchReel | null {
  if (!video.fileUrl) {
    return null;
  }

  const id = video.id ?? video.climbAttemptId;
  const uploadedLabel = video.uploadedAt
    ? new Date(video.uploadedAt).toLocaleDateString("pl-PL")
    : "climbIT";

  return {
    id,
    videoSource: { uri: video.fileUrl },
    title: `Klip wspinaczkowy #${index + 1}`,
    routeName: `Próba ${video.climbAttemptId.slice(0, 8)}`,
    place: "climbIT",
    authorName: "Wspinacz",
    authorHandle: "climber",
    viewsLabel: "0",
    likesLabel: "0",
    dislikesLabel: "0",
    commentsLabel: "0",
    musicTrack: "Original",
    musicArtist: uploadedLabel,
  };
}

/**
 * Fetches feed reels for the Watch tab from GET /videos.
 * Requires backend feature/videos (or equivalent) to be deployed.
 */
export async function fetchWatchReels(options: FetchWatchReelsOptions = {}): Promise<WatchReel[]> {
  const limit = options.limit ?? 20;
  const offset = options.offset ?? 0;

  const videos = await apiRequest<VideoApiEntry[]>("/videos", {
    searchParams: { limit, offset },
  });

  const remoteReels = videos
    .map((video, index) => toWatchReel(video, index))
    .filter((reel): reel is WatchReel => reel !== null);

  return [...uploadedReels, ...remoteReels];
}

/**
 * Uploads a recorded climb video.
 * Replace with multipart POST when the backend upload endpoint is ready.
 */
export async function uploadWatchVideo(payload: UploadWatchVideoPayload): Promise<WatchReel> {
  const reel = buildUploadedReel(payload);
  await new Promise((resolve) => setTimeout(resolve, UPLOAD_LATENCY_MS));
  uploadedReels.unshift(reel);
  return reel;
}

function buildUploadedReel(payload: UploadWatchVideoPayload): WatchReel {
  const id = `upload-${Date.now()}`;
  const routeLabel =
    payload.routeName ?? (payload.routeId ? `Trasa ${payload.routeId}` : "Twoja trasa");

  return {
    id,
    videoSource: { uri: payload.videoUri },
    title: payload.title?.trim() || "Nowy klip ze sesji",
    routeName: routeLabel,
    place: payload.place?.trim() || "Twoja sala · climbIT",
    authorName: "Ty",
    authorHandle: "ty.climb",
    viewsLabel: "0",
    likesLabel: "0",
    dislikesLabel: "0",
    commentsLabel: "0",
    musicTrack: payload.musicTrack?.trim() || "Original",
    musicArtist: payload.musicArtist?.trim() || "Nagranie z kamery",
  };
}
