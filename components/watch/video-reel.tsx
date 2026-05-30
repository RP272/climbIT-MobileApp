import type { WatchReel } from "@/src/types/watch";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { BlurView } from "expo-blur";
import { useVideoPlayer, VideoView } from "expo-video";
import { MapPin, Mountain, Music, ThumbsDown, ThumbsUp, Eye } from "lucide-react-native";
import { View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function VideoReel(props: WatchReel) {
  const { height, width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const bottomOverlayPad = Math.max(insets.bottom, 8) + 92;
  const topChromeOffset = insets.top + 10;
  const {
    videoSource,
    title,
    routeName,
    place,
    authorName,
    authorHandle,
    viewsLabel,
    likesLabel,
    dislikesLabel,
    musicTrack,
    musicArtist,
  } = props;

  const player = useVideoPlayer(videoSource, (p) => {
    p.loop = true;
    p.play();
  });

  const initials = authorName
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <View style={{ height, width }} className="relative overflow-hidden bg-black">
      <VideoView
        contentFit="cover"
        nativeControls={false}
        player={player}
        style={{ width: "100%", height: "100%" }}
      />

      <View pointerEvents="none" className="absolute inset-0 bg-black/10" />

      <View
        className="absolute left-4 flex-row items-center gap-2 rounded-full bg-black/35 px-3 py-1.5"
        style={{ top: topChromeOffset }}
      >
        <Icon as={Eye} size={14} className="text-white" strokeWidth={2.5} />
        <Text className="text-xs font-semibold tabular-nums text-white">{viewsLabel}</Text>
        <Text className="text-[11px] text-white/75">wyświetleń</Text>
      </View>

      <View
        pointerEvents="box-none"
        className="absolute inset-x-0 bottom-0 flex-row justify-between gap-3 px-3 pt-8"
        style={{ paddingBottom: bottomOverlayPad }}
      >
        <View className="min-w-0 max-w-[74%] flex-1 justify-end gap-2 pb-1">
          <View className="flex-row items-center gap-2">
            <View className="relative items-center">
              <View className="h-10 w-10 items-center justify-center rounded-full border-2 border-white/90 bg-white/20">
                <Text className="text-xs font-bold text-white">{initials}</Text>
              </View>
              <View className="absolute -bottom-1 h-4 w-4 items-center justify-center rounded-full border border-white bg-primary">
                <Text className="text-[9px] font-bold text-white">+</Text>
              </View>
            </View>
            <View className="min-w-0 flex-1 gap-px">
              <Text className="text-sm font-bold text-white" numberOfLines={1}>
                {authorName}
              </Text>
              <Text className="text-xs text-white/80" numberOfLines={1}>
                @{authorHandle}
              </Text>
            </View>
          </View>

          <Text className="text-sm font-semibold leading-snug text-white" numberOfLines={2}>
            {title}
          </Text>

          <View className="flex-row flex-wrap gap-1.5">
            <View className="flex-row items-center gap-1 rounded-full bg-white/15 px-2.5 py-1">
              <Icon as={Mountain} size={12} className="text-white" strokeWidth={2.5} />
              <Text className="text-[11px] font-semibold text-white" numberOfLines={1}>
                {routeName}
              </Text>
            </View>
            <View className="flex-row items-center gap-1 rounded-full bg-white/15 px-2.5 py-1">
              <Icon as={MapPin} size={12} className="text-white" strokeWidth={2.5} />
              <Text
                className="max-w-[160px] text-[11px] font-medium text-white/95"
                numberOfLines={1}
              >
                {place}
              </Text>
            </View>
          </View>

          <BlurView
            intensity={28}
            tint="dark"
            className="overflow-hidden rounded-xl border border-white/10"
          >
            {/*<View className="flex-row items-center gap-2 px-2.5 py-1.5">*/}
            {/*  <View className="h-8 w-8 items-center justify-center rounded-lg bg-white/10">*/}
            {/*    <Icon as={Music} size={15} className="text-white" strokeWidth={2.2} />*/}
            {/*  </View>*/}
            {/*  <View className="min-w-0 flex-1">*/}
            {/*    <Text className="text-[10px] font-medium uppercase tracking-wide text-white/55">*/}
            {/*      Dźwięk*/}
            {/*    </Text>*/}
            {/*    <Text className="text-xs font-semibold text-white" numberOfLines={1}>*/}
            {/*      {musicArtist} — {musicTrack}*/}
            {/*    </Text>*/}
            {/*  </View>*/}
            {/*</View>*/}
          </BlurView>
        </View>

        <View className="items-center gap-3 pb-28 pt-4">
          <View className="items-center gap-0.5">
            <View className="h-11 w-11 items-center justify-center rounded-full bg-white/12 shadow-md shadow-black/25">
              <Icon as={ThumbsUp} size={22} className="text-white" strokeWidth={2.4} />
            </View>
            <Text className="text-[11px] font-bold tabular-nums text-white">{likesLabel}</Text>
          </View>

          <View className="items-center gap-0.5">
            <View className="h-11 w-11 items-center justify-center rounded-full bg-white/12 shadow-md shadow-black/25">
              <Icon as={ThumbsDown} size={22} className="text-white" strokeWidth={2.4} />
            </View>
            <Text className="text-[11px] font-bold tabular-nums text-white">{dislikesLabel}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
