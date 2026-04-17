import { View } from "react-native";
import type { Challenge } from "@/src/types/discover";

import { ChallengeCard, ChallengeCardSkeleton } from "./challenge-card";

type ChallengeColumnProps = {
  challenges: Challenge[];
};

export function ChallengeColumn({ challenges }: ChallengeColumnProps) {
  return (
    <View className="w-[272px] gap-2.5">
      {challenges.map((challenge) => (
        <ChallengeCard key={challenge.id} challenge={challenge} />
      ))}
    </View>
  );
}

export function ChallengeColumnSkeleton() {
  return (
    <View className="w-[272px] gap-2.5">
      <ChallengeCardSkeleton />
      <ChallengeCardSkeleton />
    </View>
  );
}
