import { RouteDetailsActions } from "@/components/discover/routes/details/route-details-actions";
import { RouteDetailsHero } from "@/components/discover/routes/details/route-details-hero";
import {
  RouteBetaSection,
  RouteGymChallengesSection,
  RouteMoreRoutesSection,
  RouteOverviewSection,
} from "@/components/discover/routes/details/route-details-sections";
import {
  RouteDetailsLoadingState,
  RouteNotFoundState,
} from "@/components/discover/routes/details/route-details-states";
import { useGymDetails } from "@/src/features/discover/hooks/useDiscoverGyms";
import { useGymChallenges } from "@/src/features/discover/hooks/useGymChallenges";
import { useGymRoutes } from "@/src/features/discover/hooks/useGymRoutes";
import { useRecommendedRoutes } from "@/src/features/discover/hooks/useRecommendedRoutes";
import { createRouteViewModel } from "@/src/features/discover/utils/all-routes.utils";
import type { UserRouteStatus } from "@/src/types/all-routes.types";
import type { RecommendedRoute } from "@/src/types/discover";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RouteDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { routeId } = useLocalSearchParams<{ routeId?: string | string[] }>();
  const selectedRouteId = getParamValue(routeId);
  const { data: routes = [], isLoading: isLoadingRoutes } = useRecommendedRoutes();
  const [personalStatuses, setPersonalStatuses] = useState<Record<string, UserRouteStatus>>({});
  const scrollViewRef = useRef<ScrollView>(null);

  const routeIndex = useMemo(
    () => routes.findIndex((route) => route.id === selectedRouteId),
    [routes, selectedRouteId],
  );
  const route = routeIndex >= 0 ? routes[routeIndex] : null;
  const routeViewModel = useMemo(
    () =>
      route && routeIndex >= 0
        ? createRouteViewModel(route, routeIndex, personalStatuses[route.id])
        : null,
    [personalStatuses, route, routeIndex],
  );
  const { data: gym, isLoading: isLoadingGym } = useGymDetails(route?.gymId);
  const { data: gymChallenges = [], isLoading: isLoadingChallenges } = useGymChallenges(
    route?.gymId,
  );
  const { data: gymRoutes = [], isLoading: isLoadingGymRoutes } = useGymRoutes(route?.gymId);

  const handleBackPress = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/(tabs)/discover");
  }, [router]);

  const handleDiscoverPress = useCallback(() => {
    router.replace("/(tabs)/discover");
  }, [router]);

  const handleLogAscent = useCallback((targetRouteId: string) => {
    setPersonalStatuses((currentStatuses) => ({
      ...currentStatuses,
      [targetRouteId]: "top",
    }));
  }, []);

  const handleProjectToggle = useCallback(
    (targetRouteId: string, currentStatus: UserRouteStatus) => {
      setPersonalStatuses((currentStatuses) => ({
        ...currentStatuses,
        [targetRouteId]: currentStatus === "project" ? "untouched" : "project",
      }));
    },
    [],
  );

  const handleGymPress = useCallback(() => {
    if (!route?.gymId) {
      return;
    }

    router.push(`/(tabs)/discover/gyms/${route.gymId}`);
  }, [route?.gymId, router]);

  const handleAllGymRoutesPress = useCallback(() => {
    if (!route?.gymId) {
      return;
    }

    router.push(`/(tabs)/discover/gyms/${route.gymId}/routes`);
  }, [route?.gymId, router]);

  const handleAllGymChallengesPress = useCallback(() => {
    if (!route?.gymId) {
      return;
    }

    router.push(`/(tabs)/discover/gyms/${route.gymId}/challenges`);
  }, [route?.gymId, router]);

  const handleRelatedRoutePress = useCallback(
    (recommendedRoute: RecommendedRoute) => {
      router.push({
        pathname: "/(tabs)/discover/routes/[routeId]",
        params: { routeId: recommendedRoute.id },
      });
    },
    [router],
  );

  if (isLoadingRoutes || (route && isLoadingGym)) {
    return <RouteDetailsLoadingState />;
  }

  if (!route || !routeViewModel) {
    return (
      <RouteNotFoundState onBackPress={handleBackPress} onDiscoverPress={handleDiscoverPress} />
    );
  }

  return (
    <ScrollView
      ref={scrollViewRef}
      className="flex-1 bg-background"
      contentContainerClassName="gap-4 px-4 pt-4"
      contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 92, 116) }}
      showsVerticalScrollIndicator={false}
    >
      <RouteDetailsHero routeViewModel={routeViewModel} gym={gym} />

      <RouteDetailsActions
        routeViewModel={routeViewModel}
        onLogAscent={handleLogAscent}
        onProjectToggle={handleProjectToggle}
        onGymPress={handleGymPress}
      />

      <RouteOverviewSection routeViewModel={routeViewModel} />
      <RouteBetaSection
        routeViewModel={routeViewModel}
        onActionPress={() => console.log("Zobacz liste beta społeczności")}
      />
      <RouteGymChallengesSection
        routeViewModel={routeViewModel}
        challenges={gymChallenges}
        isLoading={isLoadingChallenges}
        onActionPress={handleAllGymChallengesPress}
      />
      <RouteMoreRoutesSection
        routes={gymRoutes}
        currentRouteId={route.id}
        isLoading={isLoadingGymRoutes}
        onRoutePress={handleRelatedRoutePress}
        onActionPress={handleAllGymRoutesPress}
      />
    </ScrollView>
  );
}

function getParamValue(param: string | string[] | undefined) {
  return Array.isArray(param) ? param[0] : param;
}
