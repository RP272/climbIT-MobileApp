import { Button, type ButtonProps } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react-native";

type FilterOptionChipProps = Omit<ButtonProps, "children" | "size" | "variant"> & {
  label: string;
  isSelected?: boolean;
  icon?: LucideIcon;
};

function FilterOptionChip({
  label,
  isSelected = false,
  icon,
  className,
  ...props
}: FilterOptionChipProps) {
  return (
    <Button
      variant={isSelected ? "default" : "outline"}
      size="sm"
      accessibilityState={{ selected: isSelected }}
      className={cn(
        "h-9 rounded-xl px-3",
        isSelected ? "border-transparent" : "border-border/70 bg-card",
        className,
      )}
      {...props}
    >
      {icon ? (
        <Icon
          as={icon}
          size={15}
          className={isSelected ? "text-primary-foreground" : "text-muted-foreground"}
          strokeWidth={2.3}
        />
      ) : null}
      <Text
        className={cn(
          "text-[12px] font-bold leading-4",
          isSelected ? "text-primary-foreground" : "text-foreground",
        )}
      >
        {label}
      </Text>
    </Button>
  );
}

export { FilterOptionChip };
export type { FilterOptionChipProps };
