import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Trophy, UserRoundSearch, WifiOff } from "lucide-react-native";
import { View } from "react-native";

type LeaderboardEmptyVariant = "global" | "friends";

const EMPTY_COPY: Record<
  LeaderboardEmptyVariant,
  { title: string; description: string; icon: typeof Trophy }
> = {
  global: {
    title: "Na ścianie jeszcze pusto",
    description:
      "Nikt jeszcze nie zdobył punktów w tym tygodniu. Pierwsze przejścia pojawią się tutaj.",
    icon: Trophy,
  },
  friends: {
    title: "Brak znajomych na ścianie",
    description: "Gdy Twoi znajomi zaczną zbierać punkty, zobaczysz ich tutaj.",
    icon: UserRoundSearch,
  },
};

export function LeaderboardEmptyState({ variant }: { variant: LeaderboardEmptyVariant }) {
  const copy = EMPTY_COPY[variant];

  return (
    <View className="items-center gap-4 rounded-xl border border-border/70 bg-card px-5 py-10">
      <View className="h-12 w-12 items-center justify-center rounded-lg bg-muted">
        <Icon as={copy.icon} size={24} className="text-muted-foreground" strokeWidth={2.2} />
      </View>
      <View className="gap-1">
        <Text className="text-center text-[18px] font-extrabold text-foreground">{copy.title}</Text>
        <Text className="text-center text-[13px] leading-5 text-muted-foreground">
          {copy.description}
        </Text>
      </View>
    </View>
  );
}

export function LeaderboardUnavailableState() {
  return (
    <View className="items-center gap-4 rounded-xl border border-border/70 bg-card px-5 py-10">
      <View className="h-12 w-12 items-center justify-center rounded-lg bg-muted">
        <Icon as={Trophy} size={24} className="text-muted-foreground" strokeWidth={2.2} />
      </View>
      <View className="gap-1">
        <Text className="text-center text-[18px] font-extrabold text-foreground">
          Ściana rankingu niedostępna
        </Text>
        <Text className="text-center text-[13px] leading-5 text-muted-foreground">
          Po zalogowaniu zobaczysz tu aktualne wyniki wspinaczy.
        </Text>
      </View>
    </View>
  );
}

export function LeaderboardErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <View className="items-center gap-4 rounded-xl border border-border/70 bg-card px-5 py-10">
      <View className="h-12 w-12 items-center justify-center rounded-lg bg-muted">
        <Icon as={WifiOff} size={24} className="text-muted-foreground" strokeWidth={2.2} />
      </View>
      <View className="gap-1">
        <Text className="text-center text-[18px] font-extrabold text-foreground">
          Nie udało się wczytać ściany
        </Text>
        <Text className="text-center text-[13px] leading-5 text-muted-foreground">
          Sprawdź połączenie z internetem i spróbuj ponownie.
        </Text>
      </View>
      {onRetry ? (
        <Button className="h-10 rounded-lg px-4" onPress={onRetry}>
          <Text className="text-[13px] font-bold text-primary-foreground">Spróbuj ponownie</Text>
        </Button>
      ) : null}
    </View>
  );
}
