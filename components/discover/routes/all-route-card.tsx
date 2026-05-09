import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { PERSONAL_STATUS_CONFIG } from "@/src/types/all-routes.constants";
import type { RouteViewModel, UserRouteStatus } from "@/src/types/all-routes.types";
import {
  Bookmark,
  CheckCircle2,
  Clock3,
  MapPin,
  Mountain,
  Sparkles,
  TrendingUp,
  UserRound,
  Zap,
  type LucideIcon,
} from "lucide-react-native";
import { ImageBackground, Pressable, View } from "react-native";

type AllRouteCardProps = {
  routeViewModel: RouteViewModel;
  onLogAscent: (routeId: string) => void;
  onProjectToggle: (routeId: string, currentStatus: UserRouteStatus) => void;
  onPress?: () => void;
};

export function AllRouteCard({
  routeViewModel,
  onLogAscent,
  onProjectToggle,
  onPress,
}: AllRouteCardProps) {
  const { route, personalStatus } = routeViewModel;
  const isProject = personalStatus === "project";
  const isCompleted = personalStatus === "top" || personalStatus === "flash";

  return (
    <Pressable onPress={onPress} className="active:opacity-95">
      <Card className="gap-0 overflow-hidden rounded-xl border-border/70 bg-card p-0 shadow-sm">
        <RouteCardHero routeViewModel={routeViewModel} />

        <View className="gap-4 p-4">
          <View className="gap-3">
            <View className="flex-row items-start justify-between gap-3">
              <View className="min-w-0 flex-1 gap-1">
                <Text className="text-[19px] font-extrabold leading-6 text-foreground">
                  {route.name}
                </Text>
                <Text className="text-[13px] leading-5 text-muted-foreground">
                  {route.gymName} · {route.recommendationReason}
                </Text>
              </View>
              <RoutePersonalStatusBadge status={personalStatus} />
            </View>

            <View className="flex-row flex-wrap gap-2">
              <RouteInfoPill icon={MapPin} label={route.sector} />
              <RouteInfoPill icon={UserRound} label={routeViewModel.routeSetter} />
              <RouteInfoPill icon={Mountain} label={routeViewModel.wallProfile} />
            </View>
          </View>

          <View className="flex-row flex-wrap gap-2">
            {route.styleTags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="rounded-lg border-border/70 bg-background"
              >
                <Text className="text-[11px] font-bold text-foreground">{tag}</Text>
              </Badge>
            ))}
            {route.hasChallenge ? (
              <Badge variant="outline" className="rounded-lg border-primary/30 bg-primary/10">
                <Icon as={Zap} size={11} className="text-primary" strokeWidth={2.5} />
                <Text className="text-[11px] font-bold text-primary">Wyzwanie</Text>
              </Badge>
            ) : null}
            {route.routeStatuses.includes("popular") ? (
              <Badge variant="outline" className="rounded-lg border-border/70 bg-background">
                <Icon
                  as={TrendingUp}
                  size={11}
                  className="text-muted-foreground"
                  strokeWidth={2.5}
                />
                <Text className="text-[11px] font-bold text-foreground">Popularna</Text>
              </Badge>
            ) : null}
          </View>

          <View className="h-px bg-border/70" />

          <CommunityFeedbackPanel
            popularity={routeViewModel.popularity}
            rating={routeViewModel.rating}
            communityGrade={routeViewModel.communityGrade}
          />

          <View className="flex-row gap-2">
            <Button
              className="h-11 flex-1 rounded-lg"
              disabled={isCompleted}
              onPress={() => onLogAscent(route.id)}
            >
              <Icon
                as={CheckCircle2}
                size={16}
                className="text-primary-foreground"
                strokeWidth={2.4}
              />
              <Text className="text-[13px] font-bold text-primary-foreground">
                {isCompleted ? "Zapisane" : "Dodaj przejście"}
              </Text>
            </Button>

            <Button
              variant={isProject ? "default" : "outline"}
              className={cn(
                "h-11 rounded-lg px-3",
                isProject ? "border-transparent" : "border-border/70 bg-background",
              )}
              onPress={() => onProjectToggle(route.id, personalStatus)}
              accessibilityState={{ selected: isProject }}
            >
              <Icon
                as={Bookmark}
                size={16}
                className={isProject ? "text-primary-foreground" : "text-foreground"}
                strokeWidth={2.4}
              />
            </Button>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

