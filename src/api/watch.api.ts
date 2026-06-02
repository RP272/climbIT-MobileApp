import { createClimbAttempt, fetchClimbAttempts } from "@/src/api/climb-attempts.api";
import { API_BASE_URL, DEV_JWT_TOKEN } from "@/src/api/api.constants";
import { getAccessToken } from "@/src/api/auth-token";
import { apiRequest } from "@/src/api/client";
import type { ClimbAttemptListApiEntry, VideoApiEntry } from "@/src/types/api";
import {
  getCurrentUserVoteFromDetail,
  getVoteCountsFromAttempt,
} from "@/src/features/watch/utils/vote.utils";
import type { VoteState } from "@/src/features/watch/utils/vote.utils";
import {
  formatAttemptDuration,
  formatAttemptType,
  formatReelUploadDate,
  getAttemptDateLabel,
  getDefaultReelTitle,
  isClimbAttemptAdminVerified,
} from "@/src/features/watch/utils/reel-metadata.utils";
import type {
  FetchWatchReelsOptions,
  PublishWatchReelPayload,
  UploadWatchVideoPayload,
  WatchReel,
} from "@/src/types/watch";
import { Platform } from "react-native";

type ReelContext = {
  title?: string;
  routeName?: string;
  place?: string;
  authorName?: string;
  authorHandle?: string;
  likesCount?: number;
  dislikesCount?: number;
  currentUserVote?: VoteState;
  uploadedAtLabel?: string | null;
  attemptDurationLabel?: string | null;
  attemptTypeLabel?: string | null;
  attemptDateLabel?: string | null;
  isAdminVerified?: boolean;
};

function makeHandle(nickname: string | null | undefined) {
  const base = nickname?.trim() || "wspinacz";
  return (
    base
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, ".")
      .replace(/^\.+|\.+$/g, "") || "wspinacz"
  );
}

function formatVotes(value: number) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
  }

  return `${value}`;
}

function getAttemptContext(attempt: ClimbAttemptListApiEntry | undefined): ReelContext {
  const { likes: likesCount, dislikes: dislikesCount } = getVoteCountsFromAttempt(attempt);

  return {
    routeName: attempt?.route?.name ?? undefined,
    place: attempt?.route?.facility?.name ?? undefined,
    authorName: attempt?.climber?.nickname?.trim() || undefined,
    authorHandle: makeHandle(attempt?.climber?.nickname),
    likesCount,
    dislikesCount,
    currentUserVote: attempt ? getCurrentUserVoteFromDetail(attempt) : undefined,
    attemptDurationLabel: formatAttemptDuration(attempt?.duration),
    attemptTypeLabel: formatAttemptType(attempt?.type),
    attemptDateLabel: getAttemptDateLabel(attempt),
    isAdminVerified: isClimbAttemptAdminVerified(attempt),
  };
}

function toWatchReel(
  video: VideoApiEntry,
  index: number,
  context: ReelContext = {},
  titleOverride?: string,
): WatchReel | null {
  if (!video.fileUrl) {
    return null;
  }

  const id = video.id ?? video.climbAttemptId;
  const uploadedAtLabel = formatReelUploadDate(video.uploadedAt) ?? context.uploadedAtLabel ?? null;

  const authorName = video.authorNickname?.trim() || context.authorName?.trim() || "Wspinacz";
  const videoCounts = getVoteCountsFromAttempt(video);
  const likesCount = context.likesCount ?? videoCounts.likes;
  const dislikesCount = context.dislikesCount ?? videoCounts.dislikes;

  return {
    id,
    climbAttemptId: video.climbAttemptId,
    videoSource: { uri: video.fileUrl },
    title: titleOverride ?? video.title?.trim() ?? context.title ?? getDefaultReelTitle(index),
    routeName: video.routeName?.trim() || context.routeName || "Trasa ze ściany",
    place: video.facilityName?.trim() || context.place || "Ściana climbIT",
    authorName,
    authorHandle: makeHandle(video.authorNickname ?? context.authorName),
    likesLabel: formatVotes(likesCount),
    dislikesLabel: formatVotes(dislikesCount),
    likesCount,
    dislikesCount,
    currentUserVote: context.currentUserVote ?? undefined,
    commentsLabel: "0",
    musicTrack: "Original",
    musicArtist: uploadedAtLabel ?? "climbIT",
    uploadedAtLabel,
    attemptDurationLabel: context.attemptDurationLabel ?? null,
    attemptTypeLabel: context.attemptTypeLabel ?? null,
    attemptDateLabel: context.attemptDateLabel ?? null,
    isAdminVerified: context.isAdminVerified ?? false,
  };
}

