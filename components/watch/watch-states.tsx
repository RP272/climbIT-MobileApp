import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Camera, Clapperboard, WifiOff } from "lucide-react-native";
import { View } from "react-native";

export function WatchEmptyState({ onRecordPress }: { onRecordPress?: () => void }) {
  return (
    <View className="flex-1 items-center justify-center gap-5 px-8">
      <View className="h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
        <Icon as={Clapperboard} size={30} className="text-white" strokeWidth={2.1} />
      </View>
      <View className="gap-2">
        <Text className="text-center text-xl font-bold text-white">Brak przejść</Text>
        <Text className="text-center text-sm leading-5 text-white/65">
          Nikt jeszcze nie dodał nagrania. Nagraj pierwsze przejście albo wróć później, gdy pojawią
          się nowe bouldery.
        </Text>
      </View>
      {onRecordPress ? (
        <Button variant="secondary" className="h-11 rounded-full px-5" onPress={onRecordPress}>
          <Icon as={Camera} size={18} className="text-secondary-foreground" strokeWidth={2.2} />
          <Text className="font-semibold">Nagraj przejście</Text>
        </Button>
      ) : null}
    </View>
  );
}

export function WatchUnavailableState() {
  return (
    <View className="flex-1 items-center justify-center gap-5 px-8">
      <View className="h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
        <Icon as={Clapperboard} size={30} className="text-white" strokeWidth={2.1} />
      </View>
      <View className="gap-2">
        <Text className="text-center text-xl font-bold text-white">Przejścia niedostępne</Text>
        <Text className="text-center text-sm leading-5 text-white/65">
          Po uruchomieniu logowania zobaczysz tu nagrania ze społeczności climbIT.
        </Text>
      </View>
    </View>
  );
}

export function WatchErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <View className="flex-1 items-center justify-center gap-5 px-8">
      <View className="h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
        <Icon as={WifiOff} size={28} className="text-white" strokeWidth={2.1} />
      </View>
      <View className="gap-2">
        <Text className="text-center text-xl font-bold text-white">
          Nie udało się pobrać przejść
        </Text>
        <Text className="text-center text-sm leading-5 text-white/65">
          Sprawdź połączenie z internetem i spróbuj ponownie.
        </Text>
      </View>
      {onRetry ? (
        <Button variant="secondary" className="h-11 rounded-full px-5" onPress={onRetry}>
          <Text className="font-semibold">Spróbuj ponownie</Text>
        </Button>
      ) : null}
    </View>
  );
}
