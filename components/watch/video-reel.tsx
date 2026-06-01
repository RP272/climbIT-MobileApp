import type { WatchReel } from "@/src/types/watch";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { ApiError } from "@/src/api/client";
import { cn } from "@/lib/utils";
import { useClimbAttemptUserVote } from "@/src/features/watch/hooks/useClimbAttemptUserVote";
import { useVoteOnClimbAttempt } from "@/src/features/watch/hooks/useVoteOnClimbAttempt";
import {
  applyVoteCountsOptimistic,
  getVoteCountsFromAttempt,
  type VoteCounts,
  type VoteState,
} from "@/src/features/watch/utils/vote.utils";
import { useVideoPlayer, VideoView, type VideoPlayerStatus } from "expo-video";
import { ActivityIndicator, Alert, Pressable, View, useWindowDimensions } from "react-native";
import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react-native";
import {
  BadgeCheck,
  Clock,
  MapPin,
  Mountain,
  ThumbsDown,
  ThumbsUp,
  Timer,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function formatCount(value: number) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
  }

  return `${value}`;
}

type VoteButtonProps = {
  icon: LucideIcon;
  selected: boolean;
  disabled: boolean;
  accessibilityLabel: string;
  selectedClassName: string;
  selectedBgClassName: string;
  iconFill: string;
  onPress: () => void;
  className?: string;
};

function VoteButton({
  icon,
  selected,
  disabled,
  accessibilityLabel,
  selectedClassName,
  selectedBgClassName,
  iconFill,
  onPress,
  className,
}: VoteButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      accessibilityLabel={accessibilityLabel}
      className={cn(
        "h-11 w-11 items-center justify-center rounded-full",
        selected ? selectedBgClassName : "bg-white/12",
        className,
      )}
    >
      <Icon
        as={icon}
        size={22}
        className={selected ? selectedClassName : "text-white"}
        fill={selected ? iconFill : "transparent"}
        strokeWidth={2.4}
      />
    </Pressable>
  );
}

