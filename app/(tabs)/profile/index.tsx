import { HorizontalScrollSection } from "@/components/discover/horizontal-scroll-section";
import { RecommendedRouteCard } from "@/components/discover/routes/recommended-routes-section";
import {
  ActivityHistoryCard,
  getActivityRoute,
  type RecentActivity,
} from "@/components/profile/activity-history";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Icon } from "@/components/ui/icon";
import { Progress } from "@/components/ui/progress";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import profileData from "@/src/data/profile.json";
import recommendedRoutesData from "@/src/data/recommended-routes.json";
import { PROFILE_STAT_ICON_MAP } from "@/src/features/profile/profile-stats.icons";
import {
  useOrderedProfileStats,
  type ProfileStat,
} from "@/src/features/profile/profile-stats.store";
import {
  getGradeSummary,
  getProfileStatLabel,
  getStatLevelProgress,
} from "@/src/features/profile/profile-stats.utils";
import { DEFAULT_PERSONAL_STATUSES } from "@/src/types/all-routes.constants";
import type { RecommendedRoute } from "@/src/types/discover";
import { useRouter } from "expo-router";
import { Building2, ChevronRight, Settings } from "lucide-react-native";
import { useCallback, useMemo } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type WeeklyActivity = {
  id: string;
  label: string;
  value: number;
  isToday: boolean;
};

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const routes = recommendedRoutesData as unknown as RecommendedRoute[];
  const savedRoutes = useMemo(
    () => routes.filter((route) => DEFAULT_PERSONAL_STATUSES[route.id] === "project"),
    [routes],
  );
  const stats = useOrderedProfileStats();
  const featuredStats = stats.slice(0, 3);
  const handleRoutePress = useCallback(
    (route: RecommendedRoute) => {
      router.push({
        pathname: "/(tabs)/discover/routes/[routeId]",
        params: { routeId: route.id },
      });
    },
    [router],
  );
  const handleSavedRoutesPress = useCallback(() => {
    router.push({
      pathname: "/(tabs)/discover",
      params: {
        openSavedRoutes: "1",
        requestId: Date.now().toString(),
      },
    });
  }, [router]);
  const xpProgress = Math.round((profileData.user.xp / profileData.user.nextLevelXp) * 100);
  const xpToNextLevel = profileData.user.nextLevelXp - profileData.user.xp;

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 96, 124) }}
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-5 px-4 pt-4">
        <ProfileSummary />

        <ProfileProgressCard
          progress={xpProgress}
          xpToNextLevel={xpToNextLevel}
          stats={featuredStats}
          weeklyActivity={profileData.weeklyActivity as WeeklyActivity[]}
          onViewAllStats={() => router.push("/(tabs)/profile/stats")}
        />

        <SavedRoutesSection
          routes={savedRoutes}
          onActionPress={handleSavedRoutesPress}
          onRoutePress={handleRoutePress}
        />

        <RecentActivitySection
          activities={(profileData.recentActivity as RecentActivity[]).slice(0, 3)}
          routes={routes}
          onViewAll={() => router.push("/(tabs)/profile/activity")}
        />
      </View>
    </ScrollView>
  );
}

function ProfileSummary() {
  const { user } = profileData;

  return (
    <View className="flex-row items-center gap-4">
      <View>
        <Avatar
          alt={`Avatar ${user.displayName}`}
          className="size-[72px] border border-primary bg-muted"
        >
          <AvatarFallback className="bg-muted">
            <Text className="text-[20px] font-bold text-foreground">{user.initials}</Text>
          </AvatarFallback>
        </Avatar>
        <View className="absolute -bottom-1 right-0 rounded-md border border-card bg-primary px-1.5 py-0.5">
          <Text className="text-[10px] font-bold leading-3 text-primary-foreground">
            POZ. {user.level}
          </Text>
        </View>
      </View>

      <View className="min-w-0 flex-1">
        <Text className="text-[24px] font-extrabold leading-8 text-foreground" numberOfLines={1}>
          {user.displayName}
        </Text>
        <Text
          className="text-[13px] font-semibold leading-5 text-muted-foreground"
          numberOfLines={1}
        >
          {user.rankLabel}
        </Text>
        <View className="min-w-0 flex-row items-center gap-1.5 pt-0.5">
          <Icon as={Building2} size={14} className="text-muted-foreground" strokeWidth={2.2} />
          <Text
            className="min-w-0 flex-1 text-[12px] leading-4 text-muted-foreground"
            numberOfLines={1}
          >
            {user.city} · {user.homeGym}
          </Text>
        </View>
      </View>

      <Pressable className="h-10 w-10 items-center justify-center rounded-lg border border-border bg-card active:bg-muted/70">
        <Icon as={Settings} size={19} className="text-foreground" strokeWidth={2.2} />
      </Pressable>
    </View>
  );
}

