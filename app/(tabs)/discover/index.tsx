import {
  DiscoverGymsCard,
  DiscoverGymsCardSkeleton,
} from "@/components/discover/gyms/discover-gyms-card";
import { HorizontalScrollSection } from "@/components/discover/gyms/horizontal-scroll-section";
import { RecommendedRoutesSection } from "@/components/discover/routes/recommended-routes-section";
import { useDiscoverGyms } from "@/src/features/discover/hooks/useDiscoverGyms";
import { useRecommendedRoutes } from "@/src/features/discover/hooks/useRecommendedRoutes";
import { useRouter } from "expo-router";
import { Map } from "lucide-react-native";
import { ScrollView, View } from "react-native";

export default function DiscoverScreen() {
  const router = useRouter();
  const { data: featuredGyms = [], isLoading } = useDiscoverGyms();
  const { data: recommendedRoutes = [], isLoading: isRecommendedRoutesLoading } =
    useRecommendedRoutes();

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
      </View>
    </ScrollView>
  );
}
