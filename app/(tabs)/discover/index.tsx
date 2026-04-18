import {
  ChallengeColumn,
  ChallengeColumnSkeleton,
} from "@/components/discover/challenges/challenge-column";
import { FiltersDialog } from "@/components/discover/filters/filters-dialog";
import {
  DiscoverGymsCard,
  DiscoverGymsCardSkeleton,
} from "@/components/discover/gyms/discover-gyms-card";
import { HorizontalScrollSection } from "@/components/discover/horizontal-scroll-section";
import { DiscoverResultsSection } from "@/components/discover/results/discover-results-section";
import { RecommendedRoutesSection } from "@/components/discover/routes/recommended-routes-section";
import { SearchSection, type QuickFilterItem } from "@/components/discover/search-section";
import { cn } from "@/lib/utils";
import { useDebouncedValue } from "@/src/features/discover/hooks/useDebouncedValue";
import { useDiscoverChallenges } from "@/src/features/discover/hooks/useDiscoverChallenges";
import { useDiscoverFilters } from "@/src/features/discover/hooks/useDiscoverFilters";
import { useDiscoverGyms } from "@/src/features/discover/hooks/useDiscoverGyms";
import { useRecommendedRoutes } from "@/src/features/discover/hooks/useRecommendedRoutes";
import { chunkIntoColumns } from "@/src/features/discover/utils/challenges.utils";
import {
  getDiscoverResultsViewModel,
  type DiscoverResultSuggestion,
} from "@/src/features/discover/utils/discover-results.utils";
import type { Challenge, Gym } from "@/src/types/discover";
import { MAX_RADIUS_KM } from "@/src/types/discover-filters";
import { useRouter } from "expo-router";
import debounce from "lodash.debounce";
import { Building2, Dumbbell, MapPin, Route, Sparkles, Trophy } from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";

const CHALLENGES_PER_COLUMN = 2;

const QUICK_FILTERS = [
  { id: "nearby", label: "Blisko mnie", icon: MapPin },
  { id: "new", label: "Nowe", icon: Sparkles },
  { id: "gyms", label: "Ścianki", icon: Building2 },
  { id: "routes", label: "Trasy", icon: Route },
  { id: "challenges", label: "Wyzwania", icon: Trophy },
  { id: "bouldering", label: "Bouldering", icon: Dumbbell },
  { id: "rope", label: "Lina", icon: Route },
] satisfies readonly QuickFilterItem[];

