import { fetchClimbAttemptsByClimber } from "@/src/api/climb-attempts.api";
import { apiRequest } from "@/src/api/client";
import { getVoteCountsFromAttempt } from "@/src/features/watch/utils/vote.utils";
import {
  formatAttemptType,
  formatReelUploadDate,
  getAttemptDateLabel,
} from "@/src/features/watch/utils/reel-metadata.utils";
import type { ClimbAttemptListApiEntry, VideoApiEntry } from "@/src/types/api";
import type { HomeReelPreview } from "@/src/types/home";

function mapAttemptToHomeReel(
  attempt: ClimbAttemptListApiEntry,
  video: VideoApiEntry | undefined,
  index: number,
  authorName: string,
): HomeReelPreview {
  const routeName = attempt.route?.name?.trim() || "Trasa";
  const place = attempt.route?.facility?.name?.trim() || "Ściana";
  const counts = getVoteCountsFromAttempt(attempt);
  const attemptTypeLabel = formatAttemptType(attempt.type ?? undefined);
  const attemptDateLabel = getAttemptDateLabel(attempt);

  return {
    id: video?.id ?? attempt.id,
    climbAttemptId: attempt.id,
    title:
      video?.title?.trim() || `${routeName}${attemptTypeLabel ? ` · ${attemptTypeLabel}` : ""}`,
    routeName,
    place,
    authorName,
    videoUri: video?.fileUrl ?? null,
    uploadedAtLabel: formatReelUploadDate(video?.uploadedAt) ?? attemptDateLabel,
    attemptTypeLabel,
    attemptDateLabel,
    likesCount: counts.likes,
    dislikesCount: counts.dislikes,
    hasVideo: Boolean(video?.fileUrl),
  };
}

export async function fetchHomeUserReels(limit = 12): Promise<HomeReelPreview[]> {
  const [attempts, videos] = await Promise.all([
    fetchClimbAttemptsByClimber({ limit, offset: 0 }),
    apiRequest<VideoApiEntry[]>("/videos", { searchParams: { limit: 50, offset: 0 } }).catch(
      () => [] as VideoApiEntry[],
    ),
  ]);

  if (attempts.length === 0) {
    return [];
  }

  const videosByAttemptId = new Map(
    videos
      .filter((video) => video.climbAttemptId && video.fileUrl)
      .map((video) => [video.climbAttemptId, video]),
  );

  const authorName = attempts[0]?.climber?.nickname?.trim() || "Ty";

  return attempts.map((attempt, index) =>
    mapAttemptToHomeReel(attempt, videosByAttemptId.get(attempt.id), index, authorName),
  );
}
