import {
  DiscoverGymsCard,
  DiscoverGymsCardSkeleton,
} from "@/components/discover/gyms/discover-gyms-card";
import { FiltersDialog } from "@/components/discover/filters/filters-dialog";
import { HorizontalScrollSection } from "@/components/discover/gyms/horizontal-scroll-section";
import { SearchSection, type QuickFilterItem } from "@/components/discover/search-section";
import { useDiscoverFilters } from "@/src/features/discover/hooks/useDiscoverFilters";
import { useDiscoverGyms } from "@/src/features/discover/hooks/useDiscoverGyms";
import { Dumbbell, MapPin, Route, Sparkles, Trophy } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, View } from "react-native";

const quickFilters = [
  { id: "nearby", label: "Blisko mnie", icon: MapPin },
  { id: "new", label: "Nowe", icon: Sparkles },
  { id: "bouldering", label: "Bouldering", icon: Dumbbell },
  { id: "rope", label: "Lina", icon: Route },
  { id: "challenges", label: "Wyzwania", icon: Trophy },
] satisfies readonly QuickFilterItem[];

export default function DiscoverScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFiltersDialogOpen, setIsFiltersDialogOpen] = useState(false);
  const { filters, actions, activeQuickFilterIds, activeFiltersCount } = useDiscoverFilters();
  const { data: featuredGyms = [], isLoading } = useDiscoverGyms();

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="px-4 py-4">
      <View className="gap-4 pb-24">
        <SearchSection
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          filters={quickFilters}
          activeFilterIds={activeQuickFilterIds}
          onFilterToggle={actions.toggleQuickFilter}
          activeFiltersCount={activeFiltersCount}
          onFilterPress={() => setIsFiltersDialogOpen(true)}
        />

        <HorizontalScrollSection
          title="Polecane ścianki"
          description="Najciekawsze miejsca z nowymi setami"
          items={featuredGyms}
          isLoading={isLoading}
          loadingItemsCount={3}
          renderLoadingItem={() => <DiscoverGymsCardSkeleton />}
          keyExtractor={(gym) => gym.id}
          onActionPress={() => {}}
          renderItem={(gym) => <DiscoverGymsCard {...gym} />}
        />
      </View>

      <FiltersDialog
        open={isFiltersDialogOpen}
        onOpenChange={setIsFiltersDialogOpen}
        filters={filters}
        actions={actions}
      />
    </ScrollView>
  );
}
