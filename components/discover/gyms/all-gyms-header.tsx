import { GYM_QUICK_FILTERS, GYM_SORT_OPTIONS } from "@/components/discover/gyms/all-gyms.constants";
import type { GymSortId } from "@/components/discover/gyms/all-gyms.types";
import {
  QuickFiltersSection,
  type QuickFilterItem,
} from "@/components/discover/quick-filters-section";
import { SearchBar } from "@/components/discover/search-bar";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { ListFilter } from "lucide-react-native";
import { ScrollView, View } from "react-native";

type AllGymsHeaderProps = {
  visibleGymsCount: number;
  totalGymsCount: number;
  searchQuery: string;
  activeFilterIds: readonly string[];
  sortId: GymSortId | null;
  onSearchQueryChange: (query: string) => void;
  onFilterToggle: (filterId: string) => void;
  onSortChange: (sortId: GymSortId | null) => void;
};

export function AllGymsHeader({
  visibleGymsCount,
  totalGymsCount,
  searchQuery,
  activeFilterIds,
  sortId,
  onSearchQueryChange,
  onFilterToggle,
  onSortChange,
}: AllGymsHeaderProps) {
  return (
    <View className="gap-4">
      <View className="gap-1">
        <Text className="text-[28px] font-extrabold leading-8 text-foreground">
          Wszystkie ścianki
        </Text>
        <Text className="text-[14px] leading-5 text-muted-foreground">
          {visibleGymsCount} z {totalGymsCount} ścianek pasuje do widoku
        </Text>
      </View>

      <View className="gap-3">
        <SearchBar
          value={searchQuery}
          onChangeText={onSearchQueryChange}
          placeholder="Szukaj po nazwie, mieście lub udogodnieniu..."
        />

        <QuickFiltersSection
          filters={GYM_QUICK_FILTERS}
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
  selectedSortId: GymSortId | null;
  onSortChange: (sortId: GymSortId | null) => void;
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
        {GYM_SORT_OPTIONS.map((option) => {
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

export type { AllGymsHeaderProps, QuickFilterItem };
