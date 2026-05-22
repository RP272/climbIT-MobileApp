import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import type { Gym } from "@/src/types/discover";
import { ChevronRight, MapPin, Star } from "lucide-react-native";
import { ImageBackground, Pressable, View } from "react-native";

type DiscoverGymsCardProps = Gym & {
  onPress?: () => void;
  className?: string;
};

type DiscoverGymsCardHeaderProps = Pick<DiscoverGymsCardProps, "imageUrl" | "tags">;

type DiscoverGymsCardContentProps = Pick<
  DiscoverGymsCardProps,
  "name" | "city" | "distanceKm" | "newRoutesCount" | "rating"
>;

export function DiscoverGymsCard({
  name,
  city,
  distanceKm,
  newRoutesCount,
  rating,
  imageUrl,
  tags,
  onPress,
  className,
}: DiscoverGymsCardProps) {
  return (
    <Pressable onPress={onPress} className="w-[272px] active:opacity-95">
      <Card
        className={cn(
          "overflow-hidden rounded-[24px] border-border/70 bg-card px-0 py-0 gap-0 shadow-md",
          className,
        )}
      >
        <DiscoverGymsCardHeader imageUrl={imageUrl} tags={tags} />
        <DiscoverGymsCardContent
          name={name}
          city={city}
          distanceKm={distanceKm}
          newRoutesCount={newRoutesCount}
          rating={rating}
        />
      </Card>
    </Pressable>
  );
}

function DiscoverGymsCardHeader({ imageUrl, tags }: DiscoverGymsCardHeaderProps) {
  return (
    <View className="relative h-40 overflow-hidden">
      <ImageBackground
        source={{ uri: imageUrl }}
        resizeMode="cover"
        imageStyle={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
        className="h-full w-full"
      >
        <DiscoverGymsCardTags tags={tags} />
        <View className="absolute inset-x-0 bottom-0 h-14 bg-card/78" />
      </ImageBackground>
    </View>
  );
}

function DiscoverGymsCardTags({ tags }: Pick<DiscoverGymsCardProps, "tags">) {
  return (
    <View className="flex-row flex-wrap gap-1.5 p-2.5">
      {tags.map((tag) => (
        <Badge
          key={tag}
          variant="outline"
          className="border-transparent bg-card px-2 py-1 shadow-sm"
        >
          <Text className="text-[10px] font-semibold text-foreground">{tag}</Text>
        </Badge>
      ))}
    </View>
  );
}

function DiscoverGymsCardContent({
  name,
  city,
  distanceKm,
  newRoutesCount,
  rating,
}: DiscoverGymsCardContentProps) {
  return (
    <View className="gap-3 px-3.5 pb-3.5 pt-2.5">
      <View className="flex-row items-start justify-between gap-2.5">
        <DiscoverGymsCardTitleBlock name={name} city={city} distanceKm={distanceKm} />
        <DiscoverGymsCardRating rating={rating} />
      </View>

      <DiscoverGymsCardFooter newRoutesCount={newRoutesCount} />
    </View>
  );
}

function DiscoverGymsCardTitleBlock({
  name,
  city,
  distanceKm,
}: Pick<DiscoverGymsCardProps, "name" | "city" | "distanceKm">) {
  return (
    <View className="flex-1 gap-1.5">
      <Text className="text-[17px] font-semibold leading-5 text-foreground">{name}</Text>
      <DiscoverGymsCardLocation city={city} distanceKm={distanceKm} />
    </View>
  );
}

function DiscoverGymsCardLocation({
  city,
  distanceKm,
}: Pick<DiscoverGymsCardProps, "city" | "distanceKm">) {
  return (
    <View className="flex-row items-center gap-1.5">
      <Icon as={MapPin} size={15} className="text-muted-foreground" strokeWidth={2.2} />
      <Text className="text-[13px] text-muted-foreground">
        {city} · {distanceKm.toFixed(1)} km
      </Text>
    </View>
  );
}

function DiscoverGymsCardRating({ rating }: Pick<DiscoverGymsCardProps, "rating">) {
  return (
    <View className="flex-row items-center gap-1.5 self-start rounded-full bg-muted px-2.5 py-1.5">
      <Icon as={Star} size={12} className="text-foreground" fill="currentColor" strokeWidth={2.2} />
      <Text className="text-[12px] font-semibold text-foreground">{rating.toFixed(1)}</Text>
    </View>
  );
}

function DiscoverGymsCardFooter({ newRoutesCount }: Pick<DiscoverGymsCardProps, "newRoutesCount">) {
  return (
    <View className="flex-row items-center justify-between gap-2">
      <Text className="text-[13px] text-muted-foreground">{newRoutesCount} nowych tras</Text>

      <View className="flex-row items-center gap-1">
        <Text className="text-[13px] font-semibold text-foreground">Szczegóły</Text>
        <Icon as={ChevronRight} size={14} className="text-foreground" strokeWidth={2.4} />
      </View>
    </View>
  );
}

export function DiscoverGymsCardSkeleton() {
  return (
    <Card className="w-[272px] overflow-hidden rounded-[24px] border-border/70 bg-card px-0 py-0 gap-0 shadow-md">
      <Skeleton className="h-40 w-full rounded-none" />

      <View className="gap-3 px-3.5 pb-3.5 pt-2.5">
        <View className="flex-row items-start justify-between gap-2.5">
          <View className="flex-1 gap-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-28" />
          </View>
          <Skeleton className="h-7 w-12 rounded-full" />
        </View>

        <View className="flex-row items-center justify-between gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-5" />
        </View>
      </View>
    </Card>
  );
}
