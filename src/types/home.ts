export type HomeReelPreview = {
  id: string;
  climbAttemptId: string;
  title: string;
  routeName: string;
  place: string;
  authorName: string;
  videoUri: string | null;
  uploadedAtLabel: string | null;
  attemptTypeLabel: string | null;
  attemptDateLabel: string | null;
  likesCount: number;
  dislikesCount: number;
  hasVideo: boolean;
};
