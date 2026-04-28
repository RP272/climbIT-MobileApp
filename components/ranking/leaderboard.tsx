import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { Award, Medal, Trophy } from "lucide-react-native";
import { Pressable, View } from "react-native";

export type LeaderboardEntry = {
  id: string;
  name: string;
  points: number;
  avatarUrl: string;
};

type LeaderboardProps = {
  title: string;
  description: string;
  entries: LeaderboardEntry[];
  previewCount?: number;
  mode?: "preview" | "full";
  onExpandPress?: () => void;
  onEntryPress?: (entry: LeaderboardEntry, rank: number) => void;
  showHeader?: boolean;
  className?: string;
};

const TILE_COLORS = ["#BAE6FD", "#BBF7D0", "#FEF08A", "#FECACA", "#DDD6FE"] as const;

export function Leaderboard({
  title,
  description,
  entries,
  previewCount = 5,
  mode = "preview",
  onExpandPress,
  onEntryPress,
  showHeader = true,
  className,
}: LeaderboardProps) {
  const sortedEntries = [...entries].sort((a, b) => b.points - a.points);
  const visibleEntries = mode === "preview" ? sortedEntries.slice(0, previewCount) : sortedEntries;
  const hasExpandAction =
    mode === "preview" && sortedEntries.length > previewCount && Boolean(onExpandPress);

  return (
    <View className={cn("gap-4", className)}>
      {showHeader ? (
        <View className="gap-1">
          <Text className="text-[22px] font-semibold text-foreground">{title}</Text>
          <Text className="text-[14px] text-muted-foreground">{description}</Text>
        </View>
      ) : null}

      <View className="gap-2.5">
        {visibleEntries.map((entry, index) => {
          const rank = index + 1;
          const tileColor = TILE_COLORS[index % TILE_COLORS.length];

          return (
            <LeaderboardRow
              key={entry.id}
              entry={entry}
              rank={rank}
              backgroundColor={tileColor}
              mode={mode}
              onPress={onEntryPress}
            />
          );
        })}
      </View>

      {hasExpandAction ? (
        <Button onPress={onExpandPress} className="h-11 w-[87%] self-center rounded-2xl">
          <Text>Zobacz wszystkich ({sortedEntries.length})</Text>
        </Button>
      ) : null}
    </View>
  );
}

function LeaderboardRow({
  entry,
  rank,
  backgroundColor,
  mode,
  onPress,
}: {
  entry: LeaderboardEntry;
  rank: number;
  backgroundColor: string;
  mode: "preview" | "full";
  onPress?: (entry: LeaderboardEntry, rank: number) => void;
}) {
  const avatarAlt = `Avatar ${entry.name}`;
  const sizeClassName = rank <= 3 ? "px-3.5 py-3" : "px-3 py-2.5";
  const avatarSizeClassName =
    rank === 1
      ? "h-11 w-11"
      : rank === 2
        ? "h-[42px] w-[42px]"
        : rank === 3
          ? "h-10 w-10"
          : "h-10 w-10";
  const rowWidthClassName =
    mode === "preview"
      ? rank === 1
        ? "w-full"
        : rank === 2
          ? "w-[90%] self-center"
          : rank === 3
            ? "w-[89%] self-center"
            : rank === 4
              ? "w-[88%] self-center"
              : "w-[87%] self-center"
      : "w-full";

  return (
    <Pressable
      onPress={() => onPress?.(entry, rank)}
      className={cn(
        "flex-row items-center gap-3 rounded-2xl border border-white/70 active:opacity-90",
        sizeClassName,
        rowWidthClassName,
      )}
      style={{ backgroundColor }}
    >
      <View className="h-8 w-8 items-center justify-center rounded-full bg-white/75">
        <Text className="text-[13px] font-semibold text-foreground">#{rank}</Text>
      </View>

      <Avatar alt={avatarAlt} className={cn("border border-white/70", avatarSizeClassName)}>
        <AvatarImage source={{ uri: entry.avatarUrl }} />
        <AvatarFallback>
          <Text className="text-xs font-semibold text-foreground">{entry.name.slice(0, 1)}</Text>
        </AvatarFallback>
      </Avatar>

      <View className="flex-1">
        <Text className="text-[15px] font-semibold text-foreground">{entry.name}</Text>
      </View>

      <View className="items-end">
        <Text className="text-[14px] font-semibold text-foreground">{entry.points}</Text>
        <Text className="text-[11px] text-foreground/70">punktow</Text>
      </View>
    </Pressable>
  );
}

function LeaderboardMedal({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <View className="h-7 w-7 items-center justify-center rounded-full bg-white/80">
        <Icon as={Trophy} size={15} className="text-amber-500" strokeWidth={2.5} />
      </View>
    );
  }

  if (rank === 2) {
    return (
      <View className="h-7 w-7 items-center justify-center rounded-full bg-white/80">
        <Icon as={Medal} size={15} className="text-violet-500" strokeWidth={2.5} />
      </View>
    );
  }

  return (
    <View className="h-7 w-7 items-center justify-center rounded-full bg-white/80">
      <Icon as={Award} size={15} className="text-rose-500" strokeWidth={2.5} />
    </View>
  );
}
