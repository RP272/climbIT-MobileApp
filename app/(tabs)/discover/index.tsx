import {
  ChallengeColumn,
  ChallengeColumnSkeleton,
} from "@/components/discover/challenges/challenge-column";
import { HorizontalScrollSection } from "@/components/discover/horizontal-scroll-section";
import {
  DiscoverGymsCard,
  DiscoverGymsCardSkeleton,
} from "@/components/discover/gyms/discover-gyms-card";
import { RecommendedRoutesSection } from "@/components/discover/routes/recommended-routes-section";
import { chunkIntoColumns } from "@/src/features/discover/challenges/challenges.utils";
import { useDiscoverChallenges } from "@/src/features/discover/hooks/useDiscoverChallenges";
import { useDiscoverGyms } from "@/src/features/discover/hooks/useDiscoverGyms";
import { useRecommendedRoutes } from "@/src/features/discover/hooks/useRecommendedRoutes";
import { useRouter } from "expo-router";
import { Map } from "lucide-react-native";
import { ScrollView, View } from "react-native";

const CHALLENGES_PER_COLUMN = 3;

export default function DiscoverScreen() {
  const router = useRouter();
  const { data: featuredGyms = [], isLoading } = useDiscoverGyms();
  const { data: recommendedRoutes = [], isLoading: isRecommendedRoutesLoading } =
    useRecommendedRoutes();
  const { data: weeklyChallenges = [], isLoading: isLoadingChallenges } = useDiscoverChallenges();
  const challengeColumns = chunkIntoColumns(weeklyChallenges, CHALLENGES_PER_COLUMN);

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="px-4 py-4">
      <View className="gap-4 pb-24">
        <RecommendedRoutesSection
          routes={recommendedRoutes}
          isLoading={isRecommendedRoutesLoading}
          onActionPress={() => {}}
          onRoutePress={() => {}}
        />

        <HorizontalScrollSection
          title="Polecane ścianki"
          description="Najciekawsze miejsca z nowymi setami"
          items={featuredGyms}
          isLoading={isLoading}
          loadingItemsCount={3}
          renderLoadingItem={() => <DiscoverGymsCardSkeleton />}
          keyExtractor={(gym) => gym.id}
          actionLabel="Mapa"
          actionIcon={Map}
          actionPlacement="header"
          onActionPress={() => router.push("/discover/map")}
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
