import { fetchClimbAttemptById } from "@/src/api/climb-attempts.api";
import {
  getCurrentUserVoteFromDetail,
  type VoteState,
} from "@/src/features/watch/utils/vote.utils";
import { useQuery } from "@tanstack/react-query";

export const climbAttemptVoteKeys = {
  userVote: (climbAttemptId: string) => ["climb-attempt", climbAttemptId, "user-vote"] as const,
};

export function useClimbAttemptUserVote(climbAttemptId: string) {
  return useQuery({
    queryKey: climbAttemptVoteKeys.userVote(climbAttemptId),
    queryFn: () => fetchClimbAttemptById(climbAttemptId),
    select: (detail): VoteState => getCurrentUserVoteFromDetail(detail),
    staleTime: 30_000,
  });
}
