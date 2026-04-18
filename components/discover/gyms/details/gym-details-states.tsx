import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { ArrowLeft, MapPin } from "lucide-react-native";
import { ActivityIndicator, View } from "react-native";

function GymDetailsLoadingState() {
  return (
    <View className="flex-1 bg-background px-4 pt-4">
      <Skeleton className="h-64 w-full rounded-lg" />
      <View className="mt-4 flex-row gap-2">
        <Skeleton className="h-12 flex-1 rounded-lg" />
        <Skeleton className="h-12 flex-1 rounded-lg" />
        <Skeleton className="h-12 flex-1 rounded-lg" />
      </View>
      <View className="mt-4 gap-3">
        <Skeleton className="h-48 w-full rounded-lg" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </View>
      <View className="absolute inset-0 items-center justify-center">
        <ActivityIndicator size="large" className="text-primary scale-150" />
      </View>
    </View>
  );
}

function GymNotFoundState({
  onBackPress,
  onDiscoverPress,
}: {
  onBackPress: () => void;
  onDiscoverPress: () => void;
}) {
  return (
    <View className="flex-1 items-center justify-center gap-5 bg-background px-6">
      <View className="h-14 w-14 items-center justify-center rounded-lg border border-border bg-card">
        <Icon as={MapPin} size={24} className="text-muted-foreground" strokeWidth={2.3} />
      </View>
      <View className="gap-2">
        <Text className="text-center text-[22px] font-bold leading-8 text-foreground">
          Nie znaleziono ścianki
        </Text>
        <Text className="text-center text-[14px] leading-6 text-muted-foreground">
          Ta ścianka mogła zniknąć z listy albo link jest nieaktualny.
        </Text>
      </View>
      <View className="w-full gap-2">
        <Button className="h-12 w-full rounded-lg" onPress={onBackPress}>
          <Icon as={ArrowLeft} size={16} className="text-primary-foreground" strokeWidth={2.4} />
          <Text className="text-[13px] font-bold text-primary-foreground">Wróć</Text>
        </Button>
        <Button
          variant="outline"
          className="h-12 w-full rounded-lg border-border bg-card"
          onPress={onDiscoverPress}
        >
          <Text className="text-[13px] font-bold text-foreground">Otwórz odkrywanie</Text>
        </Button>
      </View>
    </View>
  );
}

export { GymDetailsLoadingState, GymNotFoundState };
