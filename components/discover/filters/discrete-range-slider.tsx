import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { View, type GestureResponderEvent } from "react-native";

type RangeSliderOption<TValue extends string | number> = {
  value: TValue;
  label: string;
};

type DiscreteRangeSliderProps<TValue extends string | number> = {
  label: string;
  minValue: TValue | null;
  maxValue: TValue | null;
  options: readonly RangeSliderOption<TValue>[];
  onMinValueChange: (value: TValue | null) => void;
  onMaxValueChange: (value: TValue | null) => void;
  className?: string;
};

type ActiveThumb = "min" | "max";

function DiscreteRangeSlider<TValue extends string | number>({
  label,
  minValue,
  maxValue,
  options,
  onMinValueChange,
  onMaxValueChange,
  className,
}: DiscreteRangeSliderProps<TValue>) {
  const trackRef = useRef<View>(null);
  const trackPageXRef = useRef(0);
  const trackWidthRef = useRef(0);
  const activeThumbRef = useRef<ActiveThumb | null>(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const [activeThumb, setActiveThumb] = useState<ActiveThumb | null>(null);
  const hasMinValue = minValue !== null;
  const hasMaxValue = maxValue !== null;
  const lastIndex = Math.max(options.length - 1, 1);
  const minIndex = hasMinValue
    ? Math.max(
        0,
        options.findIndex((option) => option.value === minValue),
      )
    : 0;
  const maxIndex = hasMaxValue
    ? Math.max(
        0,
        options.findIndex((option) => option.value === maxValue),
      )
    : lastIndex;
  const normalizedMinIndex = Math.min(minIndex, maxIndex);
  const normalizedMaxIndex = Math.max(minIndex, maxIndex);
  const minProgress = normalizedMinIndex / lastIndex;
  const maxProgress = normalizedMaxIndex / lastIndex;
  const selectedMinLabel = hasMinValue ? options[normalizedMinIndex]?.label : undefined;
  const selectedMaxLabel = hasMaxValue ? options[normalizedMaxIndex]?.label : undefined;

  const summaryLabel =
    !hasMinValue && !hasMaxValue
      ? "Dowolnie"
      : !hasMinValue
        ? `Do ${selectedMaxLabel ?? "dowolnie"}`
        : !hasMaxValue
          ? `Od ${selectedMinLabel ?? "dowolnie"}`
          : `${selectedMinLabel ?? "dowolnie"} - ${selectedMaxLabel ?? "dowolnie"}`;

  function setTrackMetrics(pageX: number, width: number) {
    trackPageXRef.current = pageX;

    if (width > 0) {
      trackWidthRef.current = width;
      setTrackWidth(width);
    }
  }

  function getIndexFromPageX(pageX: number, width = trackWidthRef.current) {
    if (width === 0) {
      return 0;
    }

    const locationX = pageX - trackPageXRef.current;
    const clampedLocationX = Math.min(Math.max(locationX, 0), width);
    return Math.round((clampedLocationX / width) * lastIndex);
  }

  function getNearestThumb(pageX: number, width = trackWidthRef.current): ActiveThumb {
    const locationX = pageX - trackPageXRef.current;
    const minX = width * minProgress;
    const maxX = width * maxProgress;
    return Math.abs(locationX - minX) <= Math.abs(locationX - maxX) ? "min" : "max";
  }

  function setThumbValue(thumb: ActiveThumb, index: number) {
    if (thumb === "min") {
      const nextIndex = Math.min(index, normalizedMaxIndex);
      onMinValueChange(nextIndex === 0 ? null : (options[nextIndex]?.value ?? null));
      return;
    }

    const nextIndex = Math.max(index, normalizedMinIndex);
    onMaxValueChange(nextIndex === lastIndex ? null : (options[nextIndex]?.value ?? null));
  }

  function measureTrack(pageX?: number) {
    trackRef.current?.measureInWindow((x, _y, width) => {
      const resolvedWidth = width > 0 ? width : trackWidthRef.current;
      setTrackMetrics(x, resolvedWidth);

      if (pageX === undefined) {
        return;
      }

      const nextThumb = getNearestThumb(pageX, resolvedWidth);
      activeThumbRef.current = nextThumb;
      setActiveThumb(nextThumb);
      setThumbValue(nextThumb, getIndexFromPageX(pageX, resolvedWidth));
    });
  }

  function handleResponderGrant(event: GestureResponderEvent) {
    measureTrack(event.nativeEvent.pageX);
  }

  function handleResponderMove(event: GestureResponderEvent) {
    const currentThumb = activeThumbRef.current;

    if (!currentThumb) {
      return;
    }

    setThumbValue(currentThumb, getIndexFromPageX(event.nativeEvent.pageX));
  }

  function handleResponderEnd() {
    activeThumbRef.current = null;
    setActiveThumb(null);
  }

  function handleLayout() {
    measureTrack();
  }

  function getThumbClassName(thumb: ActiveThumb) {
    return cn(
      "absolute rounded-full border-[3px] border-primary bg-background shadow-sm",
      activeThumb === thumb ? "size-6" : "size-5",
    );
  }

  function getThumbStyle(progress: number, thumb: ActiveThumb) {
    const thumbSize = activeThumb === thumb ? 24 : 20;

    return {
      left: trackWidth * progress - thumbSize / 2,
      top: -((thumbSize - 6) / 2),
    };
  }

  return (
    <View className={cn("gap-2", className)}>
      <View className="flex-row items-center justify-between gap-3">
        <Text className="text-[13px] font-semibold text-foreground">{label}</Text>
        <Text className="text-[13px] font-semibold text-primary">{summaryLabel}</Text>
      </View>

      <View
        ref={trackRef}
        className="h-8 justify-center"
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;
          trackWidthRef.current = width;
          setTrackWidth(width);
          handleLayout();
        }}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={handleResponderGrant}
        onResponderMove={handleResponderMove}
        onResponderRelease={handleResponderEnd}
        onResponderTerminate={handleResponderEnd}
      >
        <View className="h-1.5 rounded-full bg-muted">
          <View
            className="absolute h-1.5 rounded-full bg-primary"
            style={{
              left: trackWidth * minProgress,
              width: trackWidth * (maxProgress - minProgress),
            }}
          />
          {trackWidth > 0 ? (
            <>
              <View
                className={getThumbClassName("min")}
                style={getThumbStyle(minProgress, "min")}
              />
              <View
                className={getThumbClassName("max")}
                style={getThumbStyle(maxProgress, "max")}
              />
            </>
          ) : null}
        </View>
      </View>
    </View>
  );
}

export { DiscreteRangeSlider };
export type { DiscreteRangeSliderProps, RangeSliderOption };
