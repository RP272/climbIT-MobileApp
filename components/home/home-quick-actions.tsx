import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { Camera, Map, Trophy, TvMinimalPlay, type LucideIcon } from "lucide-react-native";
import { Pressable, View } from "react-native";

type QuickAction = {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  tone: "primary" | "amber" | "violet";
  onPress: () => void;
};

type HomeQuickActionsProps = {
  onRecordPress: () => void;
  onWatchPress: () => void;
  onRankingPress: () => void;
  onDiscoverPress: () => void;
};

const TONE_STYLES = {
  primary: {
    card: "border-primary/25 bg-primary/10",
    iconWrap: "bg-primary",
    icon: "text-primary-foreground",
  },
  amber: {
    card: "border-amber-500/25 bg-amber-500/10",
    iconWrap: "bg-amber-500",
    icon: "text-white",
  },
  violet: {
    card: "border-violet-500/25 bg-violet-500/10",
    iconWrap: "bg-violet-600",
    icon: "text-white",
  },
} as const;

function QuickActionCard({ action }: { action: QuickAction }) {
  const tone = TONE_STYLES[action.tone];

  return (
    <Pressable
      onPress={action.onPress}
      className={cn("min-w-[148px] flex-1 rounded-2xl border p-3 active:opacity-90", tone.card)}
    >
      <View className={cn("mb-3 h-10 w-10 items-center justify-center rounded-xl", tone.iconWrap)}>
        <Icon as={action.icon} size={20} className={tone.icon} strokeWidth={2.3} />
      </View>
      <Text className="text-sm font-bold text-foreground">{action.label}</Text>
      <Text className="mt-0.5 text-[11px] leading-4 text-muted-foreground">
        {action.description}
      </Text>
    </Pressable>
  );
}

export function HomeQuickActions({
  onRecordPress,
  onWatchPress,
  onRankingPress,
  onDiscoverPress,
}: HomeQuickActionsProps) {
  const actions: QuickAction[] = [
    {
      id: "record",
      label: "Nagraj klip",
      description: "Udostępnij przejście",
      icon: Camera,
      tone: "primary",
      onPress: onRecordPress,
    },
    {
      id: "ranking",
      label: "Ranking",
      description: "Zobacz podium",
      icon: Trophy,
      tone: "amber",
      onPress: onRankingPress,
    },
    {
      id: "discover",
      label: "Odkryj",
      description: "Ścianki i trasy",
      icon: Map,
      tone: "violet",
      onPress: onDiscoverPress,
    },
  ];

  return (
    <View className="gap-3">
      <View className="flex-row gap-2">
        {actions.map((action) => (
          <QuickActionCard key={action.id} action={action} />
        ))}
      </View>

      <Pressable
        onPress={onWatchPress}
        className="flex-row items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 active:opacity-90"
      >
        <View className="flex-row items-center gap-3">
          <View className="h-10 w-10 items-center justify-center rounded-xl bg-foreground">
            <Icon as={TvMinimalPlay} size={18} className="text-background" strokeWidth={2.3} />
          </View>
          <View>
            <Text className="text-sm font-bold text-foreground">Przeglądaj reelsy</Text>
            <Text className="text-xs text-muted-foreground">
              Ostatnie przejścia ze społeczności
            </Text>
          </View>
        </View>
        <Text className="text-xs font-semibold text-primary">Otwórz</Text>
      </Pressable>
    </View>
  );
}
