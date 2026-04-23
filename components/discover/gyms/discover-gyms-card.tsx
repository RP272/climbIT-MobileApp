import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import type { Gym, GymOpeningHours } from "@/src/types/discover";
import {
  ChevronRight,
  Clock3,
  MapPin,
  Route as RouteIcon,
  Star,
  WalletCards,
  Zap,
  type LucideIcon,
} from "lucide-react-native";
import { ImageBackground, Pressable, View } from "react-native";

type DiscoverGymsCardVariant = "default" | "detailed";

type DiscoverGymsCardProps = Gym & {
  onPress?: () => void;
  className?: string;
  containerClassName?: string;
  variant?: DiscoverGymsCardVariant;
};

type DiscoverGymsCardHeaderProps = Pick<DiscoverGymsCardProps, "imageUrl" | "tags">;

type DiscoverGymsCardContentProps = Pick<
  DiscoverGymsCardProps,
  "name" | "city" | "distanceKm" | "newRoutesCount" | "rating"
>;

const WEEKDAYS_BY_DATE_INDEX = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

export function DiscoverGymsCard({ variant = "default", ...props }: DiscoverGymsCardProps) {
  if (variant === "detailed") {
    return <DetailedDiscoverGymsCard {...props} />;
  }

  return <CompactDiscoverGymsCard {...props} />;
}

