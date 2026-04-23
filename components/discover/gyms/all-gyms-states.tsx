import { DiscoverGymsCardSkeleton } from "@/components/discover/gyms/discover-gyms-card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { SearchX } from "lucide-react-native";
import { ScrollView, View } from "react-native";

const LOADING_GYMS_COUNT = 4;

export function NoGymsState() {
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

export function NoGymsResults({
  hasActiveCriteria,
  onReset,
}: {
  hasActiveCriteria: boolean;
  onReset: () => void;
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
          {hasActiveCriteria
            ? "Zmień wyszukiwanie albo aktywne filtry."
            : "Nie znaleźliśmy ścianek dla tego widoku."}
        </Text>
      </View>
      {hasActiveCriteria ? (
        <Button
          variant="outline"
          className="h-11 rounded-xl border-border bg-card"
          onPress={onReset}
        >
          <Text className="text-[13px] font-bold text-foreground">Wyczyść widok</Text>
        </Button>
      ) : null}
    </View>
  );
}

export function AllGymsLoadingState() {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="gap-4 px-4 pt-4"
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-2">
        <Skeleton className="h-8 w-52 rounded-lg" />
        <Skeleton className="h-5 w-64 rounded-lg" />
      </View>
      <Skeleton className="h-[320px] w-full rounded-[24px]" />
      <Skeleton className="h-12 w-full rounded-xl" />
      <View className="flex-row gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-24 rounded-lg" />
        ))}
      </View>
      {Array.from({ length: LOADING_GYMS_COUNT }, (_, index) => (
        <DiscoverGymsCardSkeleton
          key={`gym-skeleton-${index}`}
          variant="detailed"
          className="w-full"
        />
      ))}
    </ScrollView>
  );
}
