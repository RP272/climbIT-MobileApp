import {
  ChallengeCard,
  ChallengeCardSkeleton,
} from "@/components/discover/challenges/challenge-card";
import { HorizontalScrollSection } from "@/components/discover/horizontal-scroll-section";
import { RecommendedRouteCard } from "@/components/discover/routes/recommended-routes-section";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { useGymChallenges } from "@/src/features/discover/hooks/useGymChallenges";
import type { Gym, GymOpeningHours, RecommendedRoute } from "@/src/types/discover";
import { useRouter } from "expo-router";
import {
  CalendarDays,
  Clock3,
  ExternalLink,
  MapPin,
  Phone,
  Users,
  WalletCards,
  type LucideIcon,
} from "lucide-react-native";
import type { ReactNode } from "react";
import { View } from "react-native";

const WEEKDAYS_BY_DATE_INDEX = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

function GymVisitDetailsSection({ gym }: { gym: Gym }) {
  const todayHours = getTodayOpeningHours(gym.openingHours);

  return (
    <SectionCard title="Przed wizytą">
      <View className="gap-3">
        <DetailRow icon={MapPin} label="Adres" value={gym.address ?? `${gym.city}, Polska`} />
        <DetailRow
          icon={Clock3}
          label="Dzisiaj"
          value={todayHours ? `${todayHours.label}: ${todayHours.hours}` : "Godziny wkrótce"}
        />
        <DetailRow icon={Phone} label="Telefon" value={gym.phone ?? "Brak telefonu"} />
        <DetailRow icon={ExternalLink} label="Strona" value={gym.websiteUrl ?? "Brak strony"} />
        <DetailRow icon={WalletCards} label="Cennik" value={gym.priceLabel ?? "Cennik wkrótce"} />
        <DetailRow
          icon={Users}
          label="Ruch"
          value={gym.busyHoursLabel ?? "Brak danych o obłożeniu"}
        />
        <DetailRow
          icon={CalendarDays}
          label="Sety"
          value={gym.settingSchedule ?? "Harmonogram wkrótce"}
        />
      </View>
    </SectionCard>
  );
}

function GymChallengesSection({ gym }: { gym: Gym }) {
  const router = useRouter();
  const { data: challenges, isLoading } = useGymChallenges(gym.id);

  if (!gym.hasChallenges) {
    return null;
  }

  const chunkedChallenges = [];
  if (challenges) {
    for (let i = 0; i < challenges.length; i += 2) {
      chunkedChallenges.push(challenges.slice(i, i + 2));
    }
  }

  return (
    <HorizontalScrollSection
      title="Wyzwania na obiekcie"
      items={chunkedChallenges}
      isLoading={isLoading}
      loadingItemsCount={2}
      contentContainerClassName="gap-3"
      renderLoadingItem={() => (
        <View className="gap-3">
          <ChallengeCardSkeleton containerClassName="w-[300px]" />
          <ChallengeCardSkeleton containerClassName="w-[300px]" />
        </View>
      )}
      renderItem={(chunk) => (
        <View className="gap-3">
          {chunk.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              containerClassName="w-[300px]"
            />
          ))}
        </View>
      )}
      keyExtractor={(_, index) => index.toString()}
      showAction={true}
      actionLabel="Lista"
      actionPlacement="header"
      onActionPress={() => router.push(`/(tabs)/discover/gyms/${gym.id}/challenges`)}
      scrollViewClassName="h-fit pr-4"
    />
  );
}

function GymAmenitiesSection({ amenities }: Pick<Gym, "amenities">) {
  if (!amenities?.length) {
    return null;
  }

  return (
    <SectionCard title="Udogodnienia">
      <View className="flex-row flex-wrap gap-2">
        {amenities.map((amenity) => (
          <Badge
            key={amenity}
            variant="outline"
            className="rounded-lg border-border bg-background px-3 py-2"
          >
            <Text className="text-[12px] font-bold text-foreground">{amenity}</Text>
          </Badge>
        ))}
      </View>
    </SectionCard>
  );
}

function GymRoutesSection({
  routes,
  isLoading,
  gymId,
}: {
  routes: readonly RecommendedRoute[];
  isLoading: boolean;
  gymId: string;
}) {
  const router = useRouter();

  return (
    <HorizontalScrollSection
      title="Wszystkie trasy"
      description={`${routes.length} ${getRoutesCountLabel(routes.length)} dostępnych w tej ściance`}
      items={routes}
      isLoading={isLoading}
      loadingItemsCount={2}
      contentContainerClassName="gap-3"
      renderLoadingItem={(index) => (
        <Skeleton key={`route-skeleton-${index}`} className="h-64 w-[300px] rounded-[24px]" />
      )}
      renderItem={(route) => (
        <RecommendedRouteCard
          key={route.id}
          route={route}
          containerClassName="w-[300px]"
          onPress={() =>
            router.push({
              pathname: "/(tabs)/discover/routes/[routeId]",
              params: { routeId: route.id },
            })
          }
        />
      )}
      keyExtractor={(route) => route.id}
      showAction={true}
      actionLabel="Lista"
      actionPlacement="header"
      onActionPress={() => router.push(`/(tabs)/discover/gyms/${gymId}/routes`)}
      scrollViewClassName="h-fit pr-4"
    />
  );
}

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="gap-4 rounded-lg border-border/80 bg-card p-4 shadow-sm">
      <View className="flex-row items-center gap-2">
        <View className="h-5 w-1 rounded-sm bg-primary" />
        <Text className="text-[18px] font-bold leading-6 text-foreground">{title}</Text>
      </View>
      {children}
    </Card>
  );
}

function DetailRow({ icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <View className="flex-row items-start gap-3">
      <View className="h-9 w-9 items-center justify-center rounded-lg border border-border bg-background">
        <Icon as={icon} size={16} className="text-foreground" strokeWidth={2.3} />
      </View>
      <View className="min-w-0 flex-1 gap-0.5">
        <Text className="text-[12px] font-bold uppercase text-muted-foreground">{label}</Text>
        <Text className="text-[14px] leading-5 text-foreground">{value}</Text>
      </View>
    </View>
  );
}

function getTodayOpeningHours(openingHours: readonly GymOpeningHours[] | undefined) {
  if (!openingHours?.length) {
    return null;
  }

  const today = WEEKDAYS_BY_DATE_INDEX[new Date().getDay()];

  return openingHours.find((openingHour) => openingHour.day === today) ?? openingHours[0];
}

function getRoutesCountLabel(count: number) {
  if (count === 1) {
    return "trasa";
  }

  if (count >= 2 && count <= 4) {
    return "trasy";
  }

  return "tras";
}

export { GymAmenitiesSection, GymChallengesSection, GymRoutesSection, GymVisitDetailsSection };
