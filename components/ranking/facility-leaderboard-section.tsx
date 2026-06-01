import { Leaderboard, type LeaderboardEntry } from "@/components/ranking/leaderboard";
import { Text } from "@/components/ui/text";
import { mapFacilityLeaderboardToEntries } from "@/src/api/ranking.api";
import type { FacilityLeaderboardDto } from "@/src/types/ranking";
import { View } from "react-native";

type FacilityLeaderboardSectionProps = {
  leaderboard: FacilityLeaderboardDto;
  previewCount?: number;
  onExpandPress?: () => void;
};

export function FacilityLeaderboardSection({
  leaderboard,
  previewCount = 3,
  onExpandPress,
}: FacilityLeaderboardSectionProps) {
  const entries: LeaderboardEntry[] = mapFacilityLeaderboardToEntries(leaderboard).map(
    ({ id, name, points, avatarUrl }) => ({
      id,
      name,
      points,
      avatarUrl,
    }),
  );

  return (
    <View className="gap-3 rounded-2xl border border-border/70 bg-card p-4">
      <View className="gap-1">
        <Text className="text-[18px] font-semibold text-foreground">
          {leaderboard.facilityName}
        </Text>
        <Text className="text-[13px] text-muted-foreground">
          {leaderboard.videoCount} {leaderboard.videoCount === 1 ? "film" : "filmów"} na obiekcie
        </Text>
      </View>

      {entries.length === 0 ? (
        <Text className="text-[13px] text-muted-foreground">
          Brak wspinaczy z filmami na tym obiekcie.
        </Text>
      ) : (
        <Leaderboard
          title={leaderboard.facilityName}
          description="Ranking wspinaczy z filmami na tym obiekcie."
          entries={entries}
          mode="preview"
          previewCount={previewCount}
          onExpandPress={onExpandPress}
          showHeader={false}
        />
      )}
    </View>
  );
}
