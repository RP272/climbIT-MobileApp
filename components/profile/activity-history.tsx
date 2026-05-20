import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { PERSONAL_STATUS_CONFIG } from "@/src/types/all-routes.constants";
import type { UserRouteStatus } from "@/src/types/all-routes.types";
import type { RecommendedRoute } from "@/src/types/discover";
import { ImageBackground, View } from "react-native";

export type RecentActivity = {
  id: string;
  status: UserRouteStatus;
  routeName: string;
  gymName: string;
  grade: string;
  dateLabel: string;
  xpDelta?: string;
};

const ACTIVITY_ROUTE_ALIASES: Record<string, string> = {
  "Crux Balance": "edge-balance",
  "Dynamic Sprint": "dynamic-sprint",
  "Cicha Pompa": "quiet-pump",
  "Czarny Okap": "route-6",
  "Krawędź Balansu": "edge-balance",
  "Niebieska Przyjemność": "route-7",
  "Quiet Pump": "quiet-pump",
  "Slab Focus": "slab-focus",
  "Żółty Trawers": "route-5",
};

export function getActivityRoute(
  activity: RecentActivity,
  routesById: ReadonlyMap<string, RecommendedRoute>,
  routesByName: ReadonlyMap<string, RecommendedRoute>,
) {
  return (
    routesById.get(ACTIVITY_ROUTE_ALIASES[activity.routeName]) ??
    routesByName.get(activity.routeName.toLowerCase())
  );
}

export function ActivityHistoryCard({
  activity,
  route,
  isLatest,
}: {
  activity: RecentActivity;
  route?: RecommendedRoute;
  isLatest: boolean;
}) {
  const statusConfig = PERSONAL_STATUS_CONFIG[activity.status];
  const routeName = route?.name ?? activity.routeName;
  const gymName = route?.gymName ?? activity.gymName;
  const grade = route?.grade ?? activity.grade;

  return (
    <Card className="rounded-lg border-border/70 bg-card py-2 pl-2 pr-4 shadow-sm">
      <View className="flex-row items-center gap-3">
        <ImageBackground
          source={{ uri: route?.imageUrl }}
          resizeMode="cover"
          className="h-[72px] w-[72px] overflow-hidden rounded-lg bg-muted"
        >
          <View className="absolute inset-0 bg-black/10" />
        </ImageBackground>

        <View className="min-w-0 flex-1 gap-1">
          <View className="flex-row items-start justify-between gap-3">
            <View className="min-w-0 flex-1">
              <Text className="text-[15px] font-bold leading-5 text-foreground" numberOfLines={1}>
                {routeName}
              </Text>
              <Text className="text-[12px] leading-4 text-muted-foreground" numberOfLines={1}>
                {gymName}
                {route?.sector ? ` · ${route.sector}` : ""}
              </Text>
            </View>

            <View className="shrink-0 items-end">
              <Text className="text-[15px] font-extrabold leading-5 text-foreground">{grade}</Text>
              {activity.xpDelta ? (
                <Text className="text-[11px] font-bold leading-4 text-primary">
                  {activity.xpDelta}
                </Text>
              ) : null}
            </View>
          </View>

          <View className="flex-row items-center justify-between gap-3">
            <View className="flex-row items-center gap-1.5">
              <Icon
                as={statusConfig.icon}
                size={12}
                className={statusConfig.textClassName}
                strokeWidth={2.4}
              />
              <Text className={cn("text-[11px] font-bold leading-4", statusConfig.textClassName)}>
                {statusConfig.label}
              </Text>
            </View>
            <Text className="text-[12px] font-semibold leading-4 text-muted-foreground">
              {isLatest ? "Dzisiaj" : activity.dateLabel}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
}