function ProfileProgressCard({
  progress,
  xpToNextLevel,
  stats,
  weeklyActivity,
  onViewAllStats,
}: {
  progress: number;
  xpToNextLevel: number;
  stats: readonly ProfileStat[];
  weeklyActivity: readonly WeeklyActivity[];
  onViewAllStats: () => void;
}) {
  const { user } = profileData;
  const weeklyTotal = weeklyActivity.reduce((total, day) => total + day.value, 0);

  return (
    <View className="gap-5">
      <View className="gap-3">
        <View className="flex-row items-end justify-between gap-3">
          <View className="min-w-0 flex-1">
            <Text className="text-[11px] font-bold leading-4 text-muted-foreground">
              Postęp do poziomu {user.level + 1}
            </Text>
            <View className="flex-row items-end gap-1">
              <Text className="text-[24px] font-extrabold leading-8 text-foreground">
                {user.xp}
              </Text>
              <Text className="pb-1 text-[14px] font-semibold leading-5 text-muted-foreground">
                / {user.nextLevelXp} XP
              </Text>
            </View>
          </View>
          <Text className="text-[14px] font-bold leading-5 text-primary">{progress}%</Text>
        </View>

        <View className="gap-2">
          <Progress value={progress} className="h-2.5 bg-muted" indicatorClassName="bg-primary" />
          <Text className="text-[12px] leading-4 text-muted-foreground" numberOfLines={1}>
            {xpToNextLevel} XP do kolejnego poziomu
          </Text>
        </View>
      </View>

      <View className="gap-3">
        <View className="flex-row items-center justify-between gap-3">
          <Text className="text-[18px] font-semibold leading-6 text-foreground">
            Wyróżnione statystyki
          </Text>
          <Pressable
            onPress={onViewAllStats}
            className="h-10 flex-row items-center gap-1.5 rounded-md px-2 active:bg-muted/70"
          >
            <Text className="text-sm font-semibold leading-5 text-foreground">Wszystkie</Text>
            <Icon as={ChevronRight} size={15} className="text-muted-foreground" strokeWidth={2.5} />
          </Pressable>
        </View>
        <FeaturedStatsGrid stats={stats} />
      </View>

      <WeeklyRecapSection weeklyActivity={weeklyActivity} weeklyTotal={weeklyTotal} />
    </View>
  );
}

function FeaturedStatsGrid({ stats }: { stats: readonly ProfileStat[] }) {
  const [primaryStat, ...secondaryStats] = stats;

  if (!primaryStat) {
    return null;
  }

  return (
    <View className="gap-2">
      <FeaturedStatCard stat={primaryStat} variant="primary" />
      <View className="flex-row gap-2">
        {secondaryStats.slice(0, 2).map((stat) => (
          <FeaturedStatCard key={stat.id} stat={stat} variant="secondary" />
        ))}
      </View>
    </View>
  );
}

