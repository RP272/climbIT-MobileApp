import { voteOnClimbAttempt } from "@/src/api/climb-attempts.api";
import { watchKeys } from "@/src/features/watch/hooks/useWatchReels";
import { getVoteCountsFromAttempt } from "@/src/features/watch/utils/vote.utils";
import type { WatchReel } from "@/src/types/watch";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type VotePayload = {
  climbAttemptId: string;
  isValid: boolean;
};

export function useVoteOnClimbAttempt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ climbAttemptId, isValid }: VotePayload) =>
      voteOnClimbAttempt(climbAttemptId, isValid),
    onSuccess: (data, { climbAttemptId }) => {
      const counts = getVoteCountsFromAttempt(data);

      queryClient.setQueryData<WatchReel[]>(watchKeys.reels(), (reels) =>
        reels?.map((reel) =>
          reel.climbAttemptId === climbAttemptId
            ? { ...reel, likesCount: counts.likes, dislikesCount: counts.dislikes }
            : reel,
        ),
      );
    },
  });
}
