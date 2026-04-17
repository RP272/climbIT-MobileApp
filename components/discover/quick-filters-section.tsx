import { QuickFilter } from "@/components/discover/quick-filter";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react-native";
import { ScrollView } from "react-native";

type QuickFilterItem = {
  id: string;
  label: string;
  icon?: LucideIcon;
};

type QuickFiltersSectionProps = {
  filters: readonly QuickFilterItem[];
  activeFilterIds: readonly string[];
  onFilterToggle: (filterId: string) => void;
  className?: string;
  contentContainerClassName?: string;
};

function QuickFiltersSection({
  filters,
  activeFilterIds,
  onFilterToggle,
  className,
  contentContainerClassName,
}: QuickFiltersSectionProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className={className}
      contentContainerClassName={cn("gap-2 pr-4", contentContainerClassName)}
    >
      {filters.map((filter) => (
        <QuickFilter
          key={filter.id}
          label={filter.label}
          icon={filter.icon}
          isSelected={activeFilterIds.includes(filter.id)}
          onPress={() => onFilterToggle(filter.id)}
        />
      ))}
    </ScrollView>
  );
}

export { QuickFiltersSection };
export type { QuickFilterItem, QuickFiltersSectionProps };