function FeaturedStatCard({
  stat,
  variant,
}: {
  stat: ProfileStat;
  variant: "primary" | "secondary";
}) {
  const StatIcon = PROFILE_STAT_ICON_MAP[stat.iconName];
  const label = getProfileStatLabel(stat);
  const isPrimary = variant === "primary";
  const levelProgress = getStatLevelProgress(stat);
  const gradeSummary = stat.id === "max-grade" ? getGradeSummary(stat) : null;
  const previewGradeLevels = gradeSummary ? getPreviewGradeLevels(gradeSummary.levels) : [];

  return (
    <View
      className={cn(
        "min-w-0 justify-between rounded-lg border border-border/70 bg-card shadow-sm",
        isPrimary ? "min-h-[132px] p-4" : "min-h-[116px] flex-1 p-3",
      )}
    >
      <View className="flex-row items-start justify-between gap-3">
        <View className="min-w-0 flex-1">
          <Text
            className={cn(
              "font-bold text-muted-foreground",
              isPrimary ? "text-[12px] leading-4" : "text-[11px] leading-4",
            )}
            numberOfLines={1}
          >
            {label}
          </Text>
          <Text
            className={cn(
              "font-extrabold text-foreground",
              isPrimary ? "text-[34px] leading-10" : "text-[24px] leading-8",
            )}
            numberOfLines={1}
          >
            {stat.value}
          </Text>
        </View>
        <View
          className={cn(
            "items-center justify-center rounded-lg bg-muted",
            isPrimary ? "h-12 w-12" : "h-9 w-9",
          )}
        >
          <Icon
            as={StatIcon}
            size={isPrimary ? 22 : 17}
            className="text-primary"
            strokeWidth={2.3}
          />
        </View>
      </View>
      {gradeSummary ? (
        <View className={cn("gap-2", isPrimary ? "mt-3" : "mt-2")}>
          <View className="flex-row items-center justify-between gap-2">
            <Text
              className={cn(
                "font-bold text-primary",
                isPrimary ? "text-[12px] leading-4" : "text-[11px] leading-4",
              )}
              numberOfLines={1}
            >
              {gradeSummary.currentLevelLabel}
            </Text>
            <Text
              className="text-[11px] font-semibold leading-4 text-muted-foreground"
              numberOfLines={1}
            >
              {gradeSummary.nextLabel ? `Cel ${gradeSummary.nextLabel}` : "Najwyższy próg"}
            </Text>
          </View>
          <View className="flex-row gap-1">
            {previewGradeLevels.map((level) => {
              const isCurrent = level.threshold === gradeSummary.currentThreshold;
              const isCompleted = level.threshold < gradeSummary.currentThreshold;

              return (
                <View
                  key={`${level.level}-${level.label}`}
                  className={cn(
                    "h-6 flex-1 items-center justify-center rounded-md border px-1",
                    isCurrent
                      ? "border-primary bg-primary"
                      : isCompleted
                        ? "border-primary/40 bg-primary/10"
                        : "border-border bg-muted/60",
                  )}
                >
                  <Text
                    className={cn(
                      "text-[10px] font-extrabold leading-3",
                      isCurrent ? "text-primary-foreground" : "text-foreground",
                    )}
                    numberOfLines={1}
                  >
                    {level.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      ) : levelProgress ? (
        <View className={cn("gap-1.5", isPrimary ? "mt-3" : "mt-2")}>
          <View className="flex-row items-center justify-between gap-2">
            <Text
              className={cn(
                "font-bold text-primary",
                isPrimary ? "text-[12px] leading-4" : "text-[11px] leading-4",
              )}
              numberOfLines={1}
            >
              {levelProgress.levelLabel}
            </Text>
            <Text
              className="text-[11px] font-semibold leading-4 text-muted-foreground"
              numberOfLines={1}
            >
              {levelProgress.progress}%
            </Text>
          </View>
          <Progress
            value={levelProgress.progress}
            className="h-1.5 bg-muted"
            indicatorClassName="bg-primary"
          />
          <Text className="text-[11px] leading-4 text-muted-foreground" numberOfLines={1}>
            {levelProgress.nextLabel}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

function getPreviewGradeLevels<TLevel>(levels: readonly TLevel[]) {
  return levels.slice(0, 4);
}

function WeeklyRecapSection({
  weeklyActivity,
  weeklyTotal,
}: {
  weeklyActivity: readonly WeeklyActivity[];
  weeklyTotal: number;
}) {
  const maxActivityValue = Math.max(...weeklyActivity.map((day) => day.value), 1);
  const routeLabel = weeklyTotal === 1 ? "trasa" : weeklyTotal < 5 ? "trasy" : "tras";

  return (
    <View className="gap-4">
      <View className="flex-row items-end justify-between gap-4">
        <View className="min-w-0 flex-1">
          <Text className="text-[18px] font-semibold leading-6 text-foreground">
            Podsumowanie tygodnia
          </Text>
          <Text className="mt-1 text-[13px] leading-5 text-muted-foreground">
            Liczba zaliczonych tras dziennie
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-[28px] font-extrabold leading-8 text-foreground">
            {weeklyTotal}
          </Text>
          <Text className="text-[11px] font-bold leading-4 text-muted-foreground">
            {routeLabel}
          </Text>
        </View>
      </View>

      <View className="h-[140px] flex-row items-end justify-between gap-2">
        {weeklyActivity.map((day) => (
          <WeeklyRecapBar key={day.id} day={day} maxValue={maxActivityValue} />
        ))}
      </View>
    </View>
  );
}

function WeeklyRecapBar({ day, maxValue }: { day: WeeklyActivity; maxValue: number }) {
  const barHeight = day.value > 0 ? Math.max(14, Math.round((day.value / maxValue) * 96)) : 4;

  return (
    <View className="h-full min-w-0 flex-1 items-center justify-end gap-1.5">
      <View className="h-5 items-center justify-center">
        {day.value > 0 ? (
          <Text className="text-[10px] font-extrabold leading-3 text-foreground">{day.value}</Text>
        ) : null}
      </View>
      <View className="h-[100px] w-full max-w-10 justify-end rounded-md bg-muted">
        <View
          className={cn("w-full rounded-md", day.value > 0 ? "bg-primary" : "bg-border")}
          style={{ height: barHeight, opacity: day.value > 0 && !day.isToday ? 0.58 : 1 }}
        />
      </View>
      <Text
        className={cn(
          "text-[10px] font-bold leading-3",
          day.isToday ? "text-primary" : "text-muted-foreground",
        )}
      >
        {day.label}
      </Text>
    </View>
  );
}

function SavedRoutesSection({
  routes,
  onActionPress,
  onRoutePress,
}: {
  routes: readonly RecommendedRoute[];
  onActionPress: () => void;
  onRoutePress: (route: RecommendedRoute) => void;
}) {
  if (routes.length === 0) {
    return null;
  }

  return (
    <HorizontalScrollSection
      title="Zapisane trasy"
      description="Drogi, do których chcesz wrócić przy kolejnej sesji"
      items={routes}
      keyExtractor={(route) => route.id}
      renderItem={(route) => (
        <RecommendedRouteCard route={route} onPress={() => onRoutePress(route)} />
      )}
      actionLabel="Wszystkie zapisane trasy"
      onActionPress={onActionPress}
    />
  );
}

function RecentActivitySection({
  activities,
  routes,
  onViewAll,
}: {
  activities: readonly RecentActivity[];
  routes: readonly RecommendedRoute[];
  onViewAll: () => void;
}) {
  const routesById = useMemo(() => new Map(routes.map((route) => [route.id, route])), [routes]);
  const routesByName = useMemo(
    () => new Map(routes.map((route) => [route.name.toLowerCase(), route])),
    [routes],
  );

  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between gap-3">
        <SectionTitle title="Ostatnia aktywność" />
        <Pressable
          onPress={onViewAll}
          className="h-10 flex-row items-center gap-1.5 rounded-md px-2 active:bg-muted/70"
        >
          <Text className="text-sm font-semibold leading-5 text-foreground">Wszystkie</Text>
          <Icon as={ChevronRight} size={15} className="text-muted-foreground" strokeWidth={2.5} />
        </Pressable>
      </View>
      <View className="gap-3">
        {activities.map((activity, index) => (
          <ActivityHistoryCard
            key={activity.id}
            activity={activity}
            route={getActivityRoute(activity, routesById, routesByName)}
            isLatest={index === 0}
          />
        ))}
      </View>
    </View>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <Text className="text-[18px] font-semibold leading-6 text-foreground">{title}</Text>;
}
