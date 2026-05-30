import VideoReel from "@/components/watch/video-reel";
import {
  WatchEmptyState,
  WatchErrorState,
  WatchUnavailableState,
} from "@/components/watch/watch-states";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { isAuthError } from "@/src/api/is-auth-error";
import { useWatchReels } from "@/src/features/watch/hooks/useWatchReels";
import { Camera } from "lucide-react-native";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function WatchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const fabBottom = insets.bottom + 84;
  const { data: reels = [], isLoading, isError, error, refetch, isRefetching } = useWatchReels();

  const openCamera = () => router.navigate("/(tabs)/watch/camera");

  const renderContent = () => {
    if (isLoading) {
      return (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#fff" size="large" />
          <Text className="mt-3 text-sm text-white/60">Ładowanie klipów…</Text>
        </View>
      );
    }

    if (isError && isAuthError(error)) {
      return <WatchUnavailableState />;
    }

    if (isError) {
      return <WatchErrorState onRetry={() => void refetch()} />;
    }

    if (reels.length === 0) {
      return <WatchEmptyState onRecordPress={openCamera} />;
    }

    return (
      <ScrollView
        pagingEnabled
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        className="w-screen flex-1"
      >
        {reels.map((reel) => (
          <VideoReel key={reel.id} {...reel} />
        ))}
      </ScrollView>
    );
  };

  return (
    <View className="relative flex-1 bg-black">
      {renderContent()}

      {isRefetching && !isLoading ? (
        <View className="absolute left-0 right-0 top-14 items-center">
          <ActivityIndicator color="#fff" size="small" />
        </View>
      ) : null}

      <View
        pointerEvents="box-none"
        className="absolute right-5 z-10 items-center gap-1"
        style={{ bottom: fabBottom }}
      >
        <View className="rounded-full border border-white/25 bg-white/10 p-1.5 shadow-xl shadow-black/45">
          <Button
            variant="default"
            size="icon"
            className="h-14 w-14 rounded-full border-2 border-white/85 shadow-lg shadow-black/35 active:opacity-90"
            onPress={openCamera}
          >
            <Icon as={Camera} size={26} className="text-primary-foreground" strokeWidth={2.2} />
          </Button>
        </View>
        <Text className="text-center text-[10px] font-semibold uppercase tracking-wider text-white/85">
          Nagraj
        </Text>
      </View>
    </View>
  );
}
