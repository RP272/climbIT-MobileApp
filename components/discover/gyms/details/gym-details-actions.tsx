import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import type { Gym } from "@/src/types/discover";
import { Navigation, Phone, Route } from "lucide-react-native";
import { View } from "react-native";

type GymDetailsActionsProps = {
  gym: Gym;
  onMapPress: (gym: Gym) => void;
  onPhonePress: (gym: Gym) => void;
  onRoutesPress: () => void;
};

function GymDetailsActions({
  gym,
  onMapPress,
  onPhonePress,
  onRoutesPress,
}: GymDetailsActionsProps) {
  const canOpenMap = Boolean(gym.coordinates || gym.address);
  const canCall = Boolean(gym.phone);

  return (
    <View className="flex-row gap-2">
      <Button
        className="h-12 flex-1 rounded-lg"
        onPress={() => onMapPress(gym)}
        disabled={!canOpenMap}
      >
        <Icon as={Navigation} size={16} className="text-primary-foreground" strokeWidth={2.4} />
        <Text className="text-[13px] font-bold text-primary-foreground">Mapa</Text>
      </Button>

      <Button
        variant="outline"
        className="h-12 flex-1 rounded-lg border-border bg-card"
        onPress={() => onPhonePress(gym)}
        disabled={!canCall}
      >
        <Icon as={Phone} size={16} className="text-foreground" strokeWidth={2.4} />
        <Text className="text-[13px] font-bold text-foreground">Zadzwoń</Text>
      </Button>

      <Button variant="secondary" className="h-12 flex-1 rounded-lg" onPress={onRoutesPress}>
        <Icon as={Route} size={16} className="text-secondary-foreground" strokeWidth={2.4} />
        <Text className="text-[13px] font-bold text-secondary-foreground">Trasy</Text>
      </Button>
    </View>
  );
}

export { GymDetailsActions };
