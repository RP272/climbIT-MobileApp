import {
  QuickFiltersSection,
  type QuickFilterItem,
} from "@/components/discover/quick-filters-section";
import { SearchBar } from "@/components/discover/search-bar";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { QUICK_FILTERS, SORT_OPTIONS } from "@/src/types/all-routes.constants";
import type { SortId } from "@/src/types/all-routes.types";
import { ListFilter } from "lucide-react-native";
import { ScrollView, View } from "react-native";

type AllRoutesHeaderProps = {
  totalRoutesCount: number;
  visibleRoutesCount: number;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  activeFilterIds: readonly string[];
  onFilterToggle: (filterId: string) => void;
  sortId: SortId | null;
  onSortChange: (sortId: SortId | null) => void;
};

export function AllRoutesHeader({
  totalRoutesCount,
  visibleRoutesCount,
  searchQuery,
  onSearchQueryChange,
  activeFilterIds,
  onFilterToggle,
  sortId,
  onSortChange,
}: AllRoutesHeaderProps) {
  return (
    <View className="gap-4">
      <View className="gap-1">
        <Text className="text-[28px] font-extrabold leading-8 text-foreground">
          Wszystkie trasy
        </Text>
        <Text className="text-[14px] leading-5 text-muted-foreground">
          {visibleRoutesCount} z {totalRoutesCount} tras pasuje do widoku
        </Text>
      </View>

      <View className="gap-3">
        <SearchBar
          value={searchQuery}
          onChangeText={onSearchQueryChange}
          placeholder="Szukaj po nazwie, ściance, sektorze..."
        />

        <QuickFiltersSection
          filters={QUICK_FILTERS}
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
  selectedSortId: SortId | null;
  onSortChange: (sortId: SortId | null) => void;
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
        {SORT_OPTIONS.map((option) => {
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

export type { AllRoutesHeaderProps, QuickFilterItem };
