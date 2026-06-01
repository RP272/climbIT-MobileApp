import { HomeReelCard } from "@/components/home/home-reel-card";
import { HorizontalScrollSection } from "@/components/discover/horizontal-scroll-section";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import type { HomeReelPreview } from "@/src/types/home";
import { useCallback } from "react";
import { View } from "react-native";

type HomeUserReelsSectionProps = {
  reels: HomeReelPreview[];
  isLoading: boolean;
  onReelPress: (reel: HomeReelPreview) => void;
  onRecordPress: () => void;
  onViewAllPress: () => void;
};

function HomeReelCardSkeleton() {
  return <View className="mr-3 h-[268px] w-[156px] rounded-2xl bg-muted" />;
}

export function HomeUserReelsSection({
  reels,
  isLoading,
  onReelPress,
  onRecordPress,
  onViewAllPress,
}: HomeUserReelsSectionProps) {
  const renderItem = useCallback(
    (reel: HomeReelPreview) => <HomeReelCard reel={reel} onPress={() => onReelPress(reel)} />,
    [onReelPress],
  );

  if (!isLoading && reels.length === 0) {
    return (
      <View className="gap-3 rounded-[28px] border border-dashed border-border bg-card/60 p-5">
        <Text className="text-base font-bold text-foreground">Twoje reelsy</Text>
        <Text className="text-sm leading-5 text-muted-foreground">
          Nie masz jeszcze opublikowanych przejść. Nagraj pierwszy klip i pokaż go społeczności.
        </Text>
        <Button onPress={onRecordPress} className="mt-1 self-start">
          <Text className="font-semibold text-primary-foreground">Nagraj pierwszy klip</Text>
        </Button>
      </View>
    );
  }

  return (
    <HorizontalScrollSection
      title="Twoje ostatnie reelsy"
      description="Przejścia z Twojego konta"
      items={reels}
      isLoading={isLoading}
      loadingItemsCount={3}
      renderLoadingItem={() => <HomeReelCardSkeleton />}
      keyExtractor={(reel) => reel.id}
      renderItem={renderItem}
      actionLabel="Zobacz wszystkie"
      onActionPress={onViewAllPress}
    />
  );
}
