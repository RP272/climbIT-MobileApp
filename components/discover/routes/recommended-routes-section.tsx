import { HorizontalScrollSection } from "@/components/discover/gyms/horizontal-scroll-section";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import type { RecommendedRoute } from "@/src/types/discover";
import { ChevronRight, MapPin, Zap } from "lucide-react-native";
import { ImageBackground, Pressable, View } from "react-native";

type RecommendedRoutesSectionProps = {
  routes?: readonly RecommendedRoute[];
  isLoading?: boolean;
  loadingItemsCount?: number;
  onActionPress?: () => void;
  onRoutePress?: (route: RecommendedRoute) => void;
  className?: string;
};

type RecommendedRouteCardProps = {
  route: RecommendedRoute;
  onPress?: () => void;
  className?: string;
};

type RecommendedRouteCardHeaderProps = Pick<
  RecommendedRoute,
  "grade" | "imageUrl" | "styleTags" | "badge" | "climbingType"
>;

type RecommendedRouteCardContentProps = Pick<RecommendedRoute, "name" | "gymName" | "sector">;

export function RecommendedRoutesSection({
  routes = [],
  isLoading = false,
  loadingItemsCount = 3,
  onActionPress,
  onRoutePress,
  className,
}: RecommendedRoutesSectionProps) {
  return (
    <HorizontalScrollSection
      title="Polecane trasy"
      description="Wybrane pod Twoją formę, styl wspinania i świeże sety w okolicy"
      actionLabel="Zobacz wszystkie"
      items={routes}
      isLoading={isLoading}
      loadingItemsCount={loadingItemsCount}
      renderLoadingItem={() => <RecommendedRouteCardSkeleton />}
      keyExtractor={(route) => route.id}
      className={className}
      renderItem={(route) => (
        <RecommendedRouteCard
          route={route}
          onPress={onRoutePress ? () => onRoutePress(route) : undefined}
        />
      )}
      onActionPress={onActionPress}
    />
  );
}

function RecommendedRouteCard({ route, onPress, className }: RecommendedRouteCardProps) {
  return (
    <Pressable onPress={onPress} className="w-[272px] active:opacity-95">
      <Card
        className={cn(
          "overflow-hidden rounded-[24px] border-border/70 bg-card px-0 py-0 gap-0 shadow-md",
          className,
        )}
      >
        <RecommendedRouteCardHeader
          grade={route.grade}
          imageUrl={route.imageUrl}
          styleTags={route.styleTags}
          badge={route.badge}
          climbingType={route.climbingType}
        />
        <RecommendedRouteCardContent
          name={route.name}
          gymName={route.gymName}
          sector={route.sector}
        />
      </Card>
    </Pressable>
  );
}

function RecommendedRouteCardHeader({
  grade,
  imageUrl,
  styleTags,
  badge,
  climbingType,
}: RecommendedRouteCardHeaderProps) {
  return (
    <View className="relative h-40 overflow-hidden bg-muted">
      <ImageBackground
        source={{ uri: imageUrl }}
        resizeMode="cover"
        imageStyle={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
        className="h-full w-full"
      >
        <View className="absolute inset-x-0 top-0 flex-row flex-wrap items-start justify-between gap-2 p-2.5">
          <View className="flex-row flex-wrap gap-1.5">
            <Badge variant="outline" className="border-transparent bg-card px-2 py-1 shadow-sm">
              <Text className="text-[10px] font-semibold text-foreground">{climbingType}</Text>
            </Badge>
            {styleTags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="border-transparent bg-card px-2 py-1 shadow-sm"
              >
                <Text className="text-[10px] font-semibold text-foreground">{tag}</Text>
              </Badge>
            ))}
          </View>

          {badge ? <RecommendedRouteBadge label={badge} /> : null}
        </View>

        <View className="absolute inset-x-0 bottom-0 h-14 bg-card/78" />

        <View className="absolute bottom-3 left-3 flex-row items-end gap-2">
          <View className="rounded-2xl bg-primary px-3.5 py-2.5 shadow-sm">
            <Text className="text-[22px] font-bold leading-6 text-primary-foreground">{grade}</Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

function RecommendedRouteBadge({ label }: { label: string }) {
  return (
    <View className="flex-row items-center gap-1 rounded-full bg-card px-2 py-1 shadow-sm">
      <Icon as={Zap} size={11} className="text-foreground" strokeWidth={2.6} />
      <Text className="text-[10px] font-semibold text-foreground">{label}</Text>
    </View>
  );
}

function RecommendedRouteCardContent({ name, gymName, sector }: RecommendedRouteCardContentProps) {
  return (
    <View className="gap-3 px-3.5 pb-3.5 pt-2.5">
      <View className="gap-1.5">
        <Text className="text-[17px] font-semibold leading-5 text-foreground">{name}</Text>
        <RecommendedRouteLocation gymName={gymName} sector={sector} />
      </View>

      <RecommendedRouteFooter />
    </View>
  );
}

function RecommendedRouteLocation({
  gymName,
  sector,
}: Pick<RecommendedRoute, "gymName" | "sector">) {
  return (
    <View className="flex-row items-center gap-1.5">
      <Icon as={MapPin} size={15} className="text-muted-foreground" strokeWidth={2.2} />
      <Text className="flex-1 text-[13px] text-muted-foreground">
        {gymName} · {sector}
      </Text>
    </View>
  );
}

function RecommendedRouteFooter() {
  return (
    <View className="flex-row items-center justify-end gap-1">
      <Text className="text-[13px] font-semibold text-foreground">Szczegóły</Text>
      <Icon as={ChevronRight} size={14} className="text-foreground" strokeWidth={2.4} />
    </View>
  );
}

function RecommendedRouteCardSkeleton() {
  return (
    <Card className="w-[272px] overflow-hidden rounded-[24px] border-border/70 bg-card px-0 py-0 gap-0 shadow-md">
      <Skeleton className="h-40 w-full rounded-none" />

      <View className="gap-3 px-3.5 pb-3.5 pt-2.5">
        <View className="gap-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-40" />
        </View>

        <View className="gap-2">
          <View className="flex-row items-start gap-1.5">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-8 flex-1" />
          </View>
          <View className="flex-row justify-end">
            <Skeleton className="h-4 w-16" />
          </View>
        </View>
      </View>
    </Card>
  );
}
