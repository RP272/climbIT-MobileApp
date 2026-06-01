import { Leaderboard } from "@/components/ranking/leaderboard";
import {
  LeaderboardEmptyState,
  LeaderboardErrorState,
  LeaderboardUnavailableState,
} from "@/components/ranking/leaderboard-states";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { isAuthError } from "@/src/api/is-auth-error";
import { useLeaderboard } from "@/src/features/ranking/hooks/useLeaderboard";
import { X } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Modal, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RankingScreen() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: globalEntries = [], isLoading, isError, error, refetch } = useLeaderboard("global");

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView className="flex-1 bg-background" contentContainerClassName="px-4 py-4">
        <View className="gap-4 pb-24">
          <View className="gap-1">
            <Text className="text-[22px] font-semibold text-foreground">Ściana rankingu</Text>
            <Text className="text-[14px] text-muted-foreground">
              Podium i kolejne przejścia z boulderingowej listy.
            </Text>
          </View>

          {isLoading ? (
            <View className="items-center gap-2 py-12">
              <ActivityIndicator />
              <Text className="text-sm text-muted-foreground">Ładowanie ściany...</Text>
            </View>
          ) : isError && isAuthError(error) ? (
            <LeaderboardUnavailableState />
          ) : isError ? (
            <LeaderboardErrorState onRetry={() => void refetch()} />
          ) : globalEntries.length === 0 ? (
            <LeaderboardEmptyState variant="global" />
          ) : (
            <Leaderboard
              title="Ściana rankingu"
              description="Podium wspinaczy i kolejne przejścia na tej samej ścianie."
              entries={globalEntries}
              mode="preview"
              previewCount={3}
              onExpandPress={() => setIsExpanded(true)}
              showHeader={false}
            />
          )}
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent
        visible={isExpanded}
        onRequestClose={() => setIsExpanded(false)}
      >
        <View className="flex-1 bg-black/60 px-4 pt-12">
          <View className="flex-1 overflow-hidden rounded-[28px] bg-background">
            <SafeAreaView edges={["top"]} className="px-4 pb-3 pt-2">
              <View className="flex-row items-center justify-between gap-3">
                <View className="flex-1">
                  <Text className="text-[22px] font-semibold text-foreground">Ściana rankingu</Text>
                  <Text className="text-[14px] text-muted-foreground">
                    Pełna lista przejść boulderowych.
                  </Text>
                </View>
                <Pressable
                  onPress={() => setIsExpanded(false)}
                  className="h-10 w-10 items-center justify-center rounded-full bg-muted"
                  accessibilityRole="button"
                  accessibilityLabel="Zamknij ranking"
                >
                  <Icon as={X} size={20} className="text-foreground" strokeWidth={2.2} />
                </Pressable>
              </View>
            </SafeAreaView>

            <ScrollView
              className="flex-1"
              contentContainerClassName="px-4 pb-8"
              showsVerticalScrollIndicator={false}
            >
              <Leaderboard
                title="Ściana rankingu"
                description="Pełna lista przejść boulderowych."
                entries={globalEntries}
                mode="full"
                showHeader={false}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
