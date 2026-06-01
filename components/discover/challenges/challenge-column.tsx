import { View } from "react-native";
import type { Challenge } from "@/src/types/discover";

import { ChallengeCard, ChallengeCardSkeleton } from "./challenge-card";

type ChallengeColumnProps = {
  challenges: Challenge[];
  onChallengePress?: (challenge: Challenge) => void;
};

export function ChallengeColumn({ challenges, onChallengePress }: ChallengeColumnProps) {
  return (
    <View className="w-[272px] gap-2.5">
      {challenges.map((challenge) => (
        <ChallengeCard
          key={challenge.id}
          challenge={challenge}
          fixedHeight
          onPress={onChallengePress ? () => onChallengePress(challenge) : undefined}
        />
      ))}
    </View>
  );
}

export function ChallengeColumnSkeleton() {
  return (
    <View className="w-[272px] gap-2.5">
      <ChallengeCardSkeleton fixedHeight />
      <ChallengeCardSkeleton fixedHeight />
    </View>
  );
}
