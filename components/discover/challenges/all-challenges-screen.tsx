import { ChallengeCard } from "@/components/discover/challenges/challenge-card";
import { AllChallengesHeader } from "@/components/discover/challenges/all-challenges-header";
import {
  ChallengesLoadingState,
  EmptyChallengesState,
} from "@/components/discover/challenges/all-challenges-states";
import { FiltersDialog } from "@/components/discover/filters/filters-dialog";
import { useDiscoverChallenges } from "@/src/features/discover/hooks/useDiscoverChallenges";
import { useChallengesFiltering } from "@/src/features/discover/hooks/useDiscoverFiltering";
import { useQueryRefresh } from "@/src/query/use-query-refresh";
import type { Challenge } from "@/src/types/discover";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function AllChallengesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: challenges = [], isLoading, refetch } = useDiscoverChallenges();
  const refresh = useQueryRefresh([{ refetch }]);
  const [isFiltersDialogOpen, setIsFiltersDialogOpen] = useState(false);
  const {
    visibleItems: visibleChallenges,
    searchQuery,
    setSearchQuery,
    filters,
    actions,
    activeQuickFilterIds,
    activeFiltersCount,
    sortId,
    setSortId,
    hasActiveCriteria,
    handleQuickFilterToggle,
    resetView,
  } = useChallengesFiltering(challenges);

  const handleChallengePress = useCallback(
    (challenge: Challenge) => {
      router.push({
        pathname: "/(tabs)/discover/challenges/[challengeId]",
        params: { challengeId: challenge.id },
      });
    },
    [router],
  );

  if (isLoading) {
    return <ChallengesLoadingState />;
  }

  const filtersHeader = (
    <AllChallengesHeader
      totalChallengesCount={challenges.length}
      visibleChallengesCount={visibleChallenges.length}
      searchQuery={searchQuery}
      activeFilterIds={activeQuickFilterIds}
      sortId={sortId}
      activeFiltersCount={activeFiltersCount}
      onSearchQueryChange={setSearchQuery}
      onFilterToggle={handleQuickFilterToggle}
      onAdvancedFiltersPress={() => setIsFiltersDialogOpen(true)}
      onSortChange={setSortId}
    />
  );

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={visibleChallenges}
        keyExtractor={(item) => item.id}
        className="flex-1"
        contentContainerClassName="gap-4 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 92, 116), flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refresh.refreshing} onRefresh={refresh.onRefresh} />
        }
        ListHeaderComponent={filtersHeader}
        ListEmptyComponent={
          <EmptyChallengesState hasActiveCriteria={hasActiveCriteria} onReset={resetView} />
        }
        renderItem={({ item }) => (
          <ChallengeCard
            challenge={item}
            containerClassName="w-full"
            onPress={() => handleChallengePress(item)}
          />
        )}
      />

      <FiltersDialog
        open={isFiltersDialogOpen}
        onOpenChange={setIsFiltersDialogOpen}
        filters={filters}
        actions={actions}
      />
    </View>
  );
}
