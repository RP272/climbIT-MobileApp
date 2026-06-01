import { Text } from "@/components/ui/text";
import { View } from "react-native";

export function HomeBrandTitle() {
  return (
    <View className="flex-row items-end justify-between">
      <View className="gap-1">
        <Text className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">
          climbIT
        </Text>
        <Text className="text-[28px] font-extrabold leading-8 text-foreground">Twoja ścianka</Text>
        <Text className="text-sm text-muted-foreground">
          Sesje, reelsy i odkrywanie nowych dróg
        </Text>
      </View>
      <Text className="pb-1 text-3xl">🧗‍♀️🪨</Text>
    </View>
  );
}
