import { FacilityLeaderboardSection } from "@/components/ranking/facility-leaderboard-section";
import { Leaderboard } from "@/components/ranking/leaderboard";
import {
  LeaderboardEmptyState,
  LeaderboardErrorState,
  LeaderboardUnavailableState,
} from "@/components/ranking/leaderboard-states";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { isAuthError } from "@/src/api/is-auth-error";
import { mapFacilityLeaderboardToEntries } from "@/src/api/ranking.api";
import {
  useActiveFacilityLeaderboards,
  useFacilityLeaderboard,
} from "@/src/features/ranking/hooks/useFacilityLeaderboards";
import { useLeaderboard } from "@/src/features/ranking/hooks/useLeaderboard";
import { X } from "lucide-react-native";
import { useMemo, useState } from "react";
import { ActivityIndicator, Modal, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RankingScreen() {
  const [isGlobalExpanded, setIsGlobalExpanded] = useState(false);
  const [expandedFacilityId, setExpandedFacilityId] = useState<string | null>(null);

  const {
    data: globalEntries = [],
    isLoading: isGlobalLoading,
    isError: isGlobalError,
    error: globalError,
    refetch: refetchGlobal,
  } = useLeaderboard("global", { limit: 50 });

  const {
    data: facilityLeaderboards = [],
    isLoading: isFacilityLoading,
    isError: isFacilityError,
    error: facilityError,
    refetch: refetchFacilities,
  } = useActiveFacilityLeaderboards({ facilityLimit: 10, entryLimit: 5 });

  const { data: expandedFacilityLeaderboard, isLoading: isExpandedFacilityLoading } =
    useFacilityLeaderboard(expandedFacilityId, { limit: 50 });

  const expandedFacilityName = useMemo(() => {
    if (expandedFacilityLeaderboard?.facilityName) {
      return expandedFacilityLeaderboard.facilityName;
    }

    return (
      facilityLeaderboards.find((leaderboard) => leaderboard.facilityId === expandedFacilityId)
        ?.facilityName ?? "Obiekt"
    );
  }, [expandedFacilityId, expandedFacilityLeaderboard, facilityLeaderboards]);

  const expandedFacilityEntries = useMemo(() => {
    if (!expandedFacilityLeaderboard) {
      return [];
    }

    return mapFacilityLeaderboardToEntries(expandedFacilityLeaderboard).map(
      ({ id, name, points, avatarUrl }) => ({
        id,
        name,
        points,
        avatarUrl,
      }),
    );
  }, [expandedFacilityLeaderboard]);

  const globalLeaderboardEntries = globalEntries.map(({ id, name, points, avatarUrl }) => ({
    id,
    name,
    points,
    avatarUrl,
  }));

  const isAuthFailure =
    (isGlobalError && isAuthError(globalError)) || (isFacilityError && isAuthError(facilityError));

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView className="flex-1 bg-background" contentContainerClassName="px-4 py-4">
        <View className="gap-6 pb-24">
          <View className="gap-1">
            <Text className="text-[22px] font-semibold text-foreground">Ranking</Text>
            <Text className="text-[14px] text-muted-foreground">
              Globalna lista punktów oraz rankingi na obiektach z filmami.
            </Text>
          </View>

          {isAuthFailure ? (
            <LeaderboardUnavailableState />
          ) : (
            <>
              <View className="gap-3">
                <View className="gap-1">
                  <Text className="text-[18px] font-semibold text-foreground">
                    Ranking globalny
                  </Text>
                  <Text className="text-[13px] text-muted-foreground">
                    Wszyscy wspinacze według łącznych punktów.
                  </Text>
                </View>

                {isGlobalLoading ? (
                  <View className="items-center gap-2 py-8">
                    <ActivityIndicator />
                    <Text className="text-sm text-muted-foreground">
                      Ładowanie rankingu globalnego...
                    </Text>
                  </View>
                ) : isGlobalError ? (
                  <LeaderboardErrorState onRetry={() => void refetchGlobal()} />
                ) : globalLeaderboardEntries.length === 0 ? (
                  <LeaderboardEmptyState variant="global" />
                ) : (
                  <Leaderboard
                    title="Ranking globalny"
                    description="Podium i kolejne miejsca według punktów."
                    entries={globalLeaderboardEntries}
                    mode="preview"
                    previewCount={3}
                    onExpandPress={() => setIsGlobalExpanded(true)}
                    showHeader={false}
                  />
                )}
              </View>

              <View className="gap-3">
                <View className="gap-1">
                  <Text className="text-[18px] font-semibold text-foreground">
                    Rankingi obiektów
                  </Text>
                  <Text className="text-[13px] text-muted-foreground">
                    Obiekty z filmami — w rankingu są wspinacze, którzy wrzucili reel na danej
                    ścianie.
                  </Text>
                </View>

                {isFacilityLoading ? (
                  <View className="items-center gap-2 py-8">
                    <ActivityIndicator />
                    <Text className="text-sm text-muted-foreground">
                      Ładowanie rankingów obiektów...
                    </Text>
                  </View>
                ) : isFacilityError ? (
                  <LeaderboardErrorState onRetry={() => void refetchFacilities()} />
                ) : facilityLeaderboards.length === 0 ? (
                  <View className="rounded-2xl border border-border/70 bg-card px-4 py-6">
                    <Text className="text-center text-[14px] text-muted-foreground">
                      Jeszcze nie ma obiektów z filmami. Gdy ktoś wrzuci pierwszy reel, ranking
                      obiektu pojawi się tutaj.
                    </Text>
                  </View>
                ) : (
                  facilityLeaderboards.map((leaderboard) => (
                    <FacilityLeaderboardSection
                      key={leaderboard.facilityId}
                      leaderboard={leaderboard}
                      previewCount={3}
                      onExpandPress={() => setExpandedFacilityId(leaderboard.facilityId)}
                    />
                  ))
                )}
              </View>
            </>
          )}
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent
        visible={isGlobalExpanded}
        onRequestClose={() => setIsGlobalExpanded(false)}
      >
        <View className="flex-1 bg-black/60 px-4 pt-12">
          <View className="flex-1 overflow-hidden rounded-[28px] bg-background">
            <SafeAreaView edges={["top"]} className="px-4 pb-3 pt-2">
              <View className="flex-row items-center justify-between gap-3">
                <View className="flex-1">
                  <Text className="text-[22px] font-semibold text-foreground">
                    Ranking globalny
                  </Text>
                  <Text className="text-[14px] text-muted-foreground">Pełna lista punktów.</Text>
                </View>
                <Pressable
                  onPress={() => setIsGlobalExpanded(false)}
                  className="h-10 w-10 items-center justify-center rounded-full bg-muted"
                  accessibilityRole="button"
                  accessibilityLabel="Zamknij ranking globalny"
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
                title="Ranking globalny"
                description="Pełna lista punktów."
                entries={globalLeaderboardEntries}
                mode="full"
                showHeader={false}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent
        visible={Boolean(expandedFacilityId)}
        onRequestClose={() => setExpandedFacilityId(null)}
      >
        <View className="flex-1 bg-black/60 px-4 pt-12">
          <View className="flex-1 overflow-hidden rounded-[28px] bg-background">
            <SafeAreaView edges={["top"]} className="px-4 pb-3 pt-2">
              <View className="flex-row items-center justify-between gap-3">
                <View className="flex-1">
                  <Text className="text-[22px] font-semibold text-foreground">
                    {expandedFacilityName}
                  </Text>
                  <Text className="text-[14px] text-muted-foreground">
                    Pełny ranking wspinaczy z filmami na tym obiekcie.
                  </Text>
                </View>
                <Pressable
                  onPress={() => setExpandedFacilityId(null)}
                  className="h-10 w-10 items-center justify-center rounded-full bg-muted"
                  accessibilityRole="button"
                  accessibilityLabel="Zamknij ranking obiektu"
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
              {isExpandedFacilityLoading ? (
                <View className="items-center gap-2 py-12">
                  <ActivityIndicator />
                  <Text className="text-sm text-muted-foreground">
                    Ładowanie rankingu obiektu...
                  </Text>
                </View>
              ) : expandedFacilityEntries.length === 0 ? (
                <Text className="text-center text-[14px] text-muted-foreground">
                  Brak wyników dla tego obiektu.
                </Text>
              ) : (
                <Leaderboard
                  title={expandedFacilityName}
                  description="Pełny ranking obiektu."
                  entries={expandedFacilityEntries}
                  mode="full"
                  showHeader={false}
                />
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
