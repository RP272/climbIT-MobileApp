import { HorizontalScrollSection } from "@/components/discover/horizontal-scroll-section";
import { RecommendedRouteCard } from "@/components/discover/routes/recommended-routes-section";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { useChallengeDetails } from "@/src/features/discover/hooks/useDiscoverChallenges";
import { useGymDetails } from "@/src/features/discover/hooks/useDiscoverGyms";
import { useRecommendedRoutes } from "@/src/features/discover/hooks/useRecommendedRoutes";
import { getChallengeProgressRoutes } from "@/src/features/discover/utils/challenges.utils";
import type { Challenge, ChallengeIconName, Gym, RecommendedRoute } from "@/src/types/discover";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Bookmark,
  CalendarClock,
  Flame,
  Gauge,
  MapPin,
  Mountain,
  Repeat2,
  Sparkles,
  Star,
  Trophy,
  Zap,
  type LucideIcon,
} from "lucide-react-native";
import { useCallback, useMemo } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CHALLENGE_ICON_MAP: Record<ChallengeIconName, LucideIcon> = {
  flame: Flame,
  mountain: Mountain,
  repeat: Repeat2,
  sparkles: Sparkles,
  star: Star,
  zap: Zap,
};

export default function ChallengeDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { challengeId } = useLocalSearchParams<{ challengeId?: string | string[] }>();
  const selectedChallengeId = getParamValue(challengeId);
  const { data: challenge, isLoading: isLoadingChallenge } =
    useChallengeDetails(selectedChallengeId);
  const { data: gym, isLoading: isLoadingGym } = useGymDetails(challenge?.gymId);
  const { data: routes = [], isLoading: isLoadingRoutes } = useRecommendedRoutes();

  const progressRoutes = useMemo(
    () => (challenge ? getChallengeProgressRoutes(challenge, routes) : []),
    [challenge, routes],
  );

  const handleBackPress = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/(tabs)/discover");
  }, [router]);

  const handleDiscoverPress = useCallback(() => {
    router.replace("/(tabs)/discover");
  }, [router]);

  const handleRoutePress = useCallback(
    (route: RecommendedRoute) => {
      router.push({
        pathname: "/(tabs)/discover/routes/[routeId]" as any,
        params: { routeId: route.id },
      });
    },
    [router],
  );

  const handleAllRoutesPress = useCallback(() => {
    if (!challenge?.id) {
      return;
    }

    router.push({
      pathname: "/(tabs)/discover/challenge-routes/[challengeId]" as any,
      params: { challengeId: challenge.id },
    });
  }, [challenge?.id, router]);

  if (isLoadingChallenge || (challenge?.gymId && isLoadingGym)) {
    return <ChallengeDetailsLoadingState />;
  }

  if (!challenge) {
    return (
      <ChallengeNotFoundState onBackPress={handleBackPress} onDiscoverPress={handleDiscoverPress} />
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="gap-5 px-4 pt-4"
      contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 92, 116) }}
      showsVerticalScrollIndicator={false}
    >
      <ChallengeDetailsHero challenge={challenge} gym={gym} />
      <PinChallengeAction />
      <ChallengeRulesSection challenge={challenge} />
      <ChallengeProgressRoutesSection
        routes={progressRoutes}
        isLoading={isLoadingRoutes}
        onActionPress={handleAllRoutesPress}
        onRoutePress={handleRoutePress}
      />
    </ScrollView>
  );
}

function ChallengeDetailsHero({ challenge, gym }: { challenge: Challenge; gym?: Gym | null }) {
  const icon = CHALLENGE_ICON_MAP[challenge.iconName];
  const progress = Math.round(challenge.progress);

  return (
    <View className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
      <View className="gap-4 p-4">
        <View className="flex-row items-start justify-between gap-4">
          <View className="min-w-0 flex-1 gap-3">
            <View className="flex-row flex-wrap gap-2">
              <HeroBadge icon={CalendarClock} label={challenge.expiresLabel ?? "Aktywne teraz"} />
              <HeroBadge icon={Gauge} label={challenge.difficultyLabel ?? "Wyzwanie"} />
            </View>

            <View className="gap-2">
              <Text className="text-[29px] font-extrabold leading-9 text-foreground">
                {challenge.title}
              </Text>
            </View>
          </View>

          <View className="h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
            <Icon as={icon} size={27} className="text-primary" strokeWidth={2.5} />
          </View>
        </View>

        <View className="gap-3">
          <View className="flex-row items-end justify-between gap-3">
            <View className="min-w-0 flex-1 gap-1">
              <Text className="text-[12px] font-bold uppercase leading-4 text-muted-foreground">
                Postęp
              </Text>
              <Text
                numberOfLines={1}
                className="min-w-0 text-[14px] font-semibold leading-5 text-foreground"
              >
                {challenge.progressLabel}
              </Text>
            </View>
            <Text className="text-[30px] font-extrabold leading-9 text-primary">{progress}%</Text>
          </View>
          <Progress
            value={challenge.progress}
            className="h-3 rounded-full bg-muted"
            indicatorClassName="bg-primary"
          />
          <RewardPill rewardXp={challenge.rewardXp} />
        </View>

        {challenge.gymId ? <GymBoundNotice gym={gym} /> : null}
      </View>
    </View>
  );
}