/**
 * Fetches feed reels for the Watch tab from GET /videos.
 * Uses climb attempt data as fallback until backend returns enriched video metadata.
 */
export async function fetchWatchReels(options: FetchWatchReelsOptions = {}): Promise<WatchReel[]> {
  const limit = options.limit ?? 20;
  const offset = options.offset ?? 0;

  const videos = await apiRequest<VideoApiEntry[]>("/videos", {
    searchParams: { limit, offset },
  });

  let climbAttemptsResult: ClimbAttemptListApiEntry[] = [];

  try {
    climbAttemptsResult = await fetchClimbAttempts();
  } catch (error) {
    console.warn(
      "[watch] Nie udało się pobrać climb-attempts — liczniki głosów mogą być puste.",
      error,
    );
  }

  const attemptById = new Map(climbAttemptsResult.map((attempt) => [attempt.id, attempt]));

  return videos
    .map((video, index) => {
      const attempt = attemptById.get(video.climbAttemptId);
      const context = getAttemptContext(attempt);

      return toWatchReel(video, index, {
        ...context,
        uploadedAtLabel: formatReelUploadDate(video.uploadedAt),
      });
    })
    .filter((reel): reel is WatchReel => reel !== null);
}

/**
 * Creates a climb attempt for the selected route, then uploads the video to it.
 */
export async function publishWatchReel(payload: PublishWatchReelPayload): Promise<WatchReel> {
  console.log("Publishing watch reel", {
    routeId: payload.routeId,
    hasVideoUri: Boolean(payload.videoUri),
  });
  const { id: climbAttemptId } = await createClimbAttempt({
    routeId: payload.routeId,
    type: payload.type,
  });
  console.log("Created climb attempt for video upload", { climbAttemptId });

  return uploadWatchVideo({
    videoUri: payload.videoUri,
    climbAttemptId,
    title: payload.title,
    routeName: payload.routeName,
    place: payload.place,
  });
}

/**
 * Uploads a recorded climb video with optional title metadata.
 */
export async function uploadWatchVideo(payload: UploadWatchVideoPayload): Promise<WatchReel> {
  const fileName = payload.videoUri.split("/").pop() ?? `climb-${Date.now()}.mp4`;
  const fileExtension = fileName.split(".").pop()?.toLowerCase() ?? "mp4";
  const mimeType = fileExtension === "mov" ? "video/quicktime" : "video/mp4";
  const normalizedVideoUri =
    Platform.OS === "android" &&
    payload.videoUri.startsWith("/") &&
    !payload.videoUri.startsWith("file://")
      ? `file://${payload.videoUri}`
      : payload.videoUri;

  const formData = new FormData();
  formData.append("climbAttemptId", String(payload.climbAttemptId));
  if (payload.title?.trim()) {
    formData.append("title", payload.title.trim());
  }
  formData.append("file", {
    uri: normalizedVideoUri,
    name: fileName,
    type: mimeType,
  } as any);
  console.log("Uploading climb video", {
    climbAttemptId: payload.climbAttemptId,
    uri: normalizedVideoUri,
    fileName,
    mimeType,
  });

  const accessToken = getAccessToken() ?? DEV_JWT_TOKEN;
  const response = await fetch(`${API_BASE_URL}/videos/upload`, {
    method: "POST",
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: formData,
  });

  if (!response.ok) {
    const fallbackMessage = `Video upload failed with status ${response.status}.`;
    let backendMessage: string | null = null;
    try {
      const body = (await response.json()) as { message?: string; error?: string };
      backendMessage = body.message ?? body.error ?? null;
    } catch {}
    throw new Error(backendMessage || fallbackMessage);
  }

  const uploadedVideo = (await response.json()) as VideoApiEntry;

  const attempt = (await fetchClimbAttempts().catch(() => [] as ClimbAttemptListApiEntry[])).find(
    (item) => item.id === payload.climbAttemptId,
  );

  const context = getAttemptContext(attempt);

  const reel = toWatchReel(
    {
      ...uploadedVideo,
      fileUrl: uploadedVideo.fileUrl ?? payload.videoUri,
      title: uploadedVideo.title ?? payload.title ?? null,
      routeName: uploadedVideo.routeName ?? payload.routeName ?? null,
      facilityName: uploadedVideo.facilityName ?? payload.place ?? null,
    },
    0,
    {
      ...context,
      title: payload.title,
      routeName: payload.routeName,
      place: payload.place,
      uploadedAtLabel: formatReelUploadDate(uploadedVideo.uploadedAt ?? new Date().toISOString()),
    },
    payload.title,
  );

  if (!reel) {
    throw new Error("Uploaded video could not be converted into a reel.");
  }

  return reel;
}
