import { Icon } from "@/components/ui/icon";
import { Progress } from "@/components/ui/progress";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import {
  setProfileStatsOrder,
  useOrderedProfileStats,
  type ProfileStat,
} from "@/src/features/profile/profile-stats.store";
import { PROFILE_STAT_ICON_MAP } from "@/src/features/profile/profile-stats.icons";
import {
  getGradeSummary,
  getProfileStatLabel,
  getStatLevelProgress,
} from "@/src/features/profile/profile-stats.utils";
import { Grip } from "lucide-react-native";
import { useCallback, type ReactNode } from "react";
import { Pressable, View } from "react-native";
import DraggableFlatList, {
  ScaleDecorator,
  type RenderItemParams,
} from "react-native-draggable-flatlist";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const stats = useOrderedProfileStats();
  const renderItem = useCallback(({ item, drag, isActive }: RenderItemParams<ProfileStat>) => {
    return (
      <ScaleDecorator>
        <StatCard stat={item} onDrag={drag} isDragging={isActive} />
      </ScaleDecorator>
    );
  }, []);

  return (
    <DraggableFlatList
      data={stats}
      keyExtractor={(stat) => stat.id}
      renderItem={renderItem}
      ListHeaderComponent={<StatsListHeader />}
      ItemSeparatorComponent={StatsListGap}
      onDragEnd={({ data }) => setProfileStatsOrder(data)}
      activationDistance={8}
      autoscrollThreshold={96}
      autoscrollSpeed={90}
      containerStyle={{ flex: 1 }}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: Math.max(insets.bottom + 96, 124),
      }}
      showsVerticalScrollIndicator={false}
    />
  );
}

function StatsListHeader() {
  return (
    <View className="pb-3">
      <Text className="text-[12px] leading-4 text-muted-foreground">
        Pierwsze 3 statystyki z listy są widoczne na profilu.
      </Text>
    </View>
  );
}

function StatsListGap() {
  return <View className="h-3" />;
}

function StatCard({
  stat,
  onDrag,
  isDragging,
}: {
  stat: ProfileStat;
  onDrag: () => void;
  isDragging: boolean;
}) {
  if (stat.id === "max-grade") {
    return <MaxGradeCard stat={stat} onDrag={onDrag} isDragging={isDragging} />;
  }

  const levelProgress = getStatLevelProgress(stat);

  return (
    <StatsCardShell onDrag={onDrag} isDragging={isDragging}>
      <StatCardHeader stat={stat} valueClassName="text-[20px] leading-7" />
      {levelProgress ? (
        <View className="gap-1.5">
          <Progress
            value={levelProgress.progress}
            className="h-2 bg-muted"
            indicatorClassName="bg-primary"
          />
          <View className="flex-row items-center justify-between gap-3">
            <Text className="min-w-0 flex-1 text-[11px] leading-4 text-muted-foreground">
              {levelProgress.levelLabel} · {levelProgress.nextLabel}
            </Text>
            <Text className="text-[11px] font-semibold leading-4 text-muted-foreground">
              {levelProgress.progress}%
            </Text>
          </View>
        </View>
      ) : null}
    </StatsCardShell>
  );
}

function MaxGradeCard({
  stat,
  onDrag,
  isDragging,
}: {
  stat: ProfileStat;
  onDrag: () => void;
  isDragging: boolean;
}) {
  const summary = getGradeSummary(stat);

  return (
    <StatsCardShell onDrag={onDrag} isDragging={isDragging} className="gap-4">
      <StatCardHeader
        stat={stat}
        description="Najmocniejsze przejście w profilu"
        iconTone="primary"
        valueClassName="text-[24px] leading-8"
      />
      <View className="gap-2">
        <View className="flex-row items-center justify-between gap-3">
          <Text className="text-[11px] font-semibold leading-4 text-muted-foreground">
            {summary.currentLevelLabel}
          </Text>
          {summary.nextLabel ? (
            <Text className="text-[11px] font-semibold leading-4 text-muted-foreground">
              Następny cel: {summary.nextLabel}
            </Text>
          ) : (
            <Text className="text-[11px] font-semibold leading-4 text-muted-foreground">
              Najwyższy próg
            </Text>
          )}
        </View>

        <View className="flex-row gap-1.5">
          {summary.levels.map((level) => {
            const isCurrent = level.threshold === summary.currentThreshold;
            const isCompleted = level.threshold < summary.currentThreshold;

            return (
              <View
                key={`${level.level}-${level.label}`}
                className={[
                  "min-h-10 flex-1 items-center justify-center rounded-md border px-1.5",
                  isCurrent
                    ? "border-primary bg-primary"
                    : isCompleted
                      ? "border-primary/40 bg-primary/10"
                      : "border-border bg-muted/60",
                ].join(" ")}
              >
                <Text
                  className={[
                    "text-[11px] font-extrabold leading-4",
                    isCurrent ? "text-primary-foreground" : "text-foreground",
                  ].join(" ")}
                  numberOfLines={1}
                >
                  {level.label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </StatsCardShell>
  );
}

function StatsCardShell({
  children,
  className,
  isDragging,
  onDrag,
}: {
  children: ReactNode;
  className?: string;
  isDragging: boolean;
  onDrag: () => void;
}) {
  return (
    <View
      className={cn(
        "relative gap-3 rounded-lg border bg-card px-4 py-3.5 shadow-sm",
        isDragging ? "border-primary/60" : "border-border/70",
        className,
      )}
    >
      <DragHandle onDrag={onDrag} isDragging={isDragging} />
      {children}
    </View>
  );
}

function StatCardHeader({
  stat,
  description = stat.description,
  iconTone = "muted",
  valueClassName,
}: {
  stat: ProfileStat;
  description?: string;
  iconTone?: "muted" | "primary";
  valueClassName: string;
}) {
  const StatIcon = PROFILE_STAT_ICON_MAP[stat.iconName];
  const iconClassName = iconTone === "primary" ? "text-primary-foreground" : "text-primary";

  return (
    <View className="flex-row items-center gap-3 pr-6">
      <View
        className={cn(
          "h-10 w-10 items-center justify-center rounded-lg",
          iconTone === "primary" ? "bg-primary" : "bg-muted",
        )}
      >
        <Icon as={StatIcon} size={19} className={iconClassName} strokeWidth={2.3} />
      </View>
      <View className="min-w-0 flex-1">
        <Text className="text-[14px] font-bold leading-5 text-foreground" numberOfLines={1}>
          {getProfileStatLabel(stat)}
        </Text>
        <Text className="text-[12px] leading-4 text-muted-foreground" numberOfLines={1}>
          {description}
        </Text>
      </View>
      <View className="items-end">
        <Text className={cn("font-extrabold text-foreground", valueClassName)} numberOfLines={1}>
          {stat.value}
        </Text>
      </View>
    </View>
  );
}

function DragHandle({ onDrag, isDragging }: { onDrag: () => void; isDragging: boolean }) {
  return (
    <Pressable
      onLongPress={onDrag}
      delayLongPress={120}
      disabled={isDragging}
      style={{ position: "absolute", right: 1, top: 1, zIndex: 10 }}
      className="h-9 w-9 items-center justify-center"
    >
      <Icon as={Grip} size={17} className="text-muted-foreground" strokeWidth={2.4} />
    </Pressable>
  );
}
