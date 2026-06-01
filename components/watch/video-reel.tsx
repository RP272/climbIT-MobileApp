import type { WatchReel } from "@/src/types/watch";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { ApiError } from "@/src/api/client";
import { useVoteOnClimbAttempt } from "@/src/features/watch/hooks/useVoteOnClimbAttempt";
import { useVideoPlayer, VideoView, type VideoPlayerStatus } from "expo-video";
import { ActivityIndicator, Alert, Pressable, View, useWindowDimensions } from "react-native";
import { useEffect, useState } from "react";
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

type VoteState = "up" | "down" | null;

function formatCount(value: number) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
  }

  return `${value}`;
}

function parseCount(value: string) {
  const normalized = value.trim().toLowerCase();
  if (normalized.endsWith("k")) {
    const number = Number.parseFloat(normalized.slice(0, -1));
    return Number.isFinite(number) ? Math.round(number * 1000) : 0;
  }

  const number = Number(normalized.replace(/,/g, ""));
  return Number.isFinite(number) ? number : 0;
}

export default function VideoReel(props: WatchReel & { isMuted: boolean }) {
  const { height, width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const bottomOverlayPad = Math.max(insets.bottom, 8) + 92;
  const voteMutation = useVoteOnClimbAttempt();
  const {
    climbAttemptId,
    videoSource,
    title,
    routeName,
    place,
    authorName,
    authorHandle,
    likesLabel,
    dislikesLabel,
    likesCount,
    dislikesCount,
    uploadedAtLabel,
    attemptDurationLabel,
    attemptTypeLabel,
    attemptDateLabel,
    isAdminVerified,
    isMuted,
  } = props;

  const player = useVideoPlayer(videoSource, (p) => {
    p.loop = true;
    p.play();
  });

  const [playerStatus, setPlayerStatus] = useState<VideoPlayerStatus>(player.status);
  const [voteState, setVoteState] = useState<VoteState>(null);
  const [localLikes, setLocalLikes] = useState(likesCount ?? parseCount(likesLabel));
  const [localDislikes, setLocalDislikes] = useState(dislikesCount ?? parseCount(dislikesLabel));

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
    setLocalLikes(likesCount ?? parseCount(likesLabel));
    setLocalDislikes(dislikesCount ?? parseCount(dislikesLabel));
  }, [likesCount, dislikesCount, likesLabel, dislikesLabel]);

  const initials = authorName
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const showLoadingOverlay = playerStatus === "idle" || playerStatus === "loading";
  const showErrorOverlay = playerStatus === "error";

  async function handleVote(nextVote: Exclude<VoteState, null>) {
    if (voteMutation.isPending) {
      return;
    }

    const previousVote = voteState;
    const previousLikes = localLikes;
    const previousDislikes = localDislikes;

    if (previousVote === nextVote) {
      setVoteState(null);
      if (nextVote === "up") {
        setLocalLikes((value) => Math.max(0, value - 1));
      } else {
        setLocalDislikes((value) => Math.max(0, value - 1));
      }
      return;
    }

    if (previousVote === "up") {
      setLocalLikes((value) => Math.max(0, value - 1));
    }
    if (previousVote === "down") {
      setLocalDislikes((value) => Math.max(0, value - 1));
    }

    if (nextVote === "up") {
      setLocalLikes((value) => value + 1);
    } else {
      setLocalDislikes((value) => value + 1);
    }

    setVoteState(nextVote);

    try {
      const updated = await voteMutation.mutateAsync({
        climbAttemptId,
        isValid: nextVote === "up",
      });

      if (updated.totalVotesFor != null) {
        setLocalLikes(updated.totalVotesFor);
      }
      if (updated.totalVotesAgainst != null) {
        setLocalDislikes(updated.totalVotesAgainst);
      }
    } catch (error) {
      setVoteState(previousVote);
      setLocalLikes(previousLikes);
      setLocalDislikes(previousDislikes);

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
        <View className="absolute inset-0 items-center justify-center bg-black/35">
          <View className="items-center gap-3 rounded-2xl bg-black/50 px-4 py-3">
            <ActivityIndicator color="#fff" />
            <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
              Ładowanie przejścia
            </Text>
          </View>
        </View>
      ) : null}

      {showErrorOverlay ? (
        <View className="absolute inset-0 items-center justify-center bg-black/45 px-8">
          <Text className="text-center text-sm font-semibold text-white">
            Nie udało się odtworzyć tego przejścia.
          </Text>
        </View>
      ) : null}

      <View pointerEvents="none" className="absolute inset-0 bg-black/10" />

      <View
        pointerEvents="box-none"
        className="absolute inset-x-0 bottom-0 flex-row justify-between gap-3 px-3 pt-8"
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

        <View className="items-center gap-0.5 pb-28 pt-4">
          {isAdminVerified ? (
            <View className="mb-2 flex-row items-center gap-1 rounded-full border border-amber-300/60 bg-amber-400/25 px-2.5 py-1">
              <Icon as={BadgeCheck} size={14} className="text-amber-200" strokeWidth={2.4} />
              <Text className="text-[10px] font-bold uppercase tracking-wide text-amber-100">
                Admin OK
              </Text>
            </View>
          ) : null}
          <Pressable
            onPress={() => void handleVote("up")}
            disabled={voteMutation.isPending}
            accessibilityRole="button"
            accessibilityState={{ selected: voteState === "up" }}
            accessibilityLabel="Upvote"
            className={`h-11 w-11 items-center justify-center rounded-full shadow-md shadow-black/25 ${
              voteState === "up" ? "bg-emerald-500/30" : "bg-white/12"
            }`}
          >
            <Icon
              as={ThumbsUp}
              size={22}
              className={voteState === "up" ? "text-emerald-400" : "text-white"}
              fill={voteState === "up" ? "#34d399" : "transparent"}
              strokeWidth={2.4}
            />
          </Pressable>
          <Text className="text-[11px] font-bold tabular-nums text-white">
            {formatCount(localLikes)}
          </Text>

          <Pressable
            onPress={() => void handleVote("down")}
            disabled={voteMutation.isPending}
            accessibilityRole="button"
            accessibilityState={{ selected: voteState === "down" }}
            accessibilityLabel="Downvote"
            className={`mt-2 h-11 w-11 items-center justify-center rounded-full shadow-md shadow-black/25 ${
              voteState === "down" ? "bg-rose-500/30" : "bg-white/12"
            }`}
          >
            <Icon
              as={ThumbsDown}
              size={22}
              className={voteState === "down" ? "text-rose-400" : "text-white"}
              fill={voteState === "down" ? "#fb7185" : "transparent"}
              strokeWidth={2.4}
            />
          </Pressable>
          <Text className="text-[11px] font-bold tabular-nums text-white">
            {formatCount(localDislikes)}
          </Text>
        </View>
      </View>
    </View>
  );
}
