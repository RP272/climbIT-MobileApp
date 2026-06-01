import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import type { HomeReelPreview } from "@/src/types/home";
import { Image } from "expo-image";
import { MapPin, Mountain, Play, Video } from "lucide-react-native";
import { Pressable, View } from "react-native";

type HomeReelCardProps = {
  reel: HomeReelPreview;
  onPress: () => void;
};

export function HomeReelCard({ reel, onPress }: HomeReelCardProps) {
  const hasThumbnail = Boolean(reel.videoUri);

  return (
    <Pressable
      onPress={onPress}
      className="mr-3 w-[156px] overflow-hidden rounded-2xl border border-border bg-card active:opacity-95"
    >
      <View className="relative h-[200px] bg-zinc-900">
        {hasThumbnail ? (
          <>
            <Image
              source={{ uri: reel.videoUri! }}
              contentFit="cover"
              style={{ width: "100%", height: "100%" }}
            />
            <View className="absolute inset-0 bg-black/20" />
          </>
        ) : (
          <View className="absolute inset-0 items-center justify-center bg-zinc-900">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-white/10">
              <Icon as={Video} size={22} className="text-white/80" strokeWidth={2.2} />
            </View>
          </View>
        )}

        {reel.attemptTypeLabel ? (
          <View className="absolute left-2 top-2 rounded-full bg-primary/90 px-2 py-0.5">
            <Text className="text-[9px] font-bold uppercase text-primary-foreground">
              {reel.attemptTypeLabel}
            </Text>
          </View>
        ) : null}

        {hasThumbnail ? (
          <View className="absolute inset-0 items-center justify-center">
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
        ) : null}

        <View className="absolute inset-x-0 bottom-0 gap-1 bg-black/55 px-3 pb-3 pt-8">
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
        <View className="flex-row items-center justify-between">
          {reel.uploadedAtLabel ? (
            <Text className="text-[10px] text-muted-foreground">{reel.uploadedAtLabel}</Text>
          ) : (
            <View />
          )}
          <Text className={cn("text-[10px] font-semibold text-muted-foreground")}>
            👍 {reel.likesCount}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
