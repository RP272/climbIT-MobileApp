import type { ClimbAttemptCurrentUserVote } from "@/src/types/api";

export type VoteState = "up" | "down" | null;

export function mapCurrentUserVoteToVoteState(
  vote: ClimbAttemptCurrentUserVote | null | undefined,
): VoteState {
  if (vote === "for") {
    return "up";
  }

  if (vote === "against") {
    return "down";
  }

  return null;
}

export function getCurrentUserVoteFromDetail(detail: {
  currentUserVote?: ClimbAttemptCurrentUserVote | null;
  current_user_vote?: ClimbAttemptCurrentUserVote | null;
}) {
  return mapCurrentUserVoteToVoteState(detail.currentUserVote ?? detail.current_user_vote);
}

export type VoteCounts = {
  likes: number;
  dislikes: number;
};

type VoteCountSource =
  | {
      totalVotesFor?: number;
      total_votes_for?: number;
      totalVotesAgainst?: number;
      total_votes_against?: number;
    }
  | null
  | undefined;

export function getVoteCountsFromAttempt(source: VoteCountSource): VoteCounts {
  return {
    likes: source?.totalVotesFor ?? source?.total_votes_for ?? 0,
    dislikes: source?.totalVotesAgainst ?? source?.total_votes_against ?? 0,
  };
}

export type VoteCountsOptimisticAction =
  | { type: "apply"; nextVote: Exclude<VoteState, null>; previousVote: VoteState }
  | { type: "reset"; counts: VoteCounts };

export function applyVoteCountsOptimistic(
  counts: VoteCounts,
  action: VoteCountsOptimisticAction,
): VoteCounts {
  if (action.type === "reset") {
    return action.counts;
  }

  const { nextVote, previousVote } = action;

  if (previousVote === nextVote) {
    return counts;
  }

  let likes = counts.likes;
  let dislikes = counts.dislikes;

  if (previousVote === "up") {
    likes = Math.max(0, likes - 1);
  }
  if (previousVote === "down") {
    dislikes = Math.max(0, dislikes - 1);
  }
  if (nextVote === "up") {
    likes += 1;
  } else {
    dislikes += 1;
  }

  return { likes, dislikes };
}
