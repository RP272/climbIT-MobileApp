import { Button, type ButtonProps } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react-native";

type QuickFilterProps = Omit<ButtonProps, "children" | "size" | "variant"> & {
  label: string;
  icon?: LucideIcon;
  isSelected?: boolean;
};

function QuickFilter({
  label,
  icon: FilterIcon,
  isSelected = false,
  className,
  ...props
}: QuickFilterProps) {
  return (
    <Button
      variant={isSelected ? "default" : "outline"}
      size="sm"
      accessibilityState={{ selected: isSelected }}
      className={cn(
        "h-8 gap-1.5 rounded-full px-3",
        isSelected ? "border-transparent" : "border-border/70 bg-card",
        className,
      )}
      {...props}
    >
      {FilterIcon ? (
        <Icon
          as={FilterIcon}
          size={14}
          className={isSelected ? "text-primary-foreground" : "text-muted-foreground"}
          strokeWidth={2.3}
        />
      ) : null}
      <Text className="text-[12px] font-semibold leading-4">{label}</Text>
    </Button>
  );
}

export { QuickFilter };
export type { QuickFilterProps };
