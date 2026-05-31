import {
  ChallengeCard,
  ChallengeCardSkeleton,
} from "@/components/discover/challenges/challenge-card";
import { useGymChallenges } from "@/src/features/discover/hooks/useGymChallenges";
import { useQueryRefresh } from "@/src/query/use-query-refresh";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FlatList, RefreshControl, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function GymChallengesScreen() {
  const router = useRouter();
  const { gymId } = useLocalSearchParams<{ gymId: string }>();
  const { data: challenges = [], isLoading, refetch } = useGymChallenges(gymId);
  const refresh = useQueryRefresh([{ refetch }]);
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background">
      {isLoading ? (
        <View className="flex-1 px-4 pt-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ChallengeCardSkeleton key={i} containerClassName="w-full" />
          ))}
        </View>
      ) : (
        <FlatList
          data={challenges}
          keyExtractor={(item) => item.id}
          className="flex-1"
          contentContainerClassName="px-4 pt-4 gap-4"
          contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 92, 116) }}
          refreshControl={
            <RefreshControl refreshing={refresh.refreshing} onRefresh={refresh.onRefresh} />
          }
          renderItem={({ item }) => (
            <ChallengeCard
              challenge={item}
              containerClassName="w-full"
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/discover/challenges/[challengeId]",
                  params: { challengeId: item.id },
                })
              }
            />
          )}
        />
      )}
    </View>
  );
}
