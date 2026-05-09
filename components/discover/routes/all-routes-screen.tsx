import { FiltersDialog } from "@/components/discover/filters/filters-dialog";
import { AllRouteCard } from "@/components/discover/routes/all-route-card";
import { AllRoutesHeader } from "@/components/discover/routes/all-routes-header";
import {
  EmptyRoutesState,
  RoutesLoadingState,
} from "@/components/discover/routes/all-routes-states";
import { useRoutesFiltering } from "@/src/features/discover/hooks/useDiscoverFiltering";
import { useRecommendedRoutes } from "@/src/features/discover/hooks/useRecommendedRoutes";
import type { RecommendedRoute } from "@/src/types/discover";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type AllRoutesScreenProps = {
  title?: string;
  stickyFilters?: boolean;
};

export function AllRoutesScreen(props: AllRoutesScreenProps = {}) {
  const { data: routes = [], isLoading } = useRecommendedRoutes();

  return (
    <RoutesListScreen
      routes={routes}
      isLoading={isLoading}
      title={props.title}
      stickyFilters={props.stickyFilters}
    />
  );
}

type RoutesListScreenProps = {
  routes: readonly RecommendedRoute[];
  isLoading: boolean;
  title?: string;
  stickyFilters?: boolean;
};

export function RoutesListScreen({
  routes,
  isLoading,
  title,
  stickyFilters = false,
}: RoutesListScreenProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isFiltersDialogOpen, setIsFiltersDialogOpen] = useState(false);
  const {
    visibleItems: visibleRoutes,
    routeViewModels,
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
    handleLogAscent,
    handleProjectToggle,
    resetView,
  } = useRoutesFiltering(routes);

  const handleRoutePress = useCallback(
    (routeId: string) => {
      router.push({
        pathname: "/(tabs)/discover/routes/[routeId]",
        params: { routeId },
      });
    },
    [router],
  );

  if (isLoading) {
    return <RoutesLoadingState />;
  }

  const filtersHeader = (
    <AllRoutesHeader
      title={title}
      totalRoutesCount={routeViewModels.length}
      visibleRoutesCount={visibleRoutes.length}
      searchQuery={searchQuery}
      onSearchQueryChange={setSearchQuery}
      activeFilterIds={activeQuickFilterIds}
      onFilterToggle={handleQuickFilterToggle}
      sortId={sortId}
      activeFiltersCount={activeFiltersCount}
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
        data={visibleRoutes}
        keyExtractor={(item) => item.route.id}
        className="flex-1"
        contentContainerClassName="gap-4 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 92, 116), flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={stickyFilters ? null : filtersHeader}
        ListEmptyComponent={
          <EmptyRoutesState hasActiveCriteria={hasActiveCriteria} onReset={resetView} />
        }
        renderItem={({ item }) => (
          <AllRouteCard
            routeViewModel={item}
            onLogAscent={handleLogAscent}
            onProjectToggle={handleProjectToggle}
            onPress={() => handleRoutePress(item.route.id)}
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
