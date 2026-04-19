import {
  DiscoverGymsCard,
  DiscoverGymsCardSkeleton,
} from "@/components/discover/gyms/discover-gyms-card";
import { HorizontalScrollSection } from "@/components/discover/horizontal-scroll-section";
import { SearchBar } from "@/components/discover/search-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useDiscoverGyms } from "@/src/features/discover/hooks/useDiscoverGyms";
import type { Gym } from "@/src/types/discover";
import { useRouter } from "expo-router";
import { ChevronRight, MapPin, SearchX, Star } from "lucide-react-native";
import { useCallback, useMemo, useRef, useState } from "react";
import { FlatList, ImageBackground, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LOADING_GYMS_COUNT = 4;

export default function DiscoverGymsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: gyms = [], isLoading } = useDiscoverGyms();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGyms = useMemo(() => getFilteredGyms(gyms, searchQuery), [gyms, searchQuery]);
  const featuredGym = filteredGyms[0] ?? null;
  const remainingGyms = featuredGym
    ? filteredGyms.filter((gym) => gym.id !== featuredGym.id)
    : filteredGyms;
  const openNowGyms = getSectionGyms(filteredGyms, featuredGym, (gym) => gym.isOpenNow);
  const freshSetGyms = getSectionGyms(filteredGyms, featuredGym, () => true).sort(
    (firstGym, secondGym) => secondGym.newRoutesCount - firstGym.newRoutesCount,
  );

  const lastPressTime = useRef<number>(0);

  const handleGymPress = useCallback(
    (gym: Gym) => {
      const now = Date.now();
      if (now - lastPressTime.current < 500) return;
      lastPressTime.current = now;

      router.push({
        pathname: "/(tabs)/discover/gyms/[gymId]",
        params: { gymId: gym.id },
      });
    },
    [router],
  );

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const renderGymCard = useCallback(
    (gym: Gym) => <DiscoverGymsCard {...gym} onPress={() => handleGymPress(gym)} />,
    [handleGymPress],
  );
  const getGymKey = useCallback((gym: Gym) => gym.id, []);
  const contentContainerStyle = { paddingBottom: Math.max(insets.bottom + 132, 164) };

  if (isLoading) {
    return (
      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="gap-3 px-4 pt-4"
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator={false}
      >
        {Array.from({ length: LOADING_GYMS_COUNT }, (_, index) => (
          <DiscoverGymsCardSkeleton key={`gym-skeleton-${index}`} className="w-full" />
        ))}
      </ScrollView>
    );
  }

  if (gyms.length === 0) {
    return (
      <View className="flex-1 items-center justify-center gap-2 bg-background px-6">
        <Text className="text-center text-[22px] font-bold leading-8 text-foreground">
          Brak ścianek
        </Text>
        <Text className="text-center text-[14px] leading-6 text-muted-foreground">
          Lista ścianek jest teraz pusta.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      className="flex-1 bg-background"
      contentContainerClassName="gap-4 px-4 pt-4"
      contentContainerStyle={contentContainerStyle}
      data={remainingGyms}
      keyExtractor={getGymKey}
      ListHeaderComponent={
        <GymsListHeader
          featuredGym={featuredGym}
          filteredCount={filteredGyms.length}
          freshSetGyms={freshSetGyms}
          openNowGyms={openNowGyms}
          remainingCount={remainingGyms.length}
          searchQuery={searchQuery}
          totalGymsCount={gyms.length}
          onClearSearch={handleClearSearch}
          onGymPress={handleGymPress}
          onSearchQueryChange={setSearchQuery}
          renderGymCard={renderGymCard}
          getGymKey={getGymKey}
        />
      }
      renderItem={({ item }) => (
        <DiscoverGymsCard
          {...item}
          containerClassName="w-full"
          onPress={() => handleGymPress(item)}
        />
      )}
      showsVerticalScrollIndicator={false}
    />
  );
}

