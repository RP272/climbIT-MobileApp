import { FilterOptionChip } from "@/components/discover/filters/filter-option-chip";
import { Text } from "@/components/ui/text";
import type { ChallengeMode, RouteStatus } from "@/src/types/discover-filters";
import { Trophy } from "lucide-react-native";
import { View } from "react-native";

const activityOptions = [
  { value: "new", label: "Nowe" },
  { value: "popular", label: "Popularne" },
  { value: "not-done", label: "Nie zrobione" },
] satisfies readonly { value: RouteStatus; label: string }[];

type ActivityProgressFilterProps = {
  selectedStatuses: readonly RouteStatus[];
  selectedChallengeModes: readonly ChallengeMode[];
  onStatusToggle: (status: RouteStatus) => void;
  onChallengeModeToggle: (mode: ChallengeMode) => void;
};

function ActivityProgressFilter({
  selectedStatuses,
  selectedChallengeModes,
  onStatusToggle,
  onChallengeModeToggle,
}: ActivityProgressFilterProps) {
  const isChallengeSelected = selectedChallengeModes.includes("with-challenge");

  return (
    <View className="gap-3">
      <Text className="text-[18px] font-bold tracking-tight text-foreground">Aktywność</Text>
      <View className="flex-row flex-wrap gap-2">
        {activityOptions.map((option) => {
          const isSelected = selectedStatuses.includes(option.value);

          return (
            <FilterOptionChip
              key={option.value}
              label={option.label}
              isSelected={isSelected}
              onPress={() => onStatusToggle(option.value)}
            />
          );
        })}
        <FilterOptionChip
          label="Z wyzwaniem"
          icon={Trophy}
          isSelected={isChallengeSelected}
          onPress={() => onChallengeModeToggle("with-challenge")}
        />
      </View>
    </View>
  );
}

export { ActivityProgressFilter };