function RouteCardHero({ routeViewModel }: { routeViewModel: RouteViewModel }) {
  const { route, color, setDaysAgo, isExpiringSoon, removalDays } = routeViewModel;

  return (
    <View className="h-44 overflow-hidden bg-muted">
      <ImageBackground
        source={{ uri: route.imageUrl }}
        resizeMode="cover"
        imageStyle={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
        className="h-full w-full"
      >
        <View className="absolute inset-0 bg-black/20" />

        <View className="absolute inset-x-0 top-0 flex-row flex-wrap items-start justify-between gap-2 p-3">
          <View className="flex-row flex-wrap gap-2">
            {route.routeStatuses.includes("new") ? (
              <HeroBadge icon={Sparkles} label={`Nowość · ${setDaysAgo} dni`} />
            ) : null}
            {isExpiringSoon ? (
              <HeroBadge icon={Clock3} label={`Znika za ${removalDays} dni`} />
            ) : null}
          </View>

          <View
            className={cn(
              "flex-row items-center gap-1.5 rounded-lg border px-2.5 py-1.5",
              color.surfaceClassName,
            )}
          >
            <View className={cn("h-2.5 w-2.5 rounded-full", color.dotClassName)} />
            <Text className={cn("text-[11px] font-extrabold", color.textClassName)}>
              {color.label}
            </Text>
          </View>
        </View>

        <View className="absolute bottom-3 left-3 flex-row items-end gap-2">
          <View className="rounded-lg bg-primary px-3.5 py-2.5 shadow-sm">
            <Text className="text-[24px] font-extrabold leading-7 text-primary-foreground">
              {route.grade}
            </Text>
          </View>
          <Badge variant="outline" className="mb-1 rounded-lg border-transparent bg-card px-2 py-1">
            <Text className="text-[11px] font-bold text-foreground">{route.climbingTypeLabel}</Text>
          </Badge>
        </View>
      </ImageBackground>
    </View>
  );
}

function HeroBadge({ icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <View className="flex-row items-center gap-1.5 rounded-lg bg-card px-2.5 py-1.5 shadow-sm">
      <Icon as={icon} size={12} className="text-foreground" strokeWidth={2.5} />
      <Text className="text-[11px] font-extrabold text-foreground">{label}</Text>
    </View>
  );
}

function RoutePersonalStatusBadge({ status }: { status: UserRouteStatus }) {
  const statusConfig = PERSONAL_STATUS_CONFIG[status];

  return (
    <Badge variant="outline" className={cn("rounded-lg px-2.5 py-1.5", statusConfig.className)}>
      <Icon
        as={statusConfig.icon}
        size={12}
        className={statusConfig.textClassName}
        strokeWidth={2.5}
      />
      <Text className={cn("text-[11px] font-extrabold", statusConfig.textClassName)}>
        {statusConfig.label}
      </Text>
    </Badge>
  );
}

function RouteInfoPill({ icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <View className="max-w-full flex-row items-center gap-1.5 rounded-lg border border-border/70 bg-background px-2.5 py-1.5">
      <Icon as={icon} size={13} className="text-muted-foreground" strokeWidth={2.3} />
      <Text className="text-[12px] font-bold text-foreground" numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

function CommunityFeedbackPanel({
  popularity,
  rating,
  communityGrade,
}: {
  popularity: number;
  rating: number;
  communityGrade: string;
}) {
  return (
    <View className="gap-1.5">
      <Text className="text-[11px] font-bold uppercase tracking-[0.4px] text-muted-foreground">
        Ocena wspinaczy
      </Text>

      <View className="flex-row items-center justify-between gap-4">
        <View className="min-w-0 flex-1 flex-row flex-wrap items-center gap-x-3 gap-y-1">
          <Text className="text-[16px] font-semibold leading-5 text-foreground">
            {rating.toFixed(1)}/5
          </Text>
          <Text className="text-[16px] font-semibold leading-5 text-foreground">
            {communityGrade}
          </Text>
        </View>
        <Text className="text-[16px] font-semibold leading-5 text-foreground">
          {popularity} przejść
        </Text>
      </View>
    </View>
  );
}
