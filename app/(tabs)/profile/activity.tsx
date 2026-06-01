import {
  ActivityHistoryCard,
  EmptyActivityState,
  getActivityRoute,
  type RecentActivity,
} from "@/components/profile/activity-history";
import { Text } from "@/components/ui/text";
import recommendedRoutesData from "@/src/data/recommended-routes.json";
import { useRecentActivitiesInfiniteQuery } from "@/src/query/profile.query";
import { useQueryRefresh } from "@/src/query/use-query-refresh";
import type { RecommendedRoute } from "@/src/types/discover";
import { useMemo } from "react";
import { ActivityIndicator, FlatList, RefreshControl, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ActivityHistoryScreen() {
  const insets = useSafeAreaInsets();
  const routes = recommendedRoutesData as unknown as RecommendedRoute[];
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useRecentActivitiesInfiniteQuery();
  const refresh = useQueryRefresh([{ refetch }]);
  const activities = useMemo(() => data?.pages.flat() ?? [], [data]);
  const routesById = useMemo(() => new Map(routes.map((route) => [route.id, route])), [routes]);
  const routesByName = useMemo(
    () => new Map(routes.map((route) => [route.name.toLowerCase(), route])),
    [routes],
  );
  const activityGroups = useMemo(
    () => groupActivitiesByDate(activities as RecentActivity[]),
    [activities],
  );
  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  };

  return (
    <FlatList
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 96, 124) }}
      contentContainerClassName="gap-4 px-4 pt-4"
      data={activityGroups}
      keyExtractor={(group) => group.title}
      refreshControl={
        <RefreshControl refreshing={refresh.refreshing} onRefresh={refresh.onRefresh} />
      }
      ListEmptyComponent={<EmptyActivityState />}
      ListFooterComponent={
        isFetchingNextPage ? (
          <View className="items-center py-3">
            <ActivityIndicator />
          </View>
        ) : null
      }
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.35}
      renderItem={({ item: group }) => (
        <View className="gap-2">
          <Text className="text-[13px] font-semibold leading-5 text-muted-foreground">
            {group.title}
          </Text>
          {group.activities.map((activity, index) => (
            <ActivityHistoryCard
              key={activity.id}
              activity={activity}
              route={getActivityRoute(activity, routesById, routesByName)}
              isLatest={group.title === "Dzisiaj" && index === 0}
            />
          ))}
        </View>
      )}
      showsVerticalScrollIndicator={false}
    />
  );
}

type ActivityGroup = {
  title: "Dzisiaj" | "Wczoraj" | "Ostatnie 7 dni" | "Starsze";
  activities: RecentActivity[];
};

function groupActivitiesByDate(activities: readonly RecentActivity[]): ActivityGroup[] {
  const groups: ActivityGroup[] = [
    { title: "Dzisiaj", activities: [] },
    { title: "Wczoraj", activities: [] },
    { title: "Ostatnie 7 dni", activities: [] },
    { title: "Starsze", activities: [] },
  ];

  activities.forEach((activity) => {
    getActivityGroup(activity.dateLabel, groups).activities.push(activity);
  });

  return groups.filter((group) => group.activities.length > 0);
}

function getActivityGroup(dateLabel: string, groups: ActivityGroup[]) {
  const normalizedDateLabel = dateLabel.toLowerCase();

  if (normalizedDateLabel === "dzisiaj") {
    return groups[0];
  }

  if (normalizedDateLabel === "wczoraj") {
    return groups[1];
  }

  if (normalizedDateLabel.includes("tydzień") || normalizedDateLabel.includes("dni temu")) {
    const daysAgo = Number(normalizedDateLabel.match(/\d+/)?.[0] ?? 7);
    return daysAgo <= 7 ? groups[2] : groups[3];
  }

  return groups[3];
}