function GymsListHeader({
  featuredGym,
  filteredCount,
  freshSetGyms,
  openNowGyms,
  remainingCount,
  searchQuery,
  totalGymsCount,
  onClearSearch,
  onGymPress,
  onSearchQueryChange,
  renderGymCard,
  getGymKey,
}: {
  featuredGym: Gym | null;
  filteredCount: number;
  freshSetGyms: readonly Gym[];
  openNowGyms: readonly Gym[];
  remainingCount: number;
  searchQuery: string;
  totalGymsCount: number;
  onClearSearch: () => void;
  onGymPress: (gym: Gym) => void;
  onSearchQueryChange: (query: string) => void;
  renderGymCard: (gym: Gym) => React.ReactNode;
  getGymKey: (gym: Gym) => string;
}) {
  return (
    <View className="gap-4">
      <View className="gap-3">
        <SearchBar
          value={searchQuery}
          onChangeText={onSearchQueryChange}
          placeholder="Szukaj po nazwie lub mieście"
        />
      </View>

      {featuredGym ? (
        <>
          <FeaturedGymCard gym={featuredGym} onPress={() => onGymPress(featuredGym)} />
          <GymStorySections
            freshSetGyms={freshSetGyms}
            getGymKey={getGymKey}
            openNowGyms={openNowGyms}
            renderGymCard={renderGymCard}
          />
          {remainingCount > 0 ? (
            <View className="flex-row items-center justify-between gap-3">
              <Text className="min-w-0 flex-1 text-[18px] font-semibold leading-6 text-foreground">
                Wszystkie dopasowane
              </Text>
              <Text className="text-[12px] font-bold leading-4 text-muted-foreground">
                {filteredCount}
              </Text>
            </View>
          ) : null}
        </>
      ) : (
        <NoGymResults searchQuery={searchQuery} onClearSearch={onClearSearch} />
      )}
    </View>
  );
}

function GymStorySections({
  freshSetGyms,
  getGymKey,
  openNowGyms,
  renderGymCard,
}: {
  freshSetGyms: readonly Gym[];
  getGymKey: (gym: Gym) => string;
  openNowGyms: readonly Gym[];
  renderGymCard: (gym: Gym) => React.ReactNode;
}) {
  return (
    <View className="gap-4">
      {openNowGyms.length > 0 ? (
        <HorizontalScrollSection
          title="Otwarte teraz"
          description="Dobre opcje, jeśli chcesz wejść bez kombinowania"
          items={openNowGyms}
          keyExtractor={getGymKey}
          renderItem={renderGymCard}
          showAction={false}
        />
      ) : null}

      {freshSetGyms.length > 0 ? (
        <HorizontalScrollSection
          title="Świeże sety"
          description="Miejsca z największą liczbą nowych tras"
          items={freshSetGyms}
          keyExtractor={getGymKey}
          renderItem={renderGymCard}
          showAction={false}
        />
      ) : null}
    </View>
  );
}

