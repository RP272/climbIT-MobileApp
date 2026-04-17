import { FilterOptionChip } from "@/components/discover/filters/filter-option-chip";
import { Text } from "@/components/ui/text";
import type { RouteCharacter } from "@/src/types/discover-filters";
import { View } from "react-native";

const routeCharacterOptions = [
  { value: "technical", label: "Techniczne" },
  { value: "power", label: "Siłowe" },
  { value: "balance", label: "Balans" },
  { value: "dynamic", label: "Dynamiczne" },
  { value: "endurance", label: "Wytrzymałość" },
  { value: "overhang", label: "Przewieszenie" },
] satisfies readonly { value: RouteCharacter; label: string }[];

type RouteCharacterFilterProps = {
  selectedCharacters: readonly RouteCharacter[];
  onCharacterToggle: (routeCharacter: RouteCharacter) => void;
};

function RouteCharacterFilter({
  selectedCharacters,
  onCharacterToggle,
}: RouteCharacterFilterProps) {
  return (
    <View className="gap-3">
      <Text className="text-[18px] font-bold tracking-tight text-foreground">Charakter trasy</Text>
      <View className="flex-row flex-wrap gap-2">
        {routeCharacterOptions.map((option) => {
          const isSelected = selectedCharacters.includes(option.value);

          return (
            <FilterOptionChip
              key={option.value}
              label={option.label}
              isSelected={isSelected}
              onPress={() => onCharacterToggle(option.value)}
            />
          );
        })}
      </View>
    </View>
  );
}

export { RouteCharacterFilter };
