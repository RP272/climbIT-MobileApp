import {
  ChallengeColumn,
  ChallengeColumnSkeleton,
} from "@/components/discover/challenges/challenge-column";
import { HorizontalScrollSection } from "@/components/discover/horizontal-scroll-section";
import {
  DiscoverGymsCard,
  DiscoverGymsCardSkeleton,
} from "@/components/discover/gyms/discover-gyms-card";
import { chunkIntoColumns } from "@/src/features/discover/challenges/challenges.utils";
import { useDiscoverChallenges } from "@/src/features/discover/hooks/useDiscoverChallenges";
import { useDiscoverGyms } from "@/src/features/discover/hooks/useDiscoverGyms";
import { ScrollView, View } from "react-native";

const CHALLENGES_PER_COLUMN = 3;

export default function DiscoverScreen() {
  const { data: featuredGyms = [], isLoading } = useDiscoverGyms();
  const { data: weeklyChallenges = [], isLoading: isLoadingChallenges } = useDiscoverChallenges();
  const challengeColumns = chunkIntoColumns(weeklyChallenges, CHALLENGES_PER_COLUMN);

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="px-4 py-4">
      <View className="gap-4 pb-24">
        <HorizontalScrollSection
          title="Polecane ścianki"
          description="Najciekawsze miejsca z nowymi setami"
          items={featuredGyms}
          isLoading={isLoading}
          loadingItemsCount={3}
          renderLoadingItem={() => <DiscoverGymsCardSkeleton />}
          keyExtractor={(gym) => gym.id}
          onActionPress={() => {}}
          renderItem={(gym) => <DiscoverGymsCard {...gym} />}
        />

        <HorizontalScrollSection
          title="Wyzwania"
          description="Szybkie cele za dodatkowe XP"
          items={challengeColumns}
          isLoading={isLoadingChallenges}
          loadingItemsCount={3}
          renderLoadingItem={() => <ChallengeColumnSkeleton />}
          keyExtractor={(column, index) => column[0]?.id ?? `challenge-column-${index}`}
          renderItem={(column) => <ChallengeColumn challenges={column} />}
        />
      </View>
    </ScrollView>
  );
}
