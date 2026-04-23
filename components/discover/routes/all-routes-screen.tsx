import { AllRouteCard } from "@/components/discover/routes/all-route-card";
import { AllRoutesHeader } from "@/components/discover/routes/all-routes-header";
import {
  EmptyRoutesState,
  RoutesLoadingState,
} from "@/components/discover/routes/all-routes-states";
import { useDebouncedValue } from "@/src/features/discover/hooks/useDebouncedValue";
import { useRecommendedRoutes } from "@/src/features/discover/hooks/useRecommendedRoutes";
import {
  createRouteViewModel,
  getVisibleRoutes,
} from "@/src/features/discover/utils/all-routes.utils";
import type { SortId, UserRouteStatus } from "@/src/types/all-routes.types";
import { useCallback, useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function AllRoutesScreen() {
  const insets = useSafeAreaInsets();
  const { data: routes = [], isLoading } = useRecommendedRoutes();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 180);
  const [activeFilterIds, setActiveFilterIds] = useState<string[]>([]);
  const [sortId, setSortId] = useState<SortId | null>(null);
  const [personalStatuses, setPersonalStatuses] = useState<Record<string, UserRouteStatus>>({});

  const routeViewModels = useMemo(
    () =>
      routes.map((route, index) => createRouteViewModel(route, index, personalStatuses[route.id])),
    [personalStatuses, routes],
  );

  const visibleRoutes = useMemo(
    () =>
      getVisibleRoutes({
        routes: routeViewModels,
        searchQuery: debouncedSearchQuery,
        activeFilterIds,
        sortId,
      }),
    [activeFilterIds, debouncedSearchQuery, routeViewModels, sortId],
  );

  const hasActiveCriteria = debouncedSearchQuery.trim().length > 0 || activeFilterIds.length > 0;

  const handleFilterToggle = useCallback((filterId: string) => {
    setActiveFilterIds((currentFilterIds) =>
      currentFilterIds.includes(filterId)
        ? currentFilterIds.filter((currentFilterId) => currentFilterId !== filterId)
        : [...currentFilterIds, filterId],
    );
  }, []);

  const handleLogAscent = useCallback((routeId: string) => {
    setPersonalStatuses((currentStatuses) => ({
      ...currentStatuses,
      [routeId]: "top",
    }));
  }, []);

  const handleProjectToggle = useCallback((routeId: string, currentStatus: UserRouteStatus) => {
    setPersonalStatuses((currentStatuses) => ({
      ...currentStatuses,
      [routeId]: currentStatus === "project" ? "untouched" : "project",
    }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchQuery("");
    setActiveFilterIds([]);
    setSortId(null);
  }, []);

  if (isLoading) {
    return <RoutesLoadingState />;
  }

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={visibleRoutes}
        keyExtractor={(item) => item.route.id}
        className="flex-1"
        contentContainerClassName="gap-4 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <AllRoutesHeader
            totalRoutesCount={routeViewModels.length}
            visibleRoutesCount={visibleRoutes.length}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            activeFilterIds={activeFilterIds}
            onFilterToggle={handleFilterToggle}
            sortId={sortId}
            onSortChange={setSortId}
          />
        }
        ListEmptyComponent={
          <EmptyRoutesState hasActiveCriteria={hasActiveCriteria} onReset={handleResetFilters} />
        }
        renderItem={({ item }) => (
          <AllRouteCard
            routeViewModel={item}
            onLogAscent={handleLogAscent}
            onProjectToggle={handleProjectToggle}
          />
        )}
      />
    </View>
  );
}
