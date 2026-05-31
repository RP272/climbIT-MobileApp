import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { ChevronRight, type LucideIcon } from "lucide-react-native";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Animated,
  FlatList,
  Pressable,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";

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
  trailingActionClassName?: string;
  className?: string;
  scrollViewClassName?: string;
  contentContainerClassName?: string;
};

type HorizontalScrollSectionHeaderProps = Pick<
  HorizontalScrollSectionProps<unknown>,
  "title" | "description" | "actionLabel" | "actionIcon" | "onActionPress"
> & {
  isActionVisible?: boolean;
};

type HorizontalScrollSectionItemsProps<T> = Pick<
  HorizontalScrollSectionProps<T>,
  | "items"
  | "isLoading"
  | "loadingItemsCount"
  | "renderLoadingItem"
  | "renderItem"
  | "keyExtractor"
  | "actionLabel"
  | "trailingActionClassName"
  | "scrollViewClassName"
  | "contentContainerClassName"
> & {
  showTrailingAction: boolean;
  onTrailingActionPress?: () => void;
  onScrolledToEndChange?: (isScrolledToEnd: boolean) => void;
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
  trailingActionClassName,
  className,
  scrollViewClassName,
  contentContainerClassName,
}: HorizontalScrollSectionProps<T>) {
  const [isScrolledToEnd, setIsScrolledToEnd] = useState(false);
  const shouldShowHeaderAction = showAction && Boolean(onActionPress);
  const shouldShowTrailingAction = showAction && actionPlacement === "trailing";
  const isHeaderActionVisible = actionPlacement === "header" || !isScrolledToEnd;

  return (
    <View className={cn("gap-3", className)}>
      <HorizontalScrollSectionHeader
        title={title}
        description={description}
        actionLabel={actionLabel}
        actionIcon={actionIcon}
        onActionPress={shouldShowHeaderAction ? onActionPress : undefined}
        isActionVisible={isHeaderActionVisible}
      />
      <HorizontalScrollSectionItems
        items={items}
        isLoading={isLoading}
        loadingItemsCount={loadingItemsCount}
        renderLoadingItem={renderLoadingItem}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        actionLabel={actionLabel}
        trailingActionClassName={trailingActionClassName}
        showTrailingAction={shouldShowTrailingAction}
        onTrailingActionPress={shouldShowTrailingAction ? onActionPress : undefined}
        onScrolledToEndChange={setIsScrolledToEnd}
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
  isActionVisible = true,
}: HorizontalScrollSectionHeaderProps) {
  return (
    <View className="flex-row items-center justify-between gap-3">
      <HorizontalScrollSectionCopy title={title} description={description} />
      {onActionPress ? (
        <HorizontalScrollSectionHeaderAction
          actionLabel={actionLabel}
          actionIcon={actionIcon}
          onPress={onActionPress}
          isVisible={isActionVisible}
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
  trailingActionClassName,
  showTrailingAction,
  onTrailingActionPress,
  scrollViewClassName,
  contentContainerClassName,
  onScrolledToEndChange,
}: HorizontalScrollSectionItemsProps<T>) {
  const skeletonItemsCount = loadingItemsCount ?? 3;
  const shouldRenderLoading = isLoading && Boolean(renderLoadingItem);
  const trailingAction = showTrailingAction ? (
    <HorizontalScrollSectionTrailingAction
      actionLabel={actionLabel}
      className={trailingActionClassName}
      onPress={onTrailingActionPress}
    />
  ) : null;
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!showTrailingAction) {
      return;
    }

    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const hasScrollableOverflow = contentSize.width > layoutMeasurement.width + 20;
    const isAtEnd =
      hasScrollableOverflow &&
      contentOffset.x > 8 &&
      contentOffset.x + layoutMeasurement.width >= contentSize.width - 20;
    onScrolledToEndChange?.(isAtEnd);
  };

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
        onScroll={handleScroll}
        scrollEventThrottle={16}
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
      keyExtractor={(item, index) => getHorizontalScrollItemKey(item, index, keyExtractor)}
      renderItem={({ item, index }) => <View>{renderItem(item, index)}</View>}
      ListFooterComponent={trailingAction}
      showsHorizontalScrollIndicator={false}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      className={cn("-mx-4", scrollViewClassName)}
      contentContainerClassName={cn("gap-2.5 px-4 pb-1", contentContainerClassName)}
      initialNumToRender={4}
      maxToRenderPerBatch={4}
      windowSize={5}
      removeClippedSubviews
    />
  );
}

function getHorizontalScrollItemKey<T>(
  item: T,
  index: number,
  keyExtractor?: (item: T, index: number) => string,
) {
  const itemKey = keyExtractor?.(item, index);

  return itemKey ?? index.toString();

function HorizontalScrollSectionHeaderAction({
  actionLabel,
  actionIcon,
  onPress,
  isVisible = true,
}: {
  actionLabel?: string;
  actionIcon?: LucideIcon;
  onPress: NonNullable<HorizontalScrollSectionProps<unknown>["onActionPress"]>;
  isVisible?: boolean;
}) {
  const ActionIcon = actionIcon ?? ChevronRight;
  const visibility = useRef(new Animated.Value(isVisible ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(visibility, {
      toValue: isVisible ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [isVisible, visibility]);

  return (
    <Animated.View
      pointerEvents={isVisible ? "auto" : "none"}
      className="self-stretch justify-center"
      style={{
        width: "40%",
        opacity: visibility,
        transform: [
          {
            translateX: visibility.interpolate({
              inputRange: [0, 1],
              outputRange: [8, 0],
            }),
          },
        ],
      }}
    >
      <Button
        variant="ghost"
        size="sm"
        onPress={onPress}
        className="min-h-14 w-full flex-row items-center justify-center gap-1.5 self-center px-3 py-2 active:opacity-80"
      >
        <Text className="min-w-0 flex-1 text-center text-sm font-semibold leading-5 text-foreground">
          {actionLabel}
        </Text>
        <Icon as={ActionIcon} size={15} className="text-muted-foreground" strokeWidth={2.5} />
      </Button>
    </Animated.View>
  );
}

function HorizontalScrollSectionTrailingAction({
  actionLabel,
  className,
  onPress,
}: {
  actionLabel?: string;
  className?: string;
  onPress?: HorizontalScrollSectionProps<unknown>["onActionPress"];
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityState={{ disabled: !onPress }}
      className={cn(
        "min-h-[224px] w-[112px] items-center justify-center gap-3 active:opacity-80",
        className,
      )}
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
