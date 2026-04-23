import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { SearchX } from "lucide-react-native";
import { View } from "react-native";

export function EmptyRoutesState({
  hasActiveCriteria,
  onReset,
}: {
  hasActiveCriteria: boolean;
  onReset: () => void;
}) {
  return (
    <View className="flex-1 items-center justify-center gap-4 rounded-xl border border-border/70 bg-card p-6">
      <View className="h-12 w-12 items-center justify-center rounded-lg bg-muted">
        <Icon as={SearchX} size={24} className="text-muted-foreground" strokeWidth={2.2} />
      </View>
      <View className="gap-1">
        <Text className="text-center text-[18px] font-extrabold text-foreground">
          Brak tras w tym widoku
        </Text>
        <Text className="text-center text-[13px] leading-5 text-muted-foreground">
          {hasActiveCriteria
            ? "Zmień wyszukiwanie albo aktywne filtry."
            : "Nie ma jeszcze dodanych tras."}
        </Text>
      </View>
      {hasActiveCriteria ? (
        <Button className="h-10 rounded-lg px-4" onPress={onReset}>
          <Text className="text-[13px] font-bold text-primary-foreground">Wyczyść widok</Text>
        </Button>
      ) : null}
    </View>
  );
}

export function RoutesLoadingState() {
  return (
    <View className="flex-1 gap-4 bg-background px-4 pt-4">
      <View className="gap-2">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <Skeleton className="h-5 w-64 rounded-lg" />
      </View>
      <Skeleton className="h-12 w-full rounded-xl" />
      <View className="flex-row gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-24 rounded-lg" />
        ))}
      </View>
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={`route-card-${index}`} className="h-96 w-full rounded-xl" />
      ))}
    </View>
  );
}
