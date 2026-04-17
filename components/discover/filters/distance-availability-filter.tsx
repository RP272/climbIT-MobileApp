import { ContinuousSlider } from "@/components/discover/filters/continuous-slider";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import {
  MAX_RADIUS_KM,
  MIN_RADIUS_KM,
  RADIUS_STEP_KM,
  type RadiusKm,
} from "@/src/types/discover-filters";
import { View } from "react-native";

function formatRadius(radiusKm: RadiusKm) {
  if (radiusKm === 0) {
    return "0 km";
  }

  if (radiusKm < 1) {
    return `${Math.round(radiusKm * 1000)} m`;
  }

  if (Number.isInteger(radiusKm)) {
    return `${radiusKm} km`;
  }

  return `${radiusKm.toFixed(1).replace(".", ",")} km`;
}

type DistanceAvailabilityFilterProps = {
  radiusKm: RadiusKm;
  openNow: boolean;
  onRadiusChange: (radiusKm: RadiusKm) => void;
  onOpenNowChange: (openNow: boolean) => void;
};

function DistanceAvailabilityFilter({
  radiusKm,
  openNow,
  onRadiusChange,
  onOpenNowChange,
}: DistanceAvailabilityFilterProps) {
  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between gap-3">
        <Text className="text-[18px] font-bold tracking-tight text-foreground">
          Dystans i dostępność
        </Text>
        <View className="flex-row items-center gap-2 rounded-full bg-card px-3 py-2">
          <Text className="text-[11px] font-bold uppercase text-muted-foreground">Otwarte</Text>
          <Switch checked={openNow} onCheckedChange={onOpenNowChange} />
        </View>
      </View>

      <View className="gap-3 rounded-2xl bg-card px-4 py-4">
        <ContinuousSlider
          label="Promień"
          value={radiusKm}
          min={MIN_RADIUS_KM}
          max={MAX_RADIUS_KM}
          step={RADIUS_STEP_KM}
          formatValue={formatRadius}
          onValueChange={onRadiusChange}
        />
        <View className="flex-row justify-between">
          <Text className="text-[10px] font-bold uppercase text-muted-foreground">
            {MIN_RADIUS_KM} km
          </Text>
          <Text className="text-[10px] font-bold uppercase text-muted-foreground">
            {MAX_RADIUS_KM} km
          </Text>
        </View>
      </View>
    </View>
  );
}

export { DistanceAvailabilityFilter };
