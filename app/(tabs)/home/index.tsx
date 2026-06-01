import { HomeBrandTitle } from "@/components/home/home-brand-title";
import { HomeHeader } from "@/components/home/home-header";
import { HomeQuickActions } from "@/components/home/home-quick-actions";
import { HomeUserReelsSection } from "@/components/home/home-user-reels-section";
import { Text } from "@/components/ui/text";
import { useHomeUserReels } from "@/src/features/home/hooks/useHomeUserReels";
import { useProfileDetailsQuery } from "@/src/query/profile.query";
import type { HomeReelPreview } from "@/src/types/home";
import { useRouter } from "expo-router";
import { ActivityIndicator, RefreshControl, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    data: profileDetails,
    isLoading: isProfileLoading,
    refetch: refetchProfile,
  } = useProfileDetailsQuery();
  const {
    data: userReels = [],
    isLoading: isReelsLoading,
    refetch: refetchReels,
    isRefetching,
  } = useHomeUserReels();

  const profile = profileDetails?.climber;
  const isLoading = isProfileLoading || isReelsLoading;

  function handleRefresh() {
    void Promise.all([refetchProfile(), refetchReels()]);
  }

  function handleProfilePress() {
    router.push("/(tabs)/profile");
  }

  function handleRecordPress() {
    router.push("/(tabs)/watch/camera");
  }

  function handleWatchPress() {
    router.push("/(tabs)/watch");
  }

  function handleRankingPress() {
    router.push("/(tabs)/ranking");
  }

  function handleDiscoverPress() {
    router.push("/(tabs)/discover");
  }

  function handleReelPress(reel: HomeReelPreview) {
    router.push("/(tabs)/watch");
  }

  function handleViewAllReelsPress() {
    router.push("/(tabs)/watch");
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{
        paddingTop: insets.top + 12,
        paddingBottom: Math.max(insets.bottom + 96, 124),
      }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} tintColor="#888" />
      }
    >
      <View className="gap-5 px-4">
        <HomeBrandTitle />

        {isProfileLoading && !profile ? (
          <View className="h-[148px] items-center justify-center rounded-[28px] border border-border bg-card">
            <ActivityIndicator />
          </View>
        ) : (
          <HomeHeader
            profile={profile}
            facility={profileDetails?.favouriteFacility}
            onPress={handleProfilePress}
          />
        )}

        <HomeQuickActions
          onRecordPress={handleRecordPress}
          onWatchPress={handleWatchPress}
          onRankingPress={handleRankingPress}
          onDiscoverPress={handleDiscoverPress}
        />

        <HomeUserReelsSection
          reels={userReels}
          isLoading={isReelsLoading}
          onReelPress={handleReelPress}
          onRecordPress={handleRecordPress}
          onViewAllPress={handleViewAllReelsPress}
        />

        {isLoading ? (
          <View className="items-center py-2">
            <Text className="text-xs text-muted-foreground">Ładowanie pulpitu…</Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}
