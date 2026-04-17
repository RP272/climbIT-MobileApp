import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import type { ClimbingType } from "@/src/types/discover-filters";
import { Dumbbell, Gauge, Route } from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";
import { Pressable, View } from "react-native";

const climbingTypeOptions = [
  { value: "bouldering", label: "Boulder", icon: Dumbbell },
  { value: "rope", label: "Lina", icon: Route },
  { value: "auto-belay", label: "Auto-belay", icon: Gauge },
] satisfies readonly { value: ClimbingType; label: string; icon: LucideIcon }[];

type ClimbingTypeFilterProps = {
  selectedTypes: readonly ClimbingType[];
  onTypeToggle: (climbingType: ClimbingType) => void;
};

function ClimbingTypeFilter({ selectedTypes, onTypeToggle }: ClimbingTypeFilterProps) {
  return (
    <View className="gap-3">
      <Text className="text-[18px] font-bold tracking-tight text-foreground">Typ wspinania</Text>
      <View className="flex-row gap-2">
        {climbingTypeOptions.map((option) => {
          const isSelected = selectedTypes.includes(option.value);

          return (
            <Pressable
              key={option.value}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              onPress={() => onTypeToggle(option.value)}
              className={cn(
                "h-20 flex-1 items-center justify-center gap-2 rounded-2xl bg-card px-2 active:opacity-80",
                isSelected && "bg-primary shadow-sm",
              )}
            >
              <Icon
                as={option.icon}
                size={18}
                className={isSelected ? "text-primary-foreground" : "text-muted-foreground"}
                strokeWidth={2.3}
              />
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                className={cn(
                  "text-center text-[12px] font-bold",
                  isSelected ? "text-primary-foreground" : "text-foreground",
                )}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export { ClimbingTypeFilter };
