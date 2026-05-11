import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import type { Challenge, ChallengeIconName } from "@/src/types/discover";
import {
  CalendarClock,
  Flame,
  Mountain,
  Repeat2,
  Sparkles,
  Star,
  Trophy,
  Zap,
  type LucideIcon,
} from "lucide-react-native";
import { Pressable, View } from "react-native";

const CHALLENGE_ICON_MAP: Record<ChallengeIconName, LucideIcon> = {
  flame: Flame,
  mountain: Mountain,
  repeat: Repeat2,
  sparkles: Sparkles,
  star: Star,
  zap: Zap,
};

type ChallengeCardProps = {
  challenge: Challenge;
  className?: string;
  containerClassName?: string;
  onPress?: () => void;
};

export function ChallengeCard({
  challenge,
  className,
  containerClassName,
  onPress,
}: ChallengeCardProps) {
  const progress = Math.round(challenge.progress);

  return (
    <Pressable className={cn("active:opacity-95", containerClassName)} onPress={onPress}>
      <Card
        className={cn(
          "h-[154px] w-full overflow-hidden rounded-xl border-border/70 bg-card p-4 shadow-sm",
          className,
        )}
      >
        <View className="flex-1 justify-between gap-3">
          <View className="min-h-11 flex-row items-start gap-3">
            <ChallengeIcon challenge={challenge} />

            <View className="min-w-0 flex-1 justify-center pt-0.5">
              <ChallengeCardHeader challenge={challenge} />
            </View>
          </View>

          <View className="min-h-6 flex-row items-center justify-between gap-3">
            <ChallengeMeta icon={CalendarClock} label={challenge.expiresLabel ?? "Aktywne teraz"} />
            <ChallengeReward rewardXp={challenge.rewardXp} />
          </View>

          <View className="gap-2">
            <View className="flex-row items-center justify-between">
              <Text
                className="mr-3 min-w-0 flex-1 text-[12px] leading-4 text-muted-foreground"
                numberOfLines={1}
              >
                {challenge.progressLabel}
              </Text>
              <Text className="text-[13px] font-extrabold leading-4 text-foreground">
                {progress}%
              </Text>
            </View>
            <Progress
              value={challenge.progress}
              className="h-2 rounded-full bg-muted"
              indicatorClassName="bg-primary"
            />
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

function ChallengeIcon({ challenge }: ChallengeCardProps) {
  const icon = CHALLENGE_ICON_MAP[challenge.iconName];

  return (
    <View className="h-11 w-11 items-center justify-center rounded-xl border border-border/80 bg-background shadow-sm">
      <Icon as={icon} size={22} className="text-primary" strokeWidth={2.4} />
    </View>
  );
}

function ChallengeCardHeader({ challenge }: ChallengeCardProps) {
  return (
    <View className="justify-center">
      <Text className="text-[15px] font-bold leading-5 text-foreground" numberOfLines={2}>
        {challenge.title}
      </Text>
    </View>
  );
}

function ChallengeMeta({ icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <View className="min-w-0 flex-1 flex-row items-center gap-1.5">
      <Icon as={icon} size={14} className="text-muted-foreground" strokeWidth={2.3} />
      <Text
        className="min-w-0 flex-1 text-[12px] font-semibold leading-4 text-muted-foreground"
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

function ChallengeReward({ rewardXp }: { rewardXp: number }) {
  return (
    <View className="shrink-0 flex-row items-center gap-1 rounded-lg bg-primary/10 px-2 py-1">
      <Icon as={Trophy} size={11} className="text-primary" strokeWidth={2.5} />
      <Text className="text-[11px] font-bold leading-4 text-primary">+{rewardXp} XP</Text>
    </View>
  );
}

export function ChallengeCardSkeleton({
  className,
  containerClassName,
}: {
  className?: string;
  containerClassName?: string;
}) {
  return (
    <View className={containerClassName}>
      <Card
        className={cn(
          "h-[154px] w-full overflow-hidden rounded-xl border-border/70 bg-card p-4 shadow-sm",
          className,
        )}
      >
        <View className="flex-1 justify-between gap-3">
          <View className="min-h-11 flex-row items-start gap-3">
            <Skeleton className="h-11 w-11 rounded-xl" />

            <View className="min-w-0 flex-1 justify-center gap-1 pt-0.5">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </View>
          </View>

          <View className="min-h-6 flex-row items-center justify-between gap-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-16 rounded-lg" />
          </View>

          <View className="gap-2">
            <View className="flex-row items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-8" />
            </View>
            <Skeleton className="h-2 w-full rounded-full" />
          </View>
        </View>
      </Card>
    </View>
  );
}