function HeroBadge({ icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <View className="flex-row items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1.5">
      <Icon as={icon} size={12} className="text-muted-foreground" strokeWidth={2.4} />
      <Text className="text-[11px] font-bold leading-4 text-foreground">{label}</Text>
    </View>
  );
}

function RewardPill({ rewardXp }: { rewardXp: number }) {
  return (
    <View className="self-start flex-row items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-2">
      <Icon as={Trophy} size={14} className="text-primary" strokeWidth={2.4} />
      <Text className="text-[12px] font-extrabold leading-4 text-primary">+{rewardXp} XP</Text>
    </View>
  );
}

function GymBoundNotice({ gym }: { gym?: Gym | null }) {
  return (
    <View className="flex-row items-center gap-3 rounded-xl bg-primary/10 px-3.5 py-3">
      <View className="h-8 w-8 items-center justify-center rounded-lg bg-primary">
        <Icon as={MapPin} size={16} className="text-primary-foreground" strokeWidth={2.5} />
      </View>
      <Text className="min-w-0 flex-1 text-[13px] font-semibold leading-5 text-foreground">
        To wyzwanie wykonasz tylko na obiekcie {gym?.name ?? "przypisanym do wyzwania"}.
      </Text>
    </View>
  );
}

function PinChallengeAction() {
  return (
    <Button variant="outline" className="h-12 rounded-lg border-border/70 bg-background">
      <Icon as={Bookmark} size={16} className="text-foreground" strokeWidth={2.4} />
      <Text className="text-[13px] font-bold text-foreground">Przypnij do profilu</Text>
    </Button>
  );
}

function ChallengeRulesSection({ challenge }: { challenge: Challenge }) {
  const rules = challenge.rules ?? [
    "Zapisuj aktywności pasujące do wyzwania.",
    "Progres zaktualizuje się po ukończeniu celu.",
  ];

  return (
    <View className="gap-4">
      <View className="gap-1">
        <Text className="text-[18px] font-bold leading-6 text-foreground">Zasady wykonania</Text>
        <Text className="text-[13px] leading-5 text-muted-foreground">
          Progres nalicza się, gdy aktywność spełnia poniższe warunki.
        </Text>
      </View>

      <View className="gap-3">
        {rules.map((rule, index) => (
          <View key={`${rule}-${index}`} className="flex-row items-start gap-3">
            <View className="mt-0.5 h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted">
              <Text className="text-[11px] font-extrabold text-muted-foreground">{index + 1}</Text>
            </View>
            <Text className="min-w-0 flex-1 text-[14px] leading-6 text-foreground">{rule}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function ChallengeProgressRoutesSection({
  routes,
  isLoading,
  onActionPress,
  onRoutePress,
}: {
  routes: readonly RecommendedRoute[];
  isLoading: boolean;
  onActionPress: () => void;
  onRoutePress: (route: RecommendedRoute) => void;
}) {
  if (!isLoading && routes.length === 0) {
    return (
      <View className="gap-2">
        <Text className="text-[18px] font-bold leading-6 text-foreground">Trasy do progresu</Text>
        <Text className="text-[14px] leading-6 text-muted-foreground">
          Nie znaleźliśmy jeszcze tras, które pasują do zasad tego wyzwania.
        </Text>
      </View>
    );
  }

  return (
    <HorizontalScrollSection
      title="Trasy do progresu"
      description={`${routes.length} tras, których przejście zwiększy progres wyzwania`}
      items={routes}
      isLoading={isLoading}
      loadingItemsCount={2}
      contentContainerClassName="gap-3"
      renderLoadingItem={(index) => (
        <Skeleton key={`challenge-route-skeleton-${index}`} className="h-64 w-[300px] rounded-xl" />
      )}
      renderItem={(route) => (
        <RecommendedRouteCard
          key={route.id}
          route={route}
          containerClassName="w-[300px]"
          onPress={() => onRoutePress(route)}
        />
      )}
      keyExtractor={(route) => route.id}
      showAction={routes.length > 0}
      actionLabel="Lista"
      actionPlacement="header"
      onActionPress={onActionPress}
      scrollViewClassName="h-fit pr-4"
    />
  );
}

function ChallengeDetailsLoadingState() {
  return (
    <View className="flex-1 bg-background px-4 pt-4">
      <Skeleton className="h-64 w-full rounded-xl" />
      <View className="mt-6 gap-4">
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-32 w-full rounded-lg" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </View>
    </View>
  );
}

function ChallengeNotFoundState({
  onBackPress,
  onDiscoverPress,
}: {
  onBackPress: () => void;
  onDiscoverPress: () => void;
}) {
  return (
    <View className="flex-1 items-center justify-center gap-5 bg-background px-6">
      <View className="h-14 w-14 items-center justify-center rounded-lg border border-border bg-card">
        <Icon as={Trophy} size={24} className="text-muted-foreground" strokeWidth={2.3} />
      </View>
      <View className="gap-2">
        <Text className="text-center text-[22px] font-bold leading-8 text-foreground">
          Nie znaleziono wyzwania
        </Text>
        <Text className="text-center text-[14px] leading-6 text-muted-foreground">
          To wyzwanie mogło wygasnąć albo link jest nieaktualny.
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

function getParamValue(param: string | string[] | undefined) {
  return Array.isArray(param) ? param[0] : param;
}
