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
import { useDiscoverChallenges } from "@/src/features/discover/hooks/useDiscoverChallenges";
import { useDiscoverGyms } from "@/src/features/discover/hooks/useDiscoverGyms";
import { useDiscoverResultsFiltering } from "@/src/features/discover/hooks/useDiscoverFiltering";
import { useRecommendedRoutes } from "@/src/features/discover/hooks/useRecommendedRoutes";
import { chunkIntoColumns } from "@/src/features/discover/utils/challenges.utils";
import type { Challenge, Gym } from "@/src/types/discover";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Building2, Dumbbell, MapPin, Route, Sparkles, Trophy } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const { openSavedRoutes, requestId } = useLocalSearchParams<{
    openSavedRoutes?: string | string[];
    requestId?: string | string[];
  }>();
  const insets = useSafeAreaInsets();
  const handledSavedRoutesRequestRef = useRef<string | null>(null);
  const [isFiltersDialogOpen, setIsFiltersDialogOpen] = useState(false);
  const { data: featuredGyms = [], isLoading } = useDiscoverGyms();
  const { data: recommendedRoutes = [], isLoading: isRecommendedRoutesLoading } =
    useRecommendedRoutes();
  const { data: weeklyChallenges = [], isLoading: isLoadingChallenges } = useDiscoverChallenges();
  const {
    resultsViewModel,
    searchQuery,
    setSearchQuery,
    filters,
    actions,
    activeQuickFilterIds,
    activeFiltersCount,
    isFiltering,
    handleResultSuggestionPress,
  } = useDiscoverResultsFiltering({
    gyms: featuredGyms,
    routes: recommendedRoutes,
    challenges: weeklyChallenges,
  });
  const challengeColumns = useMemo(
    () => chunkIntoColumns(weeklyChallenges, CHALLENGES_PER_COLUMN),
    [weeklyChallenges],
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
  const handleAllGymsPress = useCallback(() => {
    router.push("/(tabs)/discover/gyms");
  }, [router]);
  const handleAllRoutesPress = useCallback(() => {
    router.push("/(tabs)/discover/routes");
  }, [router]);
  const handleAllChallengesPress = useCallback(() => {
    router.push("/(tabs)/discover/challenges");
  }, [router]);
  const handleRoutePress = useCallback(
    (routeId: string) => {
      router.push({
        pathname: "/(tabs)/discover/routes/[routeId]",
        params: { routeId },
      });
    },
    [router],
  );
  const handleChallengePress = useCallback(
    (challenge: Challenge) => {
      router.push({
        pathname: "/(tabs)/discover/challenges/[challengeId]",
        params: { challengeId: challenge.id },
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
    (column: Challenge[]) => (
      <ChallengeColumn challenges={column} onChallengePress={handleChallengePress} />
    ),
    [handleChallengePress],
  );
  const renderChallengeColumnSkeleton = useCallback(() => <ChallengeColumnSkeleton />, []);
  const getChallengeColumnKey = useCallback(
    (column: Challenge[], index: number) => column[0]?.id ?? `challenge-column-${index}`,
    [],
  );
  const savedRoutesRequestId = Array.isArray(requestId) ? requestId[0] : requestId;
  const shouldOpenSavedRoutes =
    (Array.isArray(openSavedRoutes) ? openSavedRoutes[0] : openSavedRoutes) === "1";

  useEffect(() => {
    if (
      !shouldOpenSavedRoutes ||
      !savedRoutesRequestId ||
      handledSavedRoutesRequestRef.current === savedRoutesRequestId
    ) {
      return;
    }

    handledSavedRoutesRequestRef.current = savedRoutesRequestId;
    router.push({
      pathname: "/(tabs)/discover/routes",
      params: { personalFilter: "project" },
    });
  }, [router, savedRoutesRequestId, shouldOpenSavedRoutes]);

  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 92, 116) }}
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
                  onActionPress={handleAllRoutesPress}
                  onRoutePress={(route) => handleRoutePress(route.id)}
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
                  actionLabel="Zobacz wszystkie"
                  onActionPress={handleAllGymsPress}
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
                  actionLabel="Wszystkie wyzwania"
                  trailingActionClassName="min-h-[318px]"
                  onActionPress={handleAllChallengesPress}
                />
              </>
            ) : (
              <DiscoverResultsSection
                viewModel={resultsViewModel}
                onSuggestionPress={handleResultSuggestionPress}
                onGymPress={handleGymPress}
                onChallengePress={handleChallengePress}
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
