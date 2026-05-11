import { FilterButton } from "@/components/discover/filter-button";
import {
  QuickFiltersSection,
  type QuickFilterItem,
} from "@/components/discover/quick-filters-section";
import { SearchBar } from "@/components/discover/search-bar";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import type { ChallengeSortId } from "@/src/features/discover/hooks/useDiscoverFiltering";
import { Clock3, Dumbbell, Flame, ListFilter, Route, Sparkles, Target } from "lucide-react-native";
import { ScrollView, View } from "react-native";

const CHALLENGE_QUICK_FILTERS = [
  { id: "open-now", label: "Otwarte", icon: Clock3 },
  { id: "new", label: "Nowe sety", icon: Sparkles },
  { id: "bouldering", label: "Bouldering", icon: Dumbbell },
  { id: "rope", label: "Lina", icon: Route },
  { id: "training", label: "Trening", icon: Flame },
  { id: "project", label: "Projekt", icon: Target },
] satisfies readonly QuickFilterItem[];

const CHALLENGE_SORT_OPTIONS = [
  { id: "progress", label: "Największy postęp" },
  { id: "xp", label: "Najwięcej XP" },
  { id: "ending", label: "Kończące się" },
  { id: "difficulty", label: "Najtrudniejsze" },
] satisfies readonly { id: ChallengeSortId; label: string }[];

type AllChallengesHeaderProps = {
  visibleChallengesCount: number;
  totalChallengesCount: number;
  searchQuery: string;
  activeFilterIds: readonly string[];
  sortId: ChallengeSortId | null;
  activeFiltersCount?: number;
  onSearchQueryChange: (query: string) => void;
  onFilterToggle: (filterId: string) => void;
  onAdvancedFiltersPress: () => void;
  onSortChange: (sortId: ChallengeSortId | null) => void;
};

export function AllChallengesHeader({
  visibleChallengesCount,
  totalChallengesCount,
  searchQuery,
  activeFilterIds,
  sortId,
  activeFiltersCount = 0,
  onSearchQueryChange,
  onFilterToggle,
  onAdvancedFiltersPress,
  onSortChange,
}: AllChallengesHeaderProps) {
  return (
    <View className="gap-4">
      <View className="gap-1">
        <Text className="text-[28px] font-extrabold leading-8 text-foreground">
          Wszystkie wyzwania
        </Text>
        <Text className="text-[14px] leading-5 text-muted-foreground">
          {visibleChallengesCount} z {totalChallengesCount} wyzwań pasuje do widoku
        </Text>
      </View>

      <View className="gap-3">
        <SearchBar
          value={searchQuery}
          onChangeText={onSearchQueryChange}
          placeholder="Szukaj po nazwie, celu lub progresie..."
          rightAccessory={
            <FilterButton
              activeFiltersCount={activeFiltersCount}
              onPress={onAdvancedFiltersPress}
            />
          }
        />

        <QuickFiltersSection
          filters={CHALLENGE_QUICK_FILTERS}
          activeFilterIds={activeFilterIds}
          onFilterToggle={onFilterToggle}
        />
      </View>

      <SortBar selectedSortId={sortId} onSortChange={onSortChange} />
    </View>
  );
}

function SortBar({
  selectedSortId,
  onSortChange,
}: {
  selectedSortId: ChallengeSortId | null;
  onSortChange: (sortId: ChallengeSortId | null) => void;
}) {
  return (
    <View className="gap-2">
      <View className="flex-row items-center gap-2">
        <Icon as={ListFilter} size={16} className="text-muted-foreground" strokeWidth={2.3} />
        <Text className="text-[13px] font-bold text-muted-foreground">Sortowanie</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2 pr-4"
      >
        {CHALLENGE_SORT_OPTIONS.map((option) => {
          const isSelected = option.id === selectedSortId;

          return (
            <Button
              key={option.id}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              className={cn(
                "h-9 rounded-lg px-3",
                isSelected ? "border-transparent" : "border-border/70 bg-card",
              )}
              accessibilityState={{ selected: isSelected }}
              onPress={() => onSortChange(isSelected ? null : option.id)}
            >
              <Text
                className={cn(
                  "text-[12px] font-bold",
                  isSelected ? "text-primary-foreground" : "text-foreground",
                )}
              >
                {option.label}
              </Text>
            </Button>
          );
        })}
      </ScrollView>
    </View>
  );
}

export type { AllChallengesHeaderProps, QuickFilterItem };
