import { ChallengeCard } from "@/components/discover/challenges/challenge-card";
import { DiscoverGymsCard } from "@/components/discover/gyms/discover-gyms-card";
import { RecommendedRouteCard } from "@/components/discover/routes/recommended-routes-section";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import type {
  ActiveDiscoverFilterChip,
  DiscoverResultGroup,
  DiscoverResultSuggestion,
  DiscoverResultsViewModel,
} from "@/src/features/discover/utils/discover-results.utils";
import type { Gym } from "@/src/types/discover";
import { ScrollView, View } from "react-native";

type DiscoverResultsSectionProps = {
  viewModel: DiscoverResultsViewModel;
  onSuggestionPress: (suggestionId: DiscoverResultSuggestion["id"]) => void;
  onGymPress?: (gym: Gym) => void;
};

export function DiscoverResultsSection({
  viewModel,
  onSuggestionPress,
  onGymPress,
}: DiscoverResultsSectionProps) {
  if (viewModel.mode === "empty-results") {
    return <DiscoverEmptyResults viewModel={viewModel} onSuggestionPress={onSuggestionPress} />;
  }

  return (
    <View className="gap-5">
      <DiscoverResultsHeader viewModel={viewModel} />

      {viewModel.supportingMessage ? (
        <Text className="rounded-xl bg-muted px-3 py-2 text-[13px] leading-5 text-muted-foreground">
          {viewModel.supportingMessage}
        </Text>
      ) : null}

      {viewModel.groups.map((group) => (
        <DiscoverResultGroupSection key={group.kind} group={group} onGymPress={onGymPress} />
      ))}

      {viewModel.totalResultsCount <= 4 ? (
        <DiscoverResultSuggestions
          suggestions={viewModel.suggestions}
          onSuggestionPress={onSuggestionPress}
        />
      ) : null}
    </View>
  );
}

function DiscoverResultsHeader({ viewModel }: { viewModel: DiscoverResultsViewModel }) {
  return (
    <View className="gap-3">
      <Text className="text-[20px] font-bold leading-7 text-foreground">
        {viewModel.totalResultsCount} {getResultsCountLabel(viewModel.totalResultsCount)}
      </Text>

      {viewModel.activeFilterChips.length > 0 ? (
        <ActiveFilterChips chips={viewModel.activeFilterChips} />
      ) : null}
    </View>
  );
}

function ActiveFilterChips({ chips }: { chips: readonly ActiveDiscoverFilterChip[] }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="-mx-4"
      contentContainerClassName="gap-2 px-4"
    >
      {chips.map((chip) => (
        <View key={chip.id} className="rounded-full bg-muted px-3 py-2">
          <Text className="text-[12px] font-bold leading-4 text-foreground">{chip.label}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

function DiscoverResultGroupSection({
  group,
  onGymPress,
}: {
  group: DiscoverResultGroup;
  onGymPress?: (gym: Gym) => void;
}) {
  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between gap-3">
        <Text className="min-w-0 flex-1 text-[18px] font-semibold leading-6 text-foreground">
          {group.title}
        </Text>
        <View className="h-7 min-w-7 items-center justify-center rounded-full bg-muted px-2">
          <Text className="text-[12px] font-bold leading-4 text-muted-foreground">
            {group.items.length}
          </Text>
        </View>
      </View>

      <View className="gap-3">{renderGroupItems(group, onGymPress)}</View>
    </View>
  );
}

function renderGroupItems(group: DiscoverResultGroup, onGymPress?: (gym: Gym) => void) {
  switch (group.kind) {
    case "routes":
      return group.items.map((route) => (
        <RecommendedRouteCard key={route.id} route={route} containerClassName="w-full" />
      ));
    case "gyms":
      return group.items.map((gym) => (
        <DiscoverGymsCard
          key={gym.id}
          {...gym}
          containerClassName="w-full"
          onPress={onGymPress ? () => onGymPress(gym) : undefined}
        />
      ));
    case "challenges":
      return group.items.map((challenge) => (
        <ChallengeCard key={challenge.id} challenge={challenge} />
      ));
  }
}

function DiscoverEmptyResults({ viewModel, onSuggestionPress }: DiscoverResultsSectionProps) {
  return (
    <View className="gap-5 py-6">
      <View className="gap-2">
        <Text className="text-[22px] font-bold leading-8 text-foreground">Brak wyników</Text>
        <Text className="text-[14px] leading-6 text-muted-foreground">
          Spróbuj zwiększyć dystans albo usunąć część filtrów.
        </Text>
      </View>

      {viewModel.activeFilterChips.length > 0 ? (
        <ActiveFilterChips chips={viewModel.activeFilterChips} />
      ) : null}

      <DiscoverResultSuggestions
        suggestions={viewModel.suggestions}
        onSuggestionPress={onSuggestionPress}
      />
    </View>
  );
}

function DiscoverResultSuggestions({
  suggestions,
  onSuggestionPress,
}: {
  suggestions: readonly DiscoverResultSuggestion[];
  onSuggestionPress: (suggestionId: DiscoverResultSuggestion["id"]) => void;
}) {
  return (
    <View className="gap-3">
      <Text className="text-[16px] font-semibold leading-6 text-foreground">Za mało wyników?</Text>

      <View className="gap-2">
        {suggestions.map((suggestion) => (
          <Button
            key={suggestion.id}
            variant={suggestion.id === "clear-all" ? "default" : "outline"}
            className="h-12 w-full rounded-xl"
            onPress={() => onSuggestionPress(suggestion.id)}
          >
            <Text className="text-[13px] font-bold">{suggestion.label}</Text>
          </Button>
        ))}
      </View>
    </View>
  );
}

function getResultsCountLabel(count: number) {
  if (count === 1) {
    return "wynik";
  }

  if (count >= 2 && count <= 4) {
    return "wyniki";
  }

  return "wyników";
}