export default function VideoReel(props: WatchReel & { isMuted: boolean }) {
  const { height, width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const bottomOverlayPad = Math.max(insets.bottom, 8) + 92;
  const {
    climbAttemptId,
    videoSource,
    title,
    routeName,
    place,
    authorName,
    authorHandle,
    likesCount,
    dislikesCount,
    currentUserVote: feedUserVote,
    uploadedAtLabel,
    attemptDurationLabel,
    attemptTypeLabel,
    attemptDateLabel,
    isAdminVerified,
    isMuted,
  } = props;

  const voteMutation = useVoteOnClimbAttempt();
  const { data: savedVote } = useClimbAttemptUserVote(climbAttemptId);

  const player = useVideoPlayer(videoSource, (p) => {
    p.loop = true;
    p.play();
  });

  const [playerStatus, setPlayerStatus] = useState<VideoPlayerStatus>(player.status);
  const [activeVote, setActiveVote] = useState<VoteState>(null);
  const [localCounts, setLocalCounts] = useState<VoteCounts | null>(null);

  const feedCounts = useMemo<VoteCounts>(
    () => ({
      likes: likesCount ?? 0,
      dislikes: dislikesCount ?? 0,
    }),
    [likesCount, dislikesCount],
  );

  const displayCounts = localCounts ?? feedCounts;

  useEffect(() => {
    setActiveVote(feedUserVote ?? null);
    setLocalCounts(null);
  }, [climbAttemptId, feedUserVote]);

  useEffect(() => {
    setPlayerStatus(player.status);

    const subscription = player.addListener("statusChange", ({ status }) => {
      setPlayerStatus(status);
    });

    return () => subscription.remove();
  }, [player]);

  useEffect(() => {
    player.muted = isMuted;
  }, [isMuted, player]);

  useEffect(() => {
    if (savedVote === undefined) {
      return;
    }

    setActiveVote((current) => current ?? savedVote);
  }, [savedVote]);

  const initials = authorName
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const showLoadingOverlay = playerStatus === "idle" || playerStatus === "loading";
  const showErrorOverlay = playerStatus === "error";
  const isVoting = voteMutation.isPending;

  async function handleVote(nextVote: Exclude<VoteState, null>) {
    if (isVoting || activeVote === nextVote) {
      return;
    }

    const previousVote = activeVote;
    const previousCounts = localCounts ?? feedCounts;
    const optimisticCounts = applyVoteCountsOptimistic(previousCounts, {
      type: "apply",
      nextVote,
      previousVote,
    });

    setActiveVote(nextVote);
    setLocalCounts(optimisticCounts);

    try {
      const updated = await voteMutation.mutateAsync({
        climbAttemptId,
        isValid: nextVote === "up",
      });

      setLocalCounts(getVoteCountsFromAttempt(updated));
    } catch (error) {
      setActiveVote(previousVote);
      setLocalCounts(null);

      if (error instanceof ApiError && error.status === 403) {
        Alert.alert("Głos", "Nie możesz głosować na własne przejście.");
        return;
      }

      Alert.alert("Głos", "Nie udało się oddać głosu. Spróbuj ponownie.");
    }
  }

  return (
    <View style={{ height, width }} className="relative overflow-hidden bg-black">
      <VideoView
        contentFit="cover"
        nativeControls={false}
        player={player}
        style={{ width: "100%", height: "100%" }}
      />

      {showLoadingOverlay ? (
        <View
          pointerEvents="none"
          className="absolute inset-0 z-10 items-center justify-center bg-black/35"
        >
          <View className="items-center gap-3 rounded-2xl bg-black/50 px-4 py-3">
            <ActivityIndicator color="#fff" />
            <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
              Ładowanie przejścia
            </Text>
          </View>
        </View>
      ) : null}

      {showErrorOverlay ? (
        <View
          pointerEvents="none"
          className="absolute inset-0 z-10 items-center justify-center bg-black/45 px-8"
        >
          <Text className="text-center text-sm font-semibold text-white">
            Nie udało się odtworzyć tego przejścia.
          </Text>
        </View>
      ) : null}

      <View pointerEvents="none" className="absolute inset-0 bg-black/10" />

      <View
        pointerEvents="box-none"
        className="absolute inset-x-0 bottom-0 z-20 flex-row justify-between gap-3 px-3 pt-8"
        style={{ paddingBottom: bottomOverlayPad }}
      >
        <View className="min-w-0 max-w-[74%] flex-1 justify-end gap-2 pb-1">
          <View className="flex-row items-center gap-2">
            <View className="relative items-center">
              <View className="h-10 w-10 items-center justify-center rounded-full border-2 border-white/90 bg-white/20">
                <Text className="text-xs font-bold text-white">{initials}</Text>
              </View>
              <View className="absolute -bottom-1 h-4 w-4 items-center justify-center rounded-full border border-white bg-primary">
                <Text className="text-[9px] font-bold text-white">+</Text>
              </View>
            </View>
            <View className="min-w-0 flex-1 gap-px">
              <Text className="text-sm font-bold text-white" numberOfLines={1}>
                {authorName}
              </Text>
              <Text className="text-xs text-white/80" numberOfLines={1}>
                @{authorHandle}
              </Text>
            </View>
          </View>

          <Text className="text-sm font-semibold leading-snug text-white" numberOfLines={2}>
            {title}
          </Text>

          <View className="flex-row flex-wrap gap-1.5">
            <View className="flex-row items-center gap-1 rounded-full bg-white/15 px-2.5 py-1">
              <Icon as={Mountain} size={12} className="text-white" strokeWidth={2.5} />
              <Text className="text-[11px] font-semibold text-white" numberOfLines={1}>
                {routeName}
              </Text>
            </View>
            <View className="flex-row items-center gap-1 rounded-full bg-white/15 px-2.5 py-1">
              <Icon as={MapPin} size={12} className="text-white" strokeWidth={2.5} />
              <Text
                className="max-w-[160px] text-[11px] font-medium text-white/95"
                numberOfLines={1}
              >
                {place}
              </Text>
            </View>
          </View>

          <View className="flex-row flex-wrap gap-1.5">
            {uploadedAtLabel ? (
              <View className="flex-row items-center gap-1 rounded-full bg-black/25 px-2.5 py-1">
                <Icon as={Clock} size={11} className="text-white/90" strokeWidth={2.4} />
                <Text className="text-[10px] font-medium text-white/90">
                  Wysłano {uploadedAtLabel}
                </Text>
              </View>
            ) : null}
            {attemptDurationLabel ? (
              <View className="flex-row items-center gap-1 rounded-full bg-black/25 px-2.5 py-1">
                <Icon as={Timer} size={11} className="text-white/90" strokeWidth={2.4} />
                <Text className="text-[10px] font-medium text-white/90">
                  {attemptDurationLabel}
                </Text>
              </View>
            ) : null}
            {attemptTypeLabel ? (
              <View className="rounded-full bg-primary/80 px-2.5 py-1">
                <Text className="text-[10px] font-bold uppercase tracking-wide text-white">
                  {attemptTypeLabel}
                </Text>
              </View>
            ) : null}
            {attemptDateLabel ? (
              <View className="rounded-full bg-white/12 px-2.5 py-1">
                <Text className="text-[10px] font-medium text-white/85">
                  Próba {attemptDateLabel}
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        <View className="items-center gap-0.5 pb-28 pt-4" pointerEvents="box-none">
          {isAdminVerified ? (
            <View className="mb-2 flex-row items-center gap-1 rounded-full border border-amber-300/60 bg-amber-400/25 px-2.5 py-1">
              <Icon as={BadgeCheck} size={14} className="text-amber-200" strokeWidth={2.4} />
              <Text className="text-[10px] font-bold uppercase tracking-wide text-amber-100">
                Admin OK
              </Text>
            </View>
          ) : null}

          <VoteButton
            icon={ThumbsUp}
            selected={activeVote === "up"}
            disabled={isVoting}
            accessibilityLabel="Głos za"
            selectedBgClassName="bg-emerald-500/30"
            selectedClassName="text-emerald-400"
            iconFill="#34d399"
            onPress={() => void handleVote("up")}
          />
          <Text className="text-[11px] font-bold tabular-nums text-white">
            {formatCount(displayCounts.likes)}
          </Text>

          <VoteButton
            icon={ThumbsDown}
            selected={activeVote === "down"}
            disabled={isVoting}
            accessibilityLabel="Głos przeciw"
            selectedBgClassName="bg-rose-500/30"
            selectedClassName="text-rose-400"
            iconFill="#fb7185"
            className="mt-2"
            onPress={() => void handleVote("down")}
          />
          <Text className="text-[11px] font-bold tabular-nums text-white">
            {formatCount(displayCounts.dislikes)}
          </Text>
        </View>
      </View>
    </View>
  );
}
