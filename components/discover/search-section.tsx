import { FilterButton } from "@/components/discover/filter-button";
import {
  QuickFiltersSection,
  type QuickFilterItem,
} from "@/components/discover/quick-filters-section";
import { SearchBar } from "@/components/discover/search-bar";
import { cn } from "@/lib/utils";
import { View } from "react-native";

type SearchSectionProps = {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  filters: readonly QuickFilterItem[];
  activeFilterIds: readonly string[];
  onFilterToggle: (filterId: string) => void;
  onFilterPress?: () => void;
  activeFiltersCount?: number;
  placeholder?: string;
  className?: string;
};

function SearchSection({
  searchQuery,
  onSearchQueryChange,
  filters,
  activeFilterIds,
  onFilterToggle,
  onFilterPress,
  activeFiltersCount = 0,
  placeholder = "Szukaj...",
  className,
}: SearchSectionProps) {
  return (
    <View className={cn("gap-3", className)}>
      <SearchBar
        value={searchQuery}
        onChangeText={onSearchQueryChange}
        placeholder={placeholder}
        rightAccessory={
          <FilterButton activeFiltersCount={activeFiltersCount} onPress={onFilterPress} />
        }
      />

      <QuickFiltersSection
        filters={filters}
        activeFilterIds={activeFilterIds}
        onFilterToggle={onFilterToggle}
      />
    </View>
  );
}

export { SearchSection };
export type { QuickFilterItem, SearchSectionProps };
