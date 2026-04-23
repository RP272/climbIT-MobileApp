import { AllGymsHeader } from "@/components/discover/gyms/all-gyms-header";
import {
  AllGymsLoadingState,
  NoGymsResults,
  NoGymsState,
} from "@/components/discover/gyms/all-gyms-states";
import type { GymSortId } from "@/components/discover/gyms/all-gyms.types";
import { getVisibleGyms } from "@/components/discover/gyms/all-gyms.utils";
import { DiscoverGymsCard } from "@/components/discover/gyms/discover-gyms-card";
import { useDebouncedValue } from "@/src/features/discover/hooks/useDebouncedValue";
import { useDiscoverGyms } from "@/src/features/discover/hooks/useDiscoverGyms";
import type { Gym } from "@/src/types/discover";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function AllGymsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: gyms = [], isLoading } = useDiscoverGyms();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 180);
  const [activeFilterIds, setActiveFilterIds] = useState<string[]>([]);
  const [sortId, setSortId] = useState<GymSortId | null>(null);
  const lastPressTime = useRef<number>(0);

  const visibleGyms = useMemo(
    () =>
      getVisibleGyms({
        gyms,
        searchQuery: debouncedSearchQuery,
        activeFilterIds,
        sortId,
      }),
    [activeFilterIds, debouncedSearchQuery, gyms, sortId],
  );
  const hasActiveCriteria = debouncedSearchQuery.trim().length > 0 || activeFilterIds.length > 0;

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

  const handleFilterToggle = useCallback((filterId: string) => {
    setActiveFilterIds((currentFilterIds) =>
      currentFilterIds.includes(filterId)
        ? currentFilterIds.filter((currentFilterId) => currentFilterId !== filterId)
        : [...currentFilterIds, filterId],
    );
  }, []);

  const handleResetView = useCallback(() => {
    setSearchQuery("");
    setActiveFilterIds([]);
    setSortId(null);
  }, []);

  if (isLoading) {
    return <AllGymsLoadingState />;
  }

  if (gyms.length === 0) {
    return <NoGymsState />;
  }

  return (
    <FlatList
      className="flex-1 bg-background"
      contentContainerClassName="gap-4 px-4 pt-4"
      contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 132, 164), flexGrow: 1 }}
      data={visibleGyms}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <AllGymsHeader
          visibleGymsCount={visibleGyms.length}
          totalGymsCount={gyms.length}
          searchQuery={searchQuery}
          activeFilterIds={activeFilterIds}
          sortId={sortId}
          onSearchQueryChange={setSearchQuery}
          onFilterToggle={handleFilterToggle}
          onSortChange={setSortId}
        />
      }
      ListEmptyComponent={
        visibleGyms.length === 0 ? (
          <NoGymsResults hasActiveCriteria={hasActiveCriteria} onReset={handleResetView} />
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
  );
}
