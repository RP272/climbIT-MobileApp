import { ActivityProgressFilter } from "@/components/discover/filters/activity-progress-filter";
import { ClimbingTypeFilter } from "@/components/discover/filters/climbing-type-filter";
import { DistanceAvailabilityFilter } from "@/components/discover/filters/distance-availability-filter";
import { LevelGradeFilter } from "@/components/discover/filters/level-grade-filter";
import { RouteCharacterFilter } from "@/components/discover/filters/route-character-filter";
import { SessionGoalFilter } from "@/components/discover/filters/session-goal-filter";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import type { DiscoverFilterActions } from "@/src/features/discover/hooks/useDiscoverFilters";
import type { DiscoverFilters } from "@/src/types/discover-filters";
import { BlurView } from "expo-blur";
import debounce from "lodash.debounce";
import { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

type FiltersFormProps = {
  filters: DiscoverFilters;
  actions: DiscoverFilterActions;
  onApply: () => void;
  className?: string;
};

function FiltersForm({ filters, actions, onApply, className }: FiltersFormProps) {
  const handleReset = useMemo(() => debounce(actions.resetFilters, 50), [actions.resetFilters]);
  const handleApply = useMemo(() => debounce(onApply, 50), [onApply]);

  return (
    <View className={cn("gap-0", className)}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="max-h-[560px]"
        contentContainerClassName="gap-7 px-5 pb-7 pt-5"
      >
        <DistanceAvailabilityFilter
          radiusKm={filters.radiusKm}
          openNow={filters.openNow}
          onRadiusChange={actions.setRadiusKm}
          onOpenNowChange={actions.setOpenNow}
        />
        <ClimbingTypeFilter
          selectedTypes={filters.climbingTypes}
          onTypeToggle={actions.toggleClimbingType}
        />
        <LevelGradeFilter
          gradeRange={filters.gradeRange}
          onGradeRangeMinChange={actions.setGradeRangeMin}
          onGradeRangeMaxChange={actions.setGradeRangeMax}
        />
        <RouteCharacterFilter
          selectedCharacters={filters.routeCharacters}
          onCharacterToggle={actions.toggleRouteCharacter}
        />
        <SessionGoalFilter
          selectedGoals={filters.sessionGoals}
          onGoalToggle={actions.toggleSessionGoal}
        />
        <ActivityProgressFilter
          selectedStatuses={filters.routeStatuses}
          selectedChallengeModes={filters.challengeModes}
          onStatusToggle={actions.toggleRouteStatus}
          onChallengeModeToggle={actions.toggleChallengeMode}
        />
      </ScrollView>

      <View className="relative overflow-visible px-5 pb-5 pt-5">
        <View
          className="absolute -top-8 left-0 right-0 h-3 bg-background/20"
          pointerEvents="none"
        />
        <View
          className="absolute -top-5 left-0 right-0 h-3 bg-background/45"
          pointerEvents="none"
        />
        <View
          className="absolute -top-2 left-0 right-0 h-3 bg-background/70"
          pointerEvents="none"
        />
        <BlurView
          intensity={30}
          tint="default"
          pointerEvents="none"
          style={StyleSheet.absoluteFillObject}
        />
        <View className="absolute inset-0 bg-background/85" pointerEvents="none" />

        <View className="flex-row items-center gap-3">
          <Button
            variant="ghost"
            className="h-12 flex-1 rounded-full bg-muted/50"
            onPress={handleReset}
          >
            <Text className="text-[13px] font-bold text-muted-foreground">Wyczyść</Text>
          </Button>
          <Button className="h-12 flex-[1.6] rounded-full shadow-md" onPress={handleApply}>
            <Text className="text-[13px] font-bold">Pokaż wyniki</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}

export { FiltersForm };
export type { FiltersFormProps };
