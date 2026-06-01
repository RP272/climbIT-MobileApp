import { createClimbAttempt, fetchClimbAttempts } from "@/src/api/climb-attempts.api";
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
  const { id: climbAttemptId } = await createClimbAttempt({
    routeId: payload.routeId,
    type: payload.type,
  });

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
  const formData = new FormData();
  const fileName = payload.videoUri.split("/").pop() ?? `climb-${Date.now()}.mp4`;
  const fileExtension = fileName.split(".").pop()?.toLowerCase() ?? "mp4";

  formData.append("climbAttemptId", payload.climbAttemptId);
  if (payload.title?.trim()) {
    formData.append("title", payload.title.trim());
  }
  formData.append("file", {
    uri: payload.videoUri,
    name: fileName,
    type: fileExtension === "mov" ? "video/quicktime" : "video/mp4",
  } as any);

  const response = await apiRequest<VideoApiEntry>("/videos/upload", {
    method: "POST",
    data: formData,
  });

  const attempt = (await fetchClimbAttempts().catch(() => [] as ClimbAttemptListApiEntry[])).find(
    (item) => item.id === payload.climbAttemptId,
  );

  const context = getAttemptContext(attempt);

  const reel = toWatchReel(
    {
      ...response,
      fileUrl: response.fileUrl ?? payload.videoUri,
      title: response.title ?? payload.title ?? null,
      routeName: response.routeName ?? payload.routeName ?? null,
      facilityName: response.facilityName ?? payload.place ?? null,
    },
    0,
    {
      ...context,
      title: payload.title,
      routeName: payload.routeName,
      place: payload.place,
      uploadedAtLabel: formatReelUploadDate(response.uploadedAt ?? new Date().toISOString()),
    },
    payload.title,
  );

  if (!reel) {
    throw new Error("Uploaded video could not be converted into a reel.");
  }

  return reel;
}
