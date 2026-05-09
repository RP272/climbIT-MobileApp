import { GymDetailsActions } from "@/components/discover/gyms/details/gym-details-actions";
import { GymDetailsHero } from "@/components/discover/gyms/details/gym-details-hero";
import {
  GymAmenitiesSection,
  GymChallengesSection,
  GymRoutesSection,
  GymVisitDetailsSection,
} from "@/components/discover/gyms/details/gym-details-sections";
import {
  GymDetailsLoadingState,
  GymNotFoundState,
} from "@/components/discover/gyms/details/gym-details-states";
import { useGymDetails } from "@/src/features/discover/hooks/useDiscoverGyms";
import { useGymRoutes } from "@/src/features/discover/hooks/useGymRoutes";
import type { Gym } from "@/src/types/discover";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useRef } from "react";
import { Linking, Platform, ScrollView, View, type LayoutChangeEvent } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function GymDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { gymId } = useLocalSearchParams<{ gymId?: string | string[] }>();
  const selectedGymId = getParamValue(gymId);
  const { data: gym, isLoading: isLoadingGym } = useGymDetails(selectedGymId);
  const { data: gymRoutes = [], isLoading: isLoadingRoutes } = useGymRoutes(selectedGymId);
  const scrollViewRef = useRef<ScrollView>(null);
  const routesSectionYRef = useRef(0);

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

  const handleRoutesSectionLayout = useCallback((event: LayoutChangeEvent) => {
    routesSectionYRef.current = event.nativeEvent.layout.y;
  }, []);

  const handleRoutesPress = useCallback(() => {
    scrollViewRef.current?.scrollTo({
      y: Math.max(routesSectionYRef.current - 12, 0),
      animated: true,
    });
  }, []);

  if (isLoadingGym) {
    return <GymDetailsLoadingState />;
  }

  if (!gym) {
    return <GymNotFoundState onBackPress={handleBackPress} onDiscoverPress={handleDiscoverPress} />;
  }

  return (
    <ScrollView
      ref={scrollViewRef}
      className="flex-1 bg-background"
      contentContainerClassName="gap-4 px-4 pt-4"
      contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 92, 116) }}
      showsVerticalScrollIndicator={false}
    >
      <GymDetailsHero gym={gym} />

      <GymDetailsActions
        gym={gym}
        onMapPress={handleOpenMapPress}
        onPhonePress={handlePhonePress}
        onRoutesPress={handleRoutesPress}
      />

      <GymVisitDetailsSection gym={gym} />
      <GymAmenitiesSection amenities={gym.amenities} />
      <GymChallengesSection gym={gym} />

      <View onLayout={handleRoutesSectionLayout}>
        <GymRoutesSection routes={gymRoutes} isLoading={isLoadingRoutes} gymId={gym.id} />
      </View>
    </ScrollView>
  );
}

function getParamValue(param: string | string[] | undefined) {
  return Array.isArray(param) ? param[0] : param;
}

function handleOpenMapPress(gym: Gym) {
  const destination = getMapDestination(gym);

  if (!destination) {
    return;
  }

  const encodedDestination = encodeURIComponent(destination);
  const url = Platform.select({
    ios: `maps:0,0?q=${encodedDestination}`,
    android: `geo:0,0?q=${encodedDestination}`,
    default: `https://www.google.com/maps/search/?api=1&query=${encodedDestination}`,
  });

  if (url) {
    void Linking.openURL(url).catch(() => undefined);
  }
}

function handlePhonePress(gym: Gym) {
  if (!gym.phone) {
    return;
  }

  void Linking.openURL(`tel:${gym.phone.replace(/\s/g, "")}`).catch(() => undefined);
}

function getMapDestination(gym: Gym) {
  if (gym.coordinates) {
    return `${gym.coordinates.latitude},${gym.coordinates.longitude}`;
  }

  return gym.address ?? null;
}
