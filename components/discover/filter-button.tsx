import { Button, type ButtonProps } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { SlidersHorizontal } from "lucide-react-native";
import { View } from "react-native";

type FilterButtonProps = Omit<ButtonProps, "children" | "size" | "variant"> & {
  activeFiltersCount?: number;
};

function FilterButton({
  className,
  accessibilityLabel = "Filtry",
  activeFiltersCount = 0,
  ...props
}: FilterButtonProps) {
  const hasActiveFilters = activeFiltersCount > 0;
  const visibleFiltersCount = activeFiltersCount > 9 ? "9+" : activeFiltersCount.toString();

  return (
    <Button
      variant="outline"
      size="icon"
      accessibilityLabel={accessibilityLabel}
      className={cn(
        "relative h-9 w-9 rounded-xl border-transparent bg-muted shadow-none",
        className,
      )}
      {...props}
    >
      <Icon as={SlidersHorizontal} size={18} className="text-foreground" strokeWidth={2.2} />
      {hasActiveFilters ? (
        <View className="absolute -right-1 -top-1 size-4 items-center justify-center rounded-full bg-primary">
          <Text className="text-[9px] font-bold leading-3 text-primary-foreground">
            {visibleFiltersCount}
          </Text>
        </View>
      ) : null}
    </Button>
  );
}

export { FilterButton };
export type { FilterButtonProps };
