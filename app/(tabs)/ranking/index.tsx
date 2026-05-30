import { Leaderboard } from "@/components/ranking/leaderboard";
import {
  LeaderboardEmptyState,
  LeaderboardErrorState,
  LeaderboardUnavailableState,
} from "@/components/ranking/leaderboard-states";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { isAuthError } from "@/src/api/is-auth-error";
import { useLeaderboard } from "@/src/features/ranking/hooks/useLeaderboard";
import { useState } from "react";
import { ActivityIndicator, Modal, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function LeaderboardSection({
  title,
  description,
  scope,
  previewCount = 5,
  onExpandPress,
}: {
  title: string;
  description: string;
  scope: "global" | "friends";
  previewCount?: number;
  onExpandPress?: () => void;
}) {
  const { data: entries = [], isLoading, isError, error, refetch } = useLeaderboard(scope);

  return (
    <View className="gap-4">
      <View className="gap-1">
        <Text className="text-[22px] font-semibold text-foreground">{title}</Text>
        <Text className="text-[14px] text-muted-foreground">{description}</Text>
      </View>

      {isLoading ? (
        <View className="items-center gap-2 py-12">
          <ActivityIndicator />
          <Text className="text-sm text-muted-foreground">Ładowanie rankingu…</Text>
        </View>
      ) : isError && isAuthError(error) ? (
        <LeaderboardUnavailableState />
      ) : isError ? (
        <LeaderboardErrorState onRetry={() => void refetch()} />
      ) : entries.length === 0 ? (
        <LeaderboardEmptyState variant={scope} />
      ) : (
        <Leaderboard
          title={title}
          description={description}
          entries={entries}
          mode="preview"
          previewCount={previewCount}
          onExpandPress={onExpandPress}
          showHeader={false}
        />
      )}
    </View>
  );
}

export default function RankingScreen() {
  const [isFullOpen, setIsFullOpen] = useState(false);
  const {
    data: globalEntries = [],
    isLoading: isGlobalLoading,
    isError: isGlobalError,
    error: globalError,
    refetch: refetchGlobal,
  } = useLeaderboard("global");

  return (
    <>
      <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
        <ScrollView className="flex-1 bg-background" contentContainerClassName="px-4 py-4">
          <View className="gap-8 pb-24">
            <LeaderboardSection
              title="Ranking wspinaczy"
              description="Top 5 w tym tygodniu."
              scope="global"
              previewCount={5}
              onExpandPress={() => setIsFullOpen(true)}
            />

            <View className="px-2">
              <Separator className="h-[2px] rounded-full bg-muted-foreground/25" />
            </View>

            <LeaderboardSection
              title="Ranking znajomych"
              description="Twoi znajomi w tym tygodniu."
              scope="friends"
              previewCount={5}
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
              {isGlobalLoading ? (
                <View className="items-center py-16">
                  <ActivityIndicator />
                </View>
              ) : isGlobalError && isAuthError(globalError) ? (
                <LeaderboardUnavailableState />
              ) : isGlobalError ? (
                <LeaderboardErrorState onRetry={() => void refetchGlobal()} />
              ) : globalEntries.length === 0 ? (
                <LeaderboardEmptyState variant="global" />
              ) : (
                <Leaderboard
                  title="Pelny ranking"
                  description="Zobacz wszystkich zawodnikow i porownaj punkty."
                  entries={globalEntries}
                  mode="full"
                  showHeader={false}
                />
              )}
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}
