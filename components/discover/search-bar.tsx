import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import debounce from "lodash.debounce";
import { Search, X } from "lucide-react-native";
import { useMemo, type ComponentProps, type ReactNode } from "react";
import { View } from "react-native";

type SearchBarProps = Omit<ComponentProps<typeof Input>, "className"> & {
  className?: string;
  inputClassName?: string;
  rightAccessory?: ReactNode;
  showClearButton?: boolean;
  onClear?: () => void;
};

function SearchBar({
  className,
  inputClassName,
  rightAccessory,
  showClearButton = true,
  onClear,
  onChangeText,
  value,
  editable,
  placeholder = "Szukaj",
  returnKeyType = "search",
  ...props
}: SearchBarProps) {
  const hasValue = Boolean(value?.length);
  const canClear = showClearButton && editable !== false && hasValue;
  const hasTrailingControl = Boolean(rightAccessory) || canClear;
  const trailingPaddingClass = rightAccessory && canClear ? "pr-[86px]" : "pr-12";

  const handleClear = useMemo(
    () =>
      debounce(() => {
        onChangeText?.("");
        onClear?.();
      }, 30),
    [onChangeText, onClear],
  );

  return (
    <View className={cn("relative w-full", className)}>
      <View className="absolute left-3 top-0 z-10 h-full justify-center" pointerEvents="none">
        <Icon as={Search} size={18} className="text-muted-foreground" strokeWidth={2.2} />
      </View>

      <Input
        value={value}
        editable={editable}
        onChangeText={onChangeText}
        placeholder={placeholder}
        returnKeyType={returnKeyType}
        className={cn(
          "h-12 rounded-xl border-border/70 bg-card pl-10 text-[15px] shadow-sm",
          hasTrailingControl ? trailingPaddingClass : "pr-4",
          inputClassName,
        )}
        {...props}
      />

      {hasTrailingControl ? (
        <View className="absolute right-1.5 top-0 h-full flex-row items-center gap-1">
          {canClear ? (
            <Button
              variant="ghost"
              size="icon"
              accessibilityLabel="Wyczyść wyszukiwanie"
              onPress={handleClear}
              className="h-9 w-9 rounded-full"
            >
              <Icon as={X} size={16} className="text-muted-foreground" strokeWidth={2.4} />
            </Button>
          ) : null}
          {rightAccessory}
        </View>
      ) : null}
    </View>
  );
}

export { SearchBar };
export type { SearchBarProps };
