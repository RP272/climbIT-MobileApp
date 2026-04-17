import {
  DiscreteRangeSlider,
  type RangeSliderOption,
} from "@/components/discover/filters/discrete-range-slider";
import { Text } from "@/components/ui/text";
import type { ClimbingGrade, GradeRange } from "@/src/types/discover-filters";
import { View } from "react-native";

const gradeOptions = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "6", label: "6" },
  { value: "7", label: "7" },
  { value: "8", label: "8" },
  { value: "9", label: "9" },
] satisfies readonly RangeSliderOption<ClimbingGrade>[];

type LevelGradeFilterProps = {
  gradeRange: GradeRange;
  onGradeRangeMinChange: (grade: ClimbingGrade | null) => void;
  onGradeRangeMaxChange: (grade: ClimbingGrade | null) => void;
};

function LevelGradeFilter({
  gradeRange,
  onGradeRangeMinChange,
  onGradeRangeMaxChange,
}: LevelGradeFilterProps) {
  return (
    <View className="gap-3">
      <Text className="text-[18px] font-bold tracking-tight text-foreground">Zakres wyceny</Text>
      <View className="rounded-2xl bg-card px-4 py-4">
        <DiscreteRangeSlider
          label="Wycena"
          minValue={gradeRange.min}
          maxValue={gradeRange.max}
          options={gradeOptions}
          onMinValueChange={onGradeRangeMinChange}
          onMaxValueChange={onGradeRangeMaxChange}
        />
      </View>
    </View>
  );
}

export { LevelGradeFilter };
