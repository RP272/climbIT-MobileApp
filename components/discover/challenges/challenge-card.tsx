import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import type { Challenge, ChallengeIconName, ChallengeTone } from "@/src/types/discover";
import {
  Flame,
  Mountain,
  Repeat2,
  Sparkles,
  Star,
  Zap,
  type LucideIcon,
} from "lucide-react-native";
import { Pressable, View } from "react-native";

type ToneStyles = {
  icon: string;
  iconWrap: string;
  progress: string;
  reward: string;
  rewardPill: string;
};

const TONE_STYLES: Record<ChallengeTone, ToneStyles> = {
  primary: {
    icon: "text-primary",
    iconWrap: "border-primary/20 bg-primary/10",
    progress: "bg-primary",
    reward: "text-primary",
    rewardPill: "bg-primary/10",
  },
  cyan: {
    icon: "text-cyan-600 dark:text-cyan-300",
    iconWrap: "border-cyan-500/20 bg-cyan-500/10",
    progress: "bg-cyan-500",
    reward: "text-cyan-600 dark:text-cyan-300",
    rewardPill: "bg-cyan-500/10",
  },
  amber: {
    icon: "text-amber-600 dark:text-amber-300",
    iconWrap: "border-amber-500/20 bg-amber-500/10",
    progress: "bg-amber-500",
    reward: "text-amber-600 dark:text-amber-300",
    rewardPill: "bg-amber-500/10",
  },
  rose: {
    icon: "text-rose-600 dark:text-rose-300",
    iconWrap: "border-rose-500/20 bg-rose-500/10",
    progress: "bg-rose-500",
    reward: "text-rose-600 dark:text-rose-300",
    rewardPill: "bg-rose-500/10",
  },
  sky: {
    icon: "text-sky-600 dark:text-sky-300",
    iconWrap: "border-sky-500/20 bg-sky-500/10",
    progress: "bg-sky-500",
    reward: "text-sky-600 dark:text-sky-300",
    rewardPill: "bg-sky-500/10",
  },
  emerald: {
    icon: "text-emerald-600 dark:text-emerald-300",
    iconWrap: "border-emerald-500/20 bg-emerald-500/10",
    progress: "bg-emerald-500",
    reward: "text-emerald-600 dark:text-emerald-300",
    rewardPill: "bg-emerald-500/10",
  },
};

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
};

export function ChallengeCard({ challenge, className }: ChallengeCardProps) {
  const tone = TONE_STYLES[challenge.tone];

  return (
    <Pressable className="active:opacity-95">
      <Card
        className={cn(
          "h-[112px] gap-0 rounded-[22px] border-border/60 bg-card px-3 py-3 shadow-sm shadow-black/5",
          className,
        )}
      >
        <View className="flex-1 flex-row items-center gap-3">
          <ChallengeIcon challenge={challenge} tone={tone} />

          <View className="min-w-0 flex-1 gap-2">
            <ChallengeCardHeader challenge={challenge} tone={tone} />

            <Progress
              value={challenge.progress}
              className="h-2 rounded-full bg-muted/80"
              indicatorClassName={tone.progress}
            />

            <Text numberOfLines={1} className="text-[12px] leading-4 text-muted-foreground">
              {challenge.progressLabel}
            </Text>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

function ChallengeIcon({ challenge, tone }: ChallengeCardProps & { tone: ToneStyles }) {
  const icon = CHALLENGE_ICON_MAP[challenge.iconName];

  return (
    <View
      className={cn("h-11 w-11 items-center justify-center rounded-full border", tone.iconWrap)}
    >
      <Icon as={icon} size={22} className={tone.icon} strokeWidth={2.5} />
    </View>
  );
}

function ChallengeCardHeader({ challenge, tone }: ChallengeCardProps & { tone: ToneStyles }) {
  return (
    <View className="flex-row items-start justify-between gap-2">
      <Text
        numberOfLines={1}
        className="min-w-0 flex-1 text-[15px] font-semibold leading-5 text-foreground"
      >
        {challenge.title}
      </Text>

      <View className={cn("rounded-full px-2 py-1", tone.rewardPill)}>
        <Text className={cn("text-[11px] font-bold leading-4", tone.reward)}>
          +{challenge.rewardXp} XP
        </Text>
      </View>
    </View>
  );
}

export function ChallengeCardSkeleton() {
  return (
    <Card className="h-[112px] gap-0 rounded-[22px] border-border/60 bg-card px-3 py-3 shadow-sm shadow-black/5">
      <View className="flex-1 flex-row items-center gap-3">
        <Skeleton className="h-11 w-11 rounded-full" />

        <View className="min-w-0 flex-1 gap-2">
          <View className="flex-row items-start justify-between gap-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </View>

          <Skeleton className="h-2 w-full rounded-full" />
          <Skeleton className="h-4 w-32" />
        </View>
      </View>
    </Card>
  );
}
