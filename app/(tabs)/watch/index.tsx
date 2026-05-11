import VideoReel from "@/components/watch/video-reel";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { WATCH_REELS } from "@/src/data/watch-reels";
import { Camera } from "lucide-react-native";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function WatchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const fabBottom = insets.bottom + 84;

  return (
    <View className="relative flex-1 bg-black">
      <ScrollView
        pagingEnabled
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        className="w-screen flex-1"
      >
        {WATCH_REELS.map((reel) => (
          <VideoReel key={reel.id} {...reel} />
        ))}
      </ScrollView>

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
            onPress={() => router.navigate("(tabs)/watch/camera")}
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