function CompactDiscoverGymsCard({
  name,
  city,
  distanceKm,
  newRoutesCount,
  rating,
  imageUrl,
  tags,
  onPress,
  className,
  containerClassName,
}: Omit<DiscoverGymsCardProps, "variant">) {
  return (
    <Pressable onPress={onPress} className={cn("w-[272px] active:opacity-95", containerClassName)}>
      <Card
        className={cn(
          "gap-0 overflow-hidden rounded-[24px] border-border/70 bg-card px-0 py-0 shadow-md",
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

function DetailedDiscoverGymsCard({
  onPress,
  className,
  containerClassName,
  ...gym
}: Omit<DiscoverGymsCardProps, "variant">) {
  const todayHours = getTodayOpeningHours(gym.openingHours);

  return (
    <Pressable onPress={onPress} className={cn("w-[272px] active:opacity-95", containerClassName)}>
      <Card
        className={cn(
          "gap-0 overflow-hidden rounded-xl border-border/70 bg-card px-0 py-0 shadow-sm",
          className,
        )}
      >
        <DetailedGymCardHero gym={gym} />

        <View className="gap-4 p-4">
          <View className="gap-3">
            <View className="gap-1">
              <Text className="text-[19px] font-extrabold leading-6 text-foreground">
                {gym.name}
              </Text>
              <Text className="text-[13px] leading-5 text-muted-foreground">
                {gym.description ?? `${gym.city} · sprawdź szczegóły obiektu.`}
              </Text>
            </View>

            <View className="flex-row flex-wrap gap-2">
              <GymInfoPill icon={MapPin} label={`${gym.city} · ${gym.distanceKm.toFixed(1)} km`} />
              {todayHours ? <GymInfoPill icon={Clock3} label={`Dziś ${todayHours.hours}`} /> : null}
              {gym.priceLabel ? <GymInfoPill icon={WalletCards} label={gym.priceLabel} /> : null}
              <GymInfoPill icon={RouteIcon} label={getClimbingTypesLabel(gym)} />
            </View>
          </View>

          <View className="flex-row flex-wrap gap-2">
            {(gym.amenities ?? gym.tags).slice(0, 3).map((item) => (
              <Badge
                key={item}
                variant="outline"
                className="rounded-lg border-border/70 bg-background"
              >
                <Text className="text-[11px] font-bold text-foreground">{item}</Text>
              </Badge>
            ))}
            {gym.hasChallenges ? (
              <Badge variant="outline" className="rounded-lg border-primary/40 bg-primary-100">
                <Icon as={Zap} size={11} className="text-primary-700" strokeWidth={2.5} />
                <Text className="text-[11px] font-bold text-primary-700">Wyzwania</Text>
              </Badge>
            ) : null}
            {gym.routeStatuses.includes("new") ? (
              <Badge variant="outline" className="rounded-lg border-emerald-300 bg-emerald-100">
                <Text className="text-[11px] font-bold text-emerald-800">Świeże sety</Text>
              </Badge>
            ) : null}
          </View>

          <View className="h-px bg-border/70" />

          <View className="flex-row items-center justify-between gap-3">
            <View className="min-w-0 flex-1 gap-0.5">
              <Text className="text-[12px] font-bold uppercase text-muted-foreground">Na dziś</Text>
              <Text className="text-[13px] text-muted-foreground">
                {gym.busyHoursLabel ??
                  gym.settingSchedule ??
                  (gym.isOpenNow ? "Otwarte teraz" : "Sprawdź godziny otwarcia")}
              </Text>
            </View>

            <View className="flex-row items-center gap-1">
              <Text className="text-[13px] font-semibold text-foreground">Szczegóły</Text>
              <Icon as={ChevronRight} size={14} className="text-foreground" strokeWidth={2.4} />
            </View>
          </View>
        </View>
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

function DetailedGymCardHero({ gym }: { gym: Gym }) {
  const primaryTags = gym.tags.slice(0, 2);

  return (
    <View className="relative h-44 overflow-hidden bg-muted">
      <ImageBackground
        source={{ uri: gym.imageUrl }}
        resizeMode="cover"
        imageStyle={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
        className="h-full w-full"
      >
        <View className="absolute inset-0 bg-black/20" />

        <View className="absolute inset-x-0 top-0 flex-row flex-wrap items-start justify-between gap-2 p-3">
          <View className="flex-row flex-wrap gap-2">
            {primaryTags.map((tag) => (
              <HeroBadge key={tag} label={tag} />
            ))}
            {gym.hasChallenges ? <HeroBadge label="Wyzwania" icon={Zap} /> : null}
          </View>

          <View className="flex-row items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-200 px-2.5 py-1.5 shadow-sm">
            <Icon as={Star} size={12} className="text-amber-900" fill="currentColor" />
            <Text className="text-[11px] font-extrabold text-amber-900">
              {gym.rating.toFixed(1)}
            </Text>
          </View>
        </View>

        <View className="absolute bottom-3 left-3 flex-row items-end gap-2">
          <View className="rounded-lg bg-primary px-3.5 py-2.5 shadow-sm">
            <Text className="text-[21px] font-extrabold leading-6 text-primary-foreground">
              {gym.newRoutesCount}
            </Text>
            <Text className="text-[10px] font-bold uppercase text-white">nowych tras</Text>
          </View>

          <Badge
            variant="outline"
            className={cn(
              "mb-1 rounded-lg border-transparent px-2 py-1",
              gym.isOpenNow ? "bg-card" : "bg-card/90",
            )}
          >
            <Text className="text-[11px] font-bold text-foreground">
              {gym.isOpenNow ? "Otwarte teraz" : "Sprawdź godziny"}
            </Text>
          </Badge>
        </View>
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
    <View className="flex-row items-center gap-1.5 self-start rounded-full border border-amber-300 bg-amber-200 px-2.5 py-1.5">
      <Icon as={Star} size={12} className="text-amber-900" fill="currentColor" strokeWidth={2.2} />
      <Text className="text-[12px] font-semibold text-amber-900">{rating.toFixed(1)}</Text>
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

function HeroBadge({ label, icon }: { label: string; icon?: LucideIcon }) {
  return (
    <View className="flex-row items-center gap-1.5 rounded-lg bg-card px-2.5 py-1.5 shadow-sm">
      {icon ? <Icon as={icon} size={12} className="text-foreground" strokeWidth={2.5} /> : null}
      <Text className="text-[11px] font-extrabold text-foreground">{label}</Text>
    </View>
  );
}

function GymInfoPill({ icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <View className="max-w-full flex-row items-center gap-1.5 rounded-lg border border-border/70 bg-background px-2.5 py-1.5">
      <Icon as={icon} size={13} className="text-muted-foreground" strokeWidth={2.3} />
      <Text className="text-[12px] font-bold text-foreground" numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

function getClimbingTypesLabel(gym: Gym) {
  const typeLabels = gym.climbingTypes.map((climbingType) => {
    switch (climbingType) {
      case "bouldering":
        return "Boulder";
      case "rope":
        return "Lina";
      case "auto-belay":
        return "Auto";
      default:
        return climbingType;
    }
  });

  return typeLabels.join(" · ");
}

function getTodayOpeningHours(openingHours: readonly GymOpeningHours[] | undefined) {
  if (!openingHours?.length) {
    return null;
  }

  const today = WEEKDAYS_BY_DATE_INDEX[new Date().getDay()];

  return openingHours.find((openingHour) => openingHour.day === today) ?? openingHours[0];
}

export function DiscoverGymsCardSkeleton({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: DiscoverGymsCardVariant;
}) {
  if (variant === "detailed") {
    return (
      <Card
        className={cn(
          "gap-0 overflow-hidden rounded-xl border-border/70 bg-card px-0 py-0 shadow-sm",
          className,
        )}
      >
        <Skeleton className="h-44 w-full rounded-none" />

        <View className="gap-4 p-4">
          <View className="gap-3">
            <View className="gap-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </View>

            <View className="flex-row flex-wrap gap-2">
              <Skeleton className="h-8 w-28 rounded-lg" />
              <Skeleton className="h-8 w-24 rounded-lg" />
              <Skeleton className="h-8 w-24 rounded-lg" />
            </View>
          </View>

          <View className="flex-row flex-wrap gap-2">
            <Skeleton className="h-6 w-24 rounded-lg" />
            <Skeleton className="h-6 w-28 rounded-lg" />
            <Skeleton className="h-6 w-20 rounded-lg" />
          </View>

          <Skeleton className="h-px w-full rounded-none" />

          <View className="flex-row items-center justify-between gap-3">
            <View className="flex-1 gap-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-36" />
            </View>
            <View className="flex-row items-center gap-1">
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-4 w-4" />
            </View>
          </View>
        </View>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "w-[272px] gap-0 overflow-hidden rounded-[24px] border-border/70 bg-card px-0 py-0 shadow-md",
        className,
      )}
    >
      <Skeleton className="h-40 w-full rounded-none" />

      <View className="gap-3 px-3.5 pb-3.5 pt-2.5">
        <View className="flex-row items-start justify-between gap-2.5">
          <View className="flex-1 gap-1.5">
            <Skeleton className="h-5 w-32" />
            <View className="flex-row items-center gap-1.5">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-28" />
            </View>
          </View>
          <Skeleton className="h-[28px] w-12 rounded-full" />
        </View>

        <View className="flex-row items-center justify-between gap-2">
          <Skeleton className="h-4 w-24" />
          <View className="flex-row items-center gap-1">
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-4 w-4" />
          </View>
        </View>
      </View>
    </Card>
  );
}
