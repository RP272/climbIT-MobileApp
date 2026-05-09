import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { ChevronRight, type LucideIcon } from "lucide-react-native";
import type { ReactNode } from "react";
import { FlatList, Pressable, View } from "react-native";

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
  actionIcon?: LucideIcon;
  actionPlacement?: "header" | "trailing";
  onActionPress?: () => void;
  showAction?: boolean;
  className?: string;
  scrollViewClassName?: string;
  contentContainerClassName?: string;
};

type HorizontalScrollSectionHeaderProps = Pick<
  HorizontalScrollSectionProps<unknown>,
  "title" | "description" | "actionLabel" | "actionIcon" | "onActionPress"
>;

type HorizontalScrollSectionItemsProps<T> = Pick<
  HorizontalScrollSectionProps<T>,
  | "items"
  | "isLoading"
  | "loadingItemsCount"
  | "renderLoadingItem"
  | "renderItem"
  | "keyExtractor"
  | "actionLabel"
  | "scrollViewClassName"
  | "contentContainerClassName"
> & {
  showTrailingAction: boolean;
  onTrailingActionPress?: () => void;
};

export function HorizontalScrollSection<T>({
  title,
  description,
  items,
  isLoading = false,
  loadingItemsCount = 3,
  renderLoadingItem,
  renderItem,
  keyExtractor,
  actionLabel = "Zobacz więcej",
  actionIcon,
  actionPlacement = "trailing",
  onActionPress,
  showAction = true,
  className,
  scrollViewClassName,
  contentContainerClassName,
}: HorizontalScrollSectionProps<T>) {
  const shouldShowHeaderAction =
    showAction && actionPlacement === "header" && Boolean(onActionPress);
  const shouldShowTrailingAction = showAction && actionPlacement === "trailing";

  return (
    <View className={cn("gap-3", className)}>
      <HorizontalScrollSectionHeader
        title={title}
        description={description}
        actionLabel={actionLabel}
        actionIcon={actionIcon}
        onActionPress={shouldShowHeaderAction ? onActionPress : undefined}
      />
      <HorizontalScrollSectionItems
        items={items}
        isLoading={isLoading}
        loadingItemsCount={loadingItemsCount}
        renderLoadingItem={renderLoadingItem}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        actionLabel={actionLabel}
        showTrailingAction={shouldShowTrailingAction}
        onTrailingActionPress={shouldShowTrailingAction ? onActionPress : undefined}
        scrollViewClassName={scrollViewClassName}
        contentContainerClassName={contentContainerClassName}
      />
    </View>
  );
}

function HorizontalScrollSectionHeader({
  title,
  description,
  actionLabel,
  actionIcon,
  onActionPress,
}: HorizontalScrollSectionHeaderProps) {
  return (
    <View className="flex-row items-center justify-between gap-3">
      <HorizontalScrollSectionCopy title={title} description={description} />
      {onActionPress ? (
        <HorizontalScrollSectionHeaderAction
          actionLabel={actionLabel}
          actionIcon={actionIcon}
          onPress={onActionPress}
        />
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

function HorizontalScrollSectionItems<T>({
  items,
  isLoading,
  loadingItemsCount,
  renderLoadingItem,
  renderItem,
  keyExtractor,
  actionLabel,
  showTrailingAction,
  onTrailingActionPress,
  scrollViewClassName,
  contentContainerClassName,
}: HorizontalScrollSectionItemsProps<T>) {
  const skeletonItemsCount = loadingItemsCount ?? 3;
  const shouldRenderLoading = isLoading && Boolean(renderLoadingItem);
  const trailingAction = showTrailingAction ? (
    <HorizontalScrollSectionTrailingAction
      actionLabel={actionLabel}
      onPress={onTrailingActionPress}
    />
  ) : null;

  if (shouldRenderLoading && renderLoadingItem) {
    const loadingItems = Array.from({ length: skeletonItemsCount }, (_, index) => index);

    return (
      <FlatList
        horizontal
        data={loadingItems}
        keyExtractor={(item) => `loading-item-${item}`}
        renderItem={({ item }) => <View>{renderLoadingItem(item)}</View>}
        ListFooterComponent={trailingAction}
        showsHorizontalScrollIndicator={false}
        className={cn("-mx-4", scrollViewClassName)}
        contentContainerClassName={cn("gap-2.5 px-4 pb-1", contentContainerClassName)}
        initialNumToRender={skeletonItemsCount}
        maxToRenderPerBatch={skeletonItemsCount}
        windowSize={3}
        removeClippedSubviews
      />
    );
  }

  return (
    <FlatList
      horizontal
      data={items}
      keyExtractor={(item, index) => (keyExtractor ? keyExtractor(item, index) : index.toString())}
      renderItem={({ item, index }) => <View>{renderItem(item, index)}</View>}
      ListFooterComponent={trailingAction}
      showsHorizontalScrollIndicator={false}
      className={cn("-mx-4", scrollViewClassName)}
      contentContainerClassName={cn("gap-2.5 px-4 pb-1", contentContainerClassName)}
      initialNumToRender={4}
      maxToRenderPerBatch={4}
      windowSize={5}
      removeClippedSubviews
    />
  );
}

function HorizontalScrollSectionHeaderAction({
  actionLabel,
  actionIcon,
  onPress,
}: {
  actionLabel?: string;
  actionIcon?: LucideIcon;
  onPress: NonNullable<HorizontalScrollSectionProps<unknown>["onActionPress"]>;
}) {
  const ActionIcon = actionIcon ?? ChevronRight;

  return (
    <View className="self-stretch justify-center">
      <Button
        variant="ghost"
        size="sm"
        onPress={onPress}
        className="h-14 flex-row items-center gap-1.5 self-center px-3 py-2 active:opacity-80"
      >
        <Text className="text-sm font-semibold leading-5 text-foreground">{actionLabel}</Text>
        <Icon as={ActionIcon} size={15} className="text-muted-foreground" strokeWidth={2.5} />
      </Button>
    </View>
  );
}

function HorizontalScrollSectionTrailingAction({
  actionLabel,
  onPress,
}: {
  actionLabel?: string;
  onPress?: HorizontalScrollSectionProps<unknown>["onActionPress"];
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityState={{ disabled: !onPress }}
      className="min-h-[224px] w-[112px] items-center justify-center gap-3 active:opacity-80"
    >
      <View className="h-12 w-12 items-center justify-center rounded-full bg-card shadow-sm">
        <Icon as={ChevronRight} size={22} className="text-foreground" strokeWidth={2.5} />
      </View>
      <Text className="text-center text-[13px] font-semibold leading-5 text-foreground">
        {actionLabel}
      </Text>
    </Pressable>
  );
}
