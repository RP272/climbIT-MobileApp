import { Leaderboard } from "@/components/ranking/leaderboard";
import { LEADERBOARD_ENTRIES } from "@/src/features/ranking/leaderboard-data";
import { ScrollView, View } from "react-native";

export default function FullRankingScreen() {
  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="px-4 py-4">
      <View className="pb-10">
        <Leaderboard
          title="Pelen ranking"
          description="Zobacz wszystkich zawodnikow i porownaj punkty."
          entries={LEADERBOARD_ENTRIES}
          mode="full"
          showHeader={false}
        />
      </View>
    </ScrollView>
  );
}