function FeaturedGymCard({ gym, onPress }: { gym: Gym; onPress: () => void }) {
  const reason = getFeaturedReason(gym);

  return (
    <Pressable onPress={onPress} className="active:opacity-95">
      <Card className="overflow-hidden rounded-[24px] border-border/70 bg-card px-0 py-0 gap-0 shadow-md">
        <ImageBackground
          source={{ uri: gym.imageUrl }}
          resizeMode="cover"
          imageStyle={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
          className="h-[250px]"
        >
          <View className="absolute inset-0 bg-black/40" />
          <View className="flex-1 justify-between p-5">
            <View className="flex-row items-start justify-between gap-3">
              <Badge variant="outline" className="border-transparent bg-white px-3 py-1.5">
                <Text className="text-[12px] font-bold text-black">Najlepsze dopasowanie</Text>
              </Badge>

              <View className="flex-row items-center gap-1.5 rounded-full bg-white px-3 py-1.5">
                <Icon as={Star} size={14} className="text-black" fill="currentColor" />
                <Text className="text-[13px] font-bold text-black">{gym.rating.toFixed(1)}</Text>
              </View>
            </View>

            <View className="gap-4">
              <View className="gap-1.5">
                <Text className="text-[32px] font-bold leading-9 text-white">{gym.name}</Text>
                <View className="flex-row items-center gap-1.5">
                  <Icon as={MapPin} size={16} className="text-white/90" strokeWidth={2.3} />
                  <Text className="text-[15px] font-semibold leading-5 text-white/90">
                    {gym.city} · {gym.distanceKm.toFixed(1)} km
                  </Text>
                </View>
              </View>

              <View className="flex-row flex-wrap gap-2">
                <FeaturedGymPill label={gym.isOpenNow ? "Otwarte teraz" : "Sprawdź godziny"} />
                <FeaturedGymPill label={`${gym.newRoutesCount} nowych tras`} />
                <FeaturedGymPill label={reason} />
              </View>
            </View>
          </View>
        </ImageBackground>

        <View className="flex-row items-center justify-between gap-4 px-5 py-4">
          <Text className="min-w-0 flex-1 text-[13.5px] leading-5 text-muted-foreground">
            {gym.description ?? "Sprawdź szczegóły ściany i zaplanuj sesję."}
          </Text>
          <View className="h-10 w-10 items-center justify-center rounded-full bg-muted">
            <Icon as={ChevronRight} size={18} className="text-foreground" strokeWidth={2.5} />
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

function FeaturedGymPill({ label }: { label: string }) {
  return (
    <View className="rounded-full bg-black/50 border border-white/20 px-3 py-1.5">
      <Text className="text-[12px] font-bold leading-4 text-white hover:text-white">{label}</Text>
    </View>
  );
}

function NoGymResults({
  searchQuery,
  onClearSearch,
}: {
  searchQuery: string;
  onClearSearch: () => void;
}) {
  return (
    <View className="items-center gap-4 rounded-xl border border-border/70 bg-card px-5 py-8">
      <View className="h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Icon as={SearchX} size={22} className="text-muted-foreground" strokeWidth={2.3} />
      </View>
      <View className="gap-1">
        <Text className="text-center text-[18px] font-bold leading-6 text-foreground">
          Brak dopasowań
        </Text>
        <Text className="text-center text-[13px] leading-5 text-muted-foreground">
          Nie znaleźliśmy ścianek dla „{searchQuery}”.
        </Text>
      </View>
      <Button
        variant="outline"
        className="h-11 rounded-xl border-border bg-card"
        onPress={onClearSearch}
      >
        <Text className="text-[13px] font-bold text-foreground">Wyczyść wyszukiwanie</Text>
      </Button>
    </View>
  );
}

function getFilteredGyms(gyms: readonly Gym[], searchQuery: string) {
  const normalizedSearchQuery = normalizeSearchValue(searchQuery);

  return gyms
    .filter((gym) => matchesSearchQuery(gym, normalizedSearchQuery))
    .sort((firstGym, secondGym) => getGymScore(secondGym) - getGymScore(firstGym));
}

function getSectionGyms(
  gyms: readonly Gym[],
  featuredGym: Gym | null,
  predicate: (gym: Gym) => boolean,
) {
  return gyms.filter((gym) => gym.id !== featuredGym?.id && predicate(gym)).slice(0, 6);
}

function matchesSearchQuery(gym: Gym, searchQuery: string) {
  if (!searchQuery) {
    return true;
  }

  return [gym.name, gym.city, gym.description, ...gym.tags]
    .filter(Boolean)
    .some((value) => normalizeSearchValue(value).includes(searchQuery));
}

function getGymScore(gym: Gym) {
  return (
    gym.rating * 8 +
    gym.newRoutesCount * 0.25 +
    (gym.isOpenNow ? 5 : 0) +
    (gym.hasChallenges ? 2 : 0) -
    gym.distanceKm * 0.35
  );
}

function getFeaturedReason(gym: Gym) {
  if (gym.hasChallenges) {
    return "Aktywne wyzwania";
  }

  if (gym.climbingTypes.includes("rope")) {
    return "Dobre na linę";
  }

  return "Mocny trening";
}

function normalizeSearchValue(value: string | undefined) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}
