import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { View, type GestureResponderEvent } from "react-native";

type ContinuousSliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onValueChange: (value: number) => void;
  className?: string;
  formatValue?: (value: number) => string;
};

function getStepPrecision(step: number) {
  const [, decimals = ""] = step.toString().split(".");
  return decimals.length;
}

function clampValue(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function ContinuousSlider({
  label,
  value,
  min,
  max,
  step,
  onValueChange,
  className,
  formatValue = (currentValue) => `${currentValue}`,
}: ContinuousSliderProps) {
  const [trackWidth, setTrackWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<View>(null);
  const trackPageXRef = useRef(0);
  const trackWidthRef = useRef(0);
  const clampedValue = clampValue(value, min, max);
  const progress = max === min ? 0 : (clampedValue - min) / (max - min);
  const thumbSize = isDragging ? 24 : 20;
  const rawThumbOffset = trackWidth * progress - thumbSize / 2;
  const thumbOffset = Math.min(Math.max(rawThumbOffset, 0), Math.max(trackWidth - thumbSize, 0));
  const valueLabel = formatValue(clampedValue);

  function updateTrackMetrics() {
    trackRef.current?.measureInWindow((pageX, _y, width) => {
      trackPageXRef.current = pageX;
      trackWidthRef.current = width;
      setTrackWidth(width);
    });
  }

  function getValueFromPageX(pageX: number) {
    const width = trackWidthRef.current;

    if (width === 0) {
      return clampedValue;
    }

    const locationX = clampValue(pageX - trackPageXRef.current, 0, width);
    const rawValue = min + (locationX / width) * (max - min);
    const snappedValue = min + Math.round((rawValue - min) / step) * step;
    const precision = getStepPrecision(step);

    return clampValue(Number(snappedValue.toFixed(precision)), min, max);
  }

  function handleResponderGrant(event: GestureResponderEvent) {
    setIsDragging(true);
    onValueChange(getValueFromPageX(event.nativeEvent.pageX));
  }

  function handleResponderMove(event: GestureResponderEvent) {
    onValueChange(getValueFromPageX(event.nativeEvent.pageX));
  }

  function handleResponderEnd() {
    setIsDragging(false);
  }

  return (
    <View className={cn("gap-2", className)}>
      <View className="flex-row items-center justify-between gap-3">
        <Text className="text-[13px] font-semibold text-foreground">{label}</Text>
        <View className="rounded-full bg-primary/10 px-2.5 py-1">
          <Text className="text-[12px] font-semibold text-primary">{valueLabel}</Text>
        </View>
      </View>

      <View
        ref={trackRef}
        className="h-10 justify-center"
        onLayout={updateTrackMetrics}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={handleResponderGrant}
        onResponderMove={handleResponderMove}
        onResponderRelease={handleResponderEnd}
        onResponderTerminate={handleResponderEnd}
      >
        <View className="h-1.5 rounded-full bg-muted">
          <View
            className="h-1.5 rounded-full bg-primary"
            style={{ width: trackWidth * progress }}
          />
          {trackWidth > 0 ? (
            <View
              className={cn(
                "absolute rounded-full border-[3px] border-primary bg-background shadow-sm",
                isDragging ? "size-6" : "size-5",
              )}
              style={{
                left: thumbOffset,
                top: -((thumbSize - 6) / 2),
              }}
            />
          ) : null}
        </View>
      </View>
    </View>
  );
}

export { ContinuousSlider };
export type { ContinuousSliderProps };
