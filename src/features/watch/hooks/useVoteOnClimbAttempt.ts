import { voteOnClimbAttempt } from "@/src/api/climb-attempts.api";
import { watchKeys } from "@/src/features/watch/hooks/useWatchReels";
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
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: watchKeys.reels() });
    },
  });
}
