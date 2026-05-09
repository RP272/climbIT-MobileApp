import { Leaderboard } from "@/components/ranking/leaderboard";
import { Text } from "@/components/ui/text";
import { LEADERBOARD_ENTRIES } from "@/src/features/ranking/leaderboard-data";
import { useState } from "react";
import { Modal, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RankingScreen() {
  const [isFullOpen, setIsFullOpen] = useState(false);

  return (
    <>
      <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
        <ScrollView className="flex-1 bg-background" contentContainerClassName="px-4 py-4">
          <View className="pb-24">
            <Leaderboard
              title="Ranking wspinaczy"
              description="Top 5 w tym tygodniu."
              entries={LEADERBOARD_ENTRIES}
              mode="preview"
              previewCount={5}
              onExpandPress={() => setIsFullOpen(true)}
            />
          </View>
        </ScrollView>
      </SafeAreaView>

      <Modal
        visible={isFullOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsFullOpen(false)}
      >
        <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
          <View className="flex-1 bg-background px-4 pb-6 pt-4">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-xl font-semibold text-foreground">Pelny ranking</Text>
              <Pressable onPress={() => setIsFullOpen(false)} className="px-2 py-1">
                <Text className="font-medium text-primary">Zamknij</Text>
              </Pressable>
            </View>

            <ScrollView>
              <Leaderboard
                title="Pelny ranking"
                description="Zobacz wszystkich zawodnikow i porownaj punkty."
                entries={LEADERBOARD_ENTRIES}
                mode="full"
                showHeader={false}
              />
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}
