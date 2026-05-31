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
import {
  useRecommendedRoutes,
  useRouteSetterDetails,
} from "@/src/features/discover/hooks/useRecommendedRoutes";
import {
  useSavedRouteIdsQuery,
  useSavedRouteMutation,
} from "@/src/features/discover/hooks/useSavedRouteActions";
import { createRouteViewModel } from "@/src/features/discover/utils/all-routes.utils";
import { useQueryRefresh } from "@/src/query/use-query-refresh";
import type { UserRouteStatus } from "@/src/types/all-routes.types";
import type { RecommendedRoute } from "@/src/types/discover";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { RefreshControl, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RouteDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { routeId } = useLocalSearchParams<{ routeId?: string | string[] }>();
  const selectedRouteId = getParamValue(routeId);
  const { data: routes = [], isLoading: isLoadingRoutes } = useRecommendedRoutes();
  const [personalStatuses, setPersonalStatuses] = useState<Record<string, UserRouteStatus>>({});
  const { data: savedRouteIds = [] } = useSavedRouteIdsQuery();
  const savedRouteIdsSet = useMemo(() => new Set(savedRouteIds), [savedRouteIds]);
  const { mutate: mutateSavedRoute } = useSavedRouteMutation({
    onError: ({ routeId: failedRouteId }) => {
      setPersonalStatuses(({ [failedRouteId]: _failedStatus, ...currentStatuses }) => {
        return currentStatuses;
      });
    },
  });
  const scrollViewRef = useRef<ScrollView>(null);
  const refresh = useQueryRefresh();

  const routeIndex = useMemo(
    () => routes.findIndex((route) => route.id === selectedRouteId),
    [routes, selectedRouteId],
  );
  const route = routeIndex >= 0 ? routes[routeIndex] : null;
  const { data: routeSetter } = useRouteSetterDetails(route?.routeSetterId);
  const routeSetterName = useMemo(() => formatRouteSetterName(routeSetter), [routeSetter]);
  const routeViewModel = useMemo(
    () =>
      route && routeIndex >= 0
        ? createRouteViewModel(
            route,
            routeIndex,
            personalStatuses[route.id] ?? (savedRouteIdsSet.has(route.id) ? "project" : undefined),
            routeSetterName,
          )
        : null,
    [personalStatuses, route, routeIndex, routeSetterName, savedRouteIdsSet],
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
      const shouldSave = currentStatus !== "project";

      setPersonalStatuses((currentStatuses) => ({
        ...currentStatuses,
        [targetRouteId]: shouldSave ? "project" : "untouched",
      }));
      mutateSavedRoute({ routeId: targetRouteId, shouldSave });
    },
    [mutateSavedRoute],
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

  const handleChallengePress = useCallback(
    (challengeId: string) => {
      router.push({
        pathname: "/(tabs)/discover/challenges/[challengeId]" as any,
        params: { challengeId },
      });
    },
    [router],
  );

  const handleRelatedRoutePress = useCallback(
    (recommendedRoute: RecommendedRoute) => {
      router.push({
        pathname: "/(tabs)/discover/routes/[routeId]" as any,
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
      refreshControl={
        <RefreshControl refreshing={refresh.refreshing} onRefresh={refresh.onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      <RouteDetailsHero routeViewModel={routeViewModel} gym={gym} />

      <RouteDetailsActions
        routeViewModel={routeViewModel}
        onLogAscent={handleLogAscent}
        onProjectToggle={handleProjectToggle}
        onGymPress={handleGymPress}
      />

      <RouteOverviewSection routeViewModel={routeViewModel} routeSetter={routeSetter} />
      <RouteBetaSection
        routeViewModel={routeViewModel}
        onActionPress={() => console.log("Zobacz liste beta społeczności")}
      />
      <RouteGymChallengesSection
        routeViewModel={routeViewModel}
        challenges={gymChallenges}
        isLoading={isLoadingChallenges}
        onActionPress={handleAllGymChallengesPress}
        onChallengePress={(challenge) => handleChallengePress(challenge.id)}
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

function formatRouteSetterName(
  routeSetter:
    | {
        firstName?: string;
        lastName?: string;
      }
    | null
    | undefined,
) {
  const name = [routeSetter?.firstName, routeSetter?.lastName].filter(Boolean).join(" ").trim();

  return name || undefined;
}
