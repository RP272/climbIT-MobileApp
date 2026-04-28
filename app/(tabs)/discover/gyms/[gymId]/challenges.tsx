import {
  ChallengeCard,
  ChallengeCardSkeleton,
} from "@/components/discover/challenges/challenge-card";
import { useGymChallenges } from "@/src/features/discover/hooks/useGymChallenges";
import { useLocalSearchParams } from "expo-router";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function GymChallengesScreen() {
  const { gymId } = useLocalSearchParams<{ gymId: string }>();
  const { data: challenges = [], isLoading } = useGymChallenges(gymId);
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
          renderItem={({ item }) => <ChallengeCard challenge={item} containerClassName="w-full" />}
        />
      )}
    </View>
  );
}
