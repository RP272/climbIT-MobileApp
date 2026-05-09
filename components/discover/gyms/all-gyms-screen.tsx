import { FiltersDialog } from "@/components/discover/filters/filters-dialog";
import { AllGymsHeader } from "@/components/discover/gyms/all-gyms-header";
import {
  AllGymsLoadingState,
  NoGymsResults,
  NoGymsState,
} from "@/components/discover/gyms/all-gyms-states";
import { DiscoverGymsCard } from "@/components/discover/gyms/discover-gyms-card";
import { useGymsFiltering } from "@/src/features/discover/hooks/useDiscoverFiltering";
import { useDiscoverGyms } from "@/src/features/discover/hooks/useDiscoverGyms";
import type { Gym } from "@/src/types/discover";
import { useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type AllGymsScreenProps = {
  stickyFilters?: boolean;
};

export function AllGymsScreen({ stickyFilters = false }: AllGymsScreenProps = {}) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: gyms = [], isLoading } = useDiscoverGyms();
  const [isFiltersDialogOpen, setIsFiltersDialogOpen] = useState(false);
  const lastPressTime = useRef<number>(0);
  const {
    visibleItems: visibleGyms,
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
  } = useGymsFiltering(gyms);

  const handleGymPress = useCallback(
    (gym: Gym) => {
      const now = Date.now();
      if (now - lastPressTime.current < 500) {
        return;
      }

      lastPressTime.current = now;

      router.push({
        pathname: "/(tabs)/discover/gyms/[gymId]",
        params: { gymId: gym.id },
      });
    },
    [router],
  );

  if (isLoading) {
    return <AllGymsLoadingState />;
  }

  if (gyms.length === 0) {
    return <NoGymsState />;
  }

  const filtersHeader = (
    <AllGymsHeader
      visibleGymsCount={visibleGyms.length}
      totalGymsCount={gyms.length}
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
      {stickyFilters ? (
        <View className="z-10 gap-4 bg-background px-4 pb-3 pt-4">{filtersHeader}</View>
      ) : null}

      <FlatList
        className="flex-1"
        contentContainerClassName="gap-4 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 92, 116), flexGrow: 1 }}
        data={visibleGyms}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={stickyFilters ? null : filtersHeader}
        ListEmptyComponent={
          visibleGyms.length === 0 ? (
            <NoGymsResults hasActiveCriteria={hasActiveCriteria} onReset={resetView} />
          ) : null
        }
        renderItem={({ item }) => (
          <DiscoverGymsCard
            {...item}
            variant="detailed"
            containerClassName="w-full"
            onPress={() => handleGymPress(item)}
          />
        )}
        showsVerticalScrollIndicator={false}
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
