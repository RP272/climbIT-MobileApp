import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import type { WatchReel } from "@/src/types/watch";
import { MapPin, Mountain, Play } from "lucide-react-native";
import { Pressable, View } from "react-native";

type HomeReelCardProps = {
  reel: WatchReel;
  onPress: () => void;
};

export function HomeReelCard({ reel, onPress }: HomeReelCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="mr-3 w-[156px] overflow-hidden rounded-2xl border border-border bg-card active:opacity-95"
    >
      <View className="relative h-[200px] bg-zinc-900">
        <View className="absolute inset-0 bg-black/25" />

        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View className="h-11 w-11 items-center justify-center rounded-full bg-white/25">
            <Icon
              as={Play}
              size={20}
              className="ml-0.5 text-white"
              fill="#ffffff"
              strokeWidth={0}
            />
          </View>
        </View>

        <View
          pointerEvents="none"
          className="absolute inset-x-0 bottom-0 gap-1 bg-black/55 px-3 pb-3 pt-8"
        >
          <Text className="text-sm font-bold text-white" numberOfLines={2}>
            {reel.title}
          </Text>
          <Text className="text-[11px] text-white/85" numberOfLines={1}>
            {reel.authorName}
          </Text>
        </View>
      </View>

      <View className="gap-1.5 p-2.5">
        <View className="flex-row items-center gap-1">
          <Icon as={Mountain} size={11} className="text-muted-foreground" strokeWidth={2.4} />
          <Text
            className="min-w-0 flex-1 text-[10px] font-medium text-foreground"
            numberOfLines={1}
          >
            {reel.routeName}
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Icon as={MapPin} size={11} className="text-muted-foreground" strokeWidth={2.4} />
          <Text className="min-w-0 flex-1 text-[10px] text-muted-foreground" numberOfLines={1}>
            {reel.place}
          </Text>
        </View>
        {reel.uploadedAtLabel ? (
          <Text className="text-[10px] text-muted-foreground">Wysłano {reel.uploadedAtLabel}</Text>
        ) : null}
      </View>
    </Pressable>
  );
}
