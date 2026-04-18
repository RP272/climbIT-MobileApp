import { RecommendedRouteCard } from "@/components/discover/routes/recommended-routes-section";
import { Skeleton } from "@/components/ui/skeleton";
import { useGymRoutes } from "@/src/features/discover/hooks/useGymRoutes";
import { useLocalSearchParams } from "expo-router";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function GymRoutesScreen() {
  const { gymId } = useLocalSearchParams<{ gymId: string }>();
  const { data: routes = [], isLoading } = useGymRoutes(gymId);
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background">
      {isLoading ? (
        <View className="flex-1 px-4 pt-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-[24px]" />
          ))}
        </View>
      ) : (
        <FlatList
          data={routes}
          keyExtractor={(item) => item.id}
          className="flex-1"
          contentContainerClassName="px-4 pt-4 gap-4"
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
          renderItem={({ item }) => (
            <RecommendedRouteCard route={item} className="w-full" containerClassName="w-full" />
          )}
        />
      )}
    </View>
  );
}
