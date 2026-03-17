import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react-native";
import type { ReactNode } from "react";
import { Pressable, ScrollView, View } from "react-native";

type HorizontalScrollSectionProps<T> = {
  title: string;
  description?: string;
  items: readonly T[];
  isLoading?: boolean;
  loadingItemsCount?: number;
  renderLoadingItem?: (index: number) => ReactNode;
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor?: (item: T, index: number) => string;
  actionLabel?: string;
  onActionPress?: () => void;
  className?: string;
  contentContainerClassName?: string;
};

type HorizontalScrollSectionHeaderProps = Pick<
  HorizontalScrollSectionProps<unknown>,
  "title" | "description" | "actionLabel" | "onActionPress"
>;

type HorizontalScrollSectionItemsProps<T> = Pick<
  HorizontalScrollSectionProps<T>,
  | "items"
  | "isLoading"
  | "loadingItemsCount"
  | "renderLoadingItem"
  | "renderItem"
  | "keyExtractor"
  | "contentContainerClassName"
>;

export function HorizontalScrollSection<T>({
  title,
  description,
  items,
  isLoading = false,
  loadingItemsCount = 3,
  renderLoadingItem,
  renderItem,
  keyExtractor,
  actionLabel = "Zobacz wszystkie",
  onActionPress,
  className,
  contentContainerClassName,
}: HorizontalScrollSectionProps<T>) {
  return (
    <View className={cn("gap-3", className)}>
      <HorizontalScrollSectionHeader
        title={title}
        description={description}
        actionLabel={actionLabel}
        onActionPress={onActionPress}
      />
      <HorizontalScrollSectionItems
        items={items}
        isLoading={isLoading}
        loadingItemsCount={loadingItemsCount}
        renderLoadingItem={renderLoadingItem}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerClassName={contentContainerClassName}
      />
    </View>
  );
}

function HorizontalScrollSectionHeader({
  title,
  description,
  actionLabel,
  onActionPress,
}: HorizontalScrollSectionHeaderProps) {
  return (
    <View className="flex-row items-center justify-between gap-3">
      <HorizontalScrollSectionCopy title={title} description={description} />
      {onActionPress ? (
        <HorizontalScrollSectionAction actionLabel={actionLabel} onPress={onActionPress} />
      ) : null}
    </View>
  );
}

function HorizontalScrollSectionCopy({
  title,
  description,
}: Pick<HorizontalScrollSectionHeaderProps, "title" | "description">) {
  return (
    <View className="flex-1 pr-2">
      <Text className="text-[18px] font-semibold leading-6 text-foreground">{title}</Text>
      {description ? (
        <Text className="mt-1 max-w-[220px] text-[13px] leading-5 text-muted-foreground">
          {description}
        </Text>
      ) : null}
    </View>
  );
}

function HorizontalScrollSectionAction({
  actionLabel,
  onPress,
}: {
  actionLabel?: string;
  onPress: NonNullable<HorizontalScrollSectionHeaderProps["onActionPress"]>;
}) {
  return (
    <View className="self-stretch justify-center">
      <Pressable
        onPress={onPress}
        className="min-h-14 flex-row items-center gap-1 self-center rounded-2xl bg-card px-3 py-2 active:opacity-80"
      >
        <Text className="max-w-20 text-[12px] font-semibold leading-4 tracking-[0.02em] text-foreground">
          {actionLabel}
        </Text>
        <Icon as={ChevronRight} size={15} className="text-muted-foreground" strokeWidth={2.6} />
      </Pressable>
    </View>
  );
}

function HorizontalScrollSectionItems<T>({
  items,
  isLoading,
  loadingItemsCount,
  renderLoadingItem,
  renderItem,
  keyExtractor,
  contentContainerClassName,
}: HorizontalScrollSectionItemsProps<T>) {
  const skeletonItemsCount = loadingItemsCount ?? 3;

  if (isLoading && renderLoadingItem) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName={cn("gap-2.5 pr-4", contentContainerClassName)}
      >
        {Array.from({ length: skeletonItemsCount }).map((_, index) => (
          <View key={`loading-item-${index}`}>{renderLoadingItem(index)}</View>
        ))}
      </ScrollView>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName={cn("gap-2.5 pr-4", contentContainerClassName)}
    >
      {items.map((item, index) => (
        <View key={keyExtractor ? keyExtractor(item, index) : index.toString()}>
          {renderItem(item, index)}
        </View>
      ))}
    </ScrollView>
  );
}
