import {
  DiscoverGymsCard,
  DiscoverGymsCardSkeleton,
} from "@/components/discover/gyms/discover-gyms-card";
import { HorizontalScrollSection } from "@/components/discover/gyms/horizontal-scroll-section";
import { useDiscoverGyms } from "@/src/features/discover/hooks/useDiscoverGyms";
import { ScrollView, View } from "react-native";

export default function DiscoverScreen() {
  const { data: featuredGyms = [], isLoading } = useDiscoverGyms();

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
      </View>
    </ScrollView>
  );
}