export default function DiscoverScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 200);
  const [isFiltersDialogOpen, setIsFiltersDialogOpen] = useState(false);
  const { filters, actions, activeQuickFilterIds, activeFiltersCount } = useDiscoverFilters();
  const { data: featuredGyms = [], isLoading } = useDiscoverGyms();
  const { data: recommendedRoutes = [], isLoading: isRecommendedRoutesLoading } =
    useRecommendedRoutes();
  const { data: weeklyChallenges = [], isLoading: isLoadingChallenges } = useDiscoverChallenges();
  const challengeColumns = useMemo(
    () => chunkIntoColumns(weeklyChallenges, CHALLENGES_PER_COLUMN),
    [weeklyChallenges],
  );

  const deferredFilters = useDebouncedValue(filters, 150);

  const isFiltering = filters !== deferredFilters || searchQuery !== debouncedSearchQuery;

  const resultsViewModel = useMemo(
    () =>
      getDiscoverResultsViewModel({
        filters: deferredFilters,
        searchQuery: debouncedSearchQuery,
        gyms: featuredGyms,
        routes: recommendedRoutes,
        challenges: weeklyChallenges,
      }),
    [debouncedSearchQuery, featuredGyms, deferredFilters, recommendedRoutes, weeklyChallenges],
  );
  const isDiscoverLoading = isLoading || isRecommendedRoutesLoading || isLoadingChallenges;
  const shouldShowDiscoveryLayout = resultsViewModel.mode === "discovery" || isDiscoverLoading;
  const handleGymPress = useCallback(
    (gym: Gym) => {
      router.push({
        pathname: "/(tabs)/discover/gyms/[gymId]",
        params: { gymId: gym.id },
      });
    },
    [router],
  );
  const renderGymCard = useCallback(
    (gym: Gym) => <DiscoverGymsCard {...gym} onPress={() => handleGymPress(gym)} />,
    [handleGymPress],
  );
  const renderGymCardSkeleton = useCallback(() => <DiscoverGymsCardSkeleton />, []);
  const getGymKey = useCallback((gym: Gym) => gym.id, []);
  const renderChallengeColumn = useCallback(
    (column: Challenge[]) => <ChallengeColumn challenges={column} />,
    [],
  );
  const renderChallengeColumnSkeleton = useCallback(() => <ChallengeColumnSkeleton />, []);
  const getChallengeColumnKey = useCallback(
    (column: Challenge[], index: number) => column[0]?.id ?? `challenge-column-${index}`,
    [],
  );

  const handleResultSuggestionPress = useMemo(
    () =>
      debounce((suggestionId: DiscoverResultSuggestion["id"]) => {
        switch (suggestionId) {
          case "increase-radius":
            actions.setRadiusKm(MAX_RADIUS_KM);
            break;
          case "show-closed":
            actions.setOpenNow(false);
            break;
          case "clear-grade":
            actions.setGradeRange({ min: null, max: null });
            break;
          case "clear-all":
            actions.resetFilters();
            setSearchQuery("");
            break;
        }
      }, 50),
    [actions],
  );

  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="pb-40"
        stickyHeaderIndices={[0]}
      >
        <View className="z-10 bg-background px-4 pb-3 pt-4">
          <SearchSection
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            filters={QUICK_FILTERS}
            activeFilterIds={activeQuickFilterIds}
            onFilterToggle={actions.toggleQuickFilter}
            activeFiltersCount={activeFiltersCount}
            onFilterPress={() => setIsFiltersDialogOpen(true)}
          />
        </View>

        <View className={cn("gap-4 px-4 pt-1 relative min-h-[400px]", isFiltering && "opacity-60")}>
          <View pointerEvents={isFiltering ? "none" : "auto"} className="gap-4">
            {shouldShowDiscoveryLayout ? (
              <>
                <RecommendedRoutesSection
                  routes={recommendedRoutes}
                  isLoading={isRecommendedRoutesLoading}
                />

                <HorizontalScrollSection
                  title="Polecane ścianki"
                  description="Najciekawsze miejsca z nowymi setami"
                  items={featuredGyms}
                  isLoading={isLoading}
                  loadingItemsCount={3}
                  renderLoadingItem={renderGymCardSkeleton}
                  keyExtractor={getGymKey}
                  renderItem={renderGymCard}
                />

                <HorizontalScrollSection
                  title="Wyzwania"
                  description="Szybkie cele za dodatkowe XP"
                  items={challengeColumns}
                  isLoading={isLoadingChallenges}
                  loadingItemsCount={3}
                  renderLoadingItem={renderChallengeColumnSkeleton}
                  keyExtractor={getChallengeColumnKey}
                  renderItem={renderChallengeColumn}
                />
              </>
            ) : (
              <DiscoverResultsSection
                viewModel={resultsViewModel}
                onSuggestionPress={handleResultSuggestionPress}
                onGymPress={handleGymPress}
              />
            )}
          </View>
        </View>
      </ScrollView>

      {isFiltering && (
        <View
          pointerEvents="none"
          className="absolute inset-0 z-50 items-center justify-center bg-background/50"
        >
          <ActivityIndicator size="large" className="text-primary scale-150" />
        </View>
      )}

      <FiltersDialog
        open={isFiltersDialogOpen}
        onOpenChange={setIsFiltersDialogOpen}
        filters={filters}
        actions={actions}
      />
    </View>
  );
}
