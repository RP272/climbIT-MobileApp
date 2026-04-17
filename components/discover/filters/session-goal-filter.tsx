import { FilterOptionChip } from "@/components/discover/filters/filter-option-chip";
import { Text } from "@/components/ui/text";
import type { SessionGoal } from "@/src/types/discover-filters";
import { View } from "react-native";

const sessionGoalOptions = [
  { value: "warmup", label: "Rozgrzewka" },
  { value: "training", label: "Trening" },
  { value: "project", label: "Projekt" },
  { value: "technique", label: "Technika" },
  { value: "fun", label: "Zabawa" },
] satisfies readonly { value: SessionGoal; label: string }[];

type SessionGoalFilterProps = {
  selectedGoals: readonly SessionGoal[];
  onGoalToggle: (sessionGoal: SessionGoal) => void;
};

function SessionGoalFilter({ selectedGoals, onGoalToggle }: SessionGoalFilterProps) {
  return (
    <View className="gap-3">
      <Text className="text-[18px] font-bold tracking-tight text-foreground">Cel sesji</Text>
      <View className="flex-row flex-wrap gap-2">
        {sessionGoalOptions.map((option) => {
          const isSelected = selectedGoals.includes(option.value);

          return (
            <FilterOptionChip
              key={option.value}
              label={option.label}
              isSelected={isSelected}
              onPress={() => onGoalToggle(option.value)}
            />
          );
        })}
      </View>
    </View>
  );
}

export { SessionGoalFilter };
