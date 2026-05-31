import {
  ChallengeCard,
  ChallengeCardSkeleton,
} from "@/components/discover/challenges/challenge-card";
import { HorizontalScrollSection } from "@/components/discover/horizontal-scroll-section";
import { RecommendedRouteCard } from "@/components/discover/routes/recommended-routes-section";
import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import type { RouteViewModel } from "@/src/types/all-routes.types";
import type { RouteSetterResponseDto } from "@/src/types/api";
import type { Challenge, RecommendedRoute } from "@/src/types/discover";
import {
  Building2,
  ExternalLink,
  Hand,
  Instagram,
  MapPin,
  Mountain,
  Play,
  Route as RouteIcon,
  Sparkles,
  UserRound,
  type LucideIcon,
} from "lucide-react-native";
import type { ReactNode } from "react";
import { ImageBackground, Linking, Pressable, View } from "react-native";

function RouteOverviewSection({
  routeViewModel,
  routeSetter: routeSetterDetails,
}: {
  routeViewModel: RouteViewModel;
  routeSetter?: RouteSetterResponseDto | null;
}) {
  const { route, routeSetter: routeSetterName, wallProfile, color } = routeViewModel;
  const climbStyleLabel = route.climbStyles?.join(" · ") ?? "Technical";

  return (
    <SectionCard title="O trasie">
      <View className="gap-3">
        <DetailRow icon={Building2} label="Ścianka" value={route.gymName} />
        <DetailRow icon={MapPin} label="Sektor" value={route.sector} />
        <RouteSetterDetailRow name={routeSetterName} routeSetter={routeSetterDetails} />
        <DetailRow icon={Hand} label="Hold" value={route.holdLabel} />
        <DetailRow icon={Mountain} label="Profil" value={wallProfile} />
        <DetailRow icon={RouteIcon} label="Typ" value={route.climbingTypeLabel} />
        <DetailRow icon={Sparkles} label="Styl" value={climbStyleLabel} />
        <ColorDetailRow color={color} />
      </View>
    </SectionCard>
  );
}

function RouteBetaSection({
  routeViewModel,
  onActionPress,
}: {
  routeViewModel: RouteViewModel;
  onActionPress?: () => void;
}) {
  const clips = getCommunityBetaClips(routeViewModel);

  return (
    <HorizontalScrollSection
      title="Beta społeczności"
      description={`${clips.length} krótkie klipy z przejściami i patentami`}
      items={clips}
      contentContainerClassName="gap-3"
      renderItem={(clip) => <CommunityBetaVideoCard key={clip.id} clip={clip} />}
      keyExtractor={(clip) => clip.id}
      showAction={true}
      actionLabel="Lista"
      actionPlacement="header"
      onActionPress={onActionPress}
      scrollViewClassName="h-fit pr-4"
    />
  );
}

function RouteGymChallengesSection({
  routeViewModel,
  challenges,
  isLoading,
  onActionPress,
  onChallengePress,
}: {
  routeViewModel: RouteViewModel;
  challenges: readonly Challenge[];
  isLoading: boolean;
  onActionPress: () => void;
  onChallengePress: (challenge: Challenge) => void;
}) {
  const matchingChallenges = challenges
    .filter((challenge) => getChallengeMatchScore(challenge, routeViewModel) > 0)
    .sort(
      (a, b) =>
        getChallengeMatchScore(b, routeViewModel) - getChallengeMatchScore(a, routeViewModel),
    );

  if (!isLoading && matchingChallenges.length === 0) {
    return null;
  }

  const chunkedChallenges = [];
  if (matchingChallenges) {
    for (let i = 0; i < matchingChallenges.length; i += 2) {
      chunkedChallenges.push(matchingChallenges.slice(i, i + 2));
    }
  }

  return (
    <HorizontalScrollSection
      title="Wyzwania na tej trasie"
      description="Przejście tej trasy da Ci progres w tych wyzwaniach"
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
              onPress={() => onChallengePress(challenge)}
            />
          ))}
        </View>
      )}
      keyExtractor={(_, index) => index.toString()}
      showAction={true}
      actionLabel="Lista"
      actionPlacement="header"
      onActionPress={onActionPress}
      scrollViewClassName="h-fit pr-4"
    />
  );
}

function RouteMoreRoutesSection({
  routes,
  currentRouteId,
  isLoading,
  onRoutePress,
  onActionPress,
}: {
  routes: readonly RecommendedRoute[];
  currentRouteId: string;
  isLoading: boolean;
  onRoutePress: (route: RecommendedRoute) => void;
  onActionPress: () => void;
}) {
  const otherRoutes = routes.filter((route) => route.id !== currentRouteId);

  if (!isLoading && otherRoutes.length === 0) {
    return null;
  }

  return (
    <HorizontalScrollSection
      title="Więcej z tej ścianki"
      description={`${otherRoutes.length} podobnych tras na tym obiekcie`}
      items={otherRoutes}
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
          onPress={() => onRoutePress(route)}
        />
      )}
      keyExtractor={(route) => route.id}
      showAction={true}
      actionLabel="Lista"
      actionPlacement="header"
      onActionPress={onActionPress}
      scrollViewClassName="h-fit pr-4"
    />
  );
}

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View className="gap-4 rounded-lg border border-border/80 bg-card p-4 shadow-sm">
      <View className="flex-row items-center gap-2">
        <View className="h-5 w-1 rounded-sm bg-primary" />
        <Text className="text-[18px] font-bold leading-6 text-foreground">{title}</Text>
      </View>
      {children}
    </View>
  );
}

function DetailRow({ icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <View className="flex-row items-center gap-3">
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

function RouteSetterDetailRow({
  name,
  routeSetter,
}: {
  name: string;
  routeSetter?: RouteSetterResponseDto | null;
}) {
  const links = [
    { label: "Strona", icon: ExternalLink, url: routeSetter?.siteUrl },
    { label: "Instagram", icon: Instagram, url: routeSetter?.instagramUrl },
  ].filter((link): link is { label: string; icon: LucideIcon; url: string } =>
    Boolean(link.url?.trim()),
  );

  return (
    <View className="flex-row items-center gap-3">
      <View className="h-9 w-9 items-center justify-center rounded-lg border border-border bg-background">
        <Icon as={UserRound} size={16} className="text-foreground" strokeWidth={2.3} />
      </View>
      <View className="min-w-0 flex-1 gap-1">
        <Text className="text-[12px] font-bold uppercase text-muted-foreground">Routesetter</Text>
        <Text className="text-[14px] leading-5 text-foreground" numberOfLines={1}>
          {name}
        </Text>
      </View>

      {links.length > 0 ? (
        <View className="shrink-0 flex-row items-center gap-1.5">
          {links.map((link) => (
            <Pressable
              key={link.label}
              accessibilityLabel={link.label}
              accessibilityRole="link"
              className="h-8 w-8 items-center justify-center rounded-md border border-border bg-background active:bg-muted/70"
              onPress={() => openExternalUrl(link.url)}
            >
              <Icon as={link.icon} size={14} className="text-foreground" strokeWidth={2.3} />
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

function openExternalUrl(url: string) {
  void Linking.openURL(normalizeExternalUrl(url)).catch(() => undefined);
}

function normalizeExternalUrl(url: string) {
  const trimmedUrl = url.trim();

  if (/^https?:\/\//i.test(trimmedUrl)) {
    return trimmedUrl;
  }

  return `https://${trimmedUrl}`;
}

function ColorDetailRow({ color }: { color: RouteViewModel["color"] }) {
  return (
    <View className="flex-row items-center gap-3">
      <View className="h-9 w-9 items-center justify-center rounded-lg border border-border bg-background">
        <View className={cn("h-4 w-4 rounded-full", color.dotClassName)} style={color.dotStyle} />
      </View>
      <View className="min-w-0 flex-1 gap-0.5">
        <Text className="text-[12px] font-bold uppercase text-muted-foreground">Kolor</Text>
        <Text className="text-[14px] leading-5 text-foreground">{color.label}</Text>
      </View>
    </View>
  );
}

function getCommunityBetaClips(routeViewModel: RouteViewModel) {
  const authors = ["Marta z Cruxa", "Kuba Beta", "Ola na flashu", "Janek z patentem"] as const;
  const { route, popularity, communityGrade } = routeViewModel;
  const baseHash = getStableIndex(`${route.id}-clips`, authors.length);

  return [
    {
      id: `${route.id}-beta-1`,
      author: authors[baseHash % authors.length],
      title: "Pełne przejście",
      duration: "0:24",
      thumbnailUrl: route.imageUrl,
    },
    {
      id: `${route.id}-beta-2`,
      author: authors[(baseHash + 1) % authors.length],
      title: "Crux z bliska",
      duration: "0:13",
      thumbnailUrl: route.imageUrl,
    },
    {
      id: `${route.id}-beta-3`,
      author: authors[(baseHash + 2) % authors.length],
      title: communityGrade === route.grade ? "Patent społeczności" : `Wycena ${communityGrade}`,
      duration: popularity > 80 ? "0:31" : "0:18",
      thumbnailUrl: route.imageUrl,
    },
  ] satisfies readonly CommunityBetaClip[];
}

type CommunityBetaClip = {
  id: string;
  author: string;
  title: string;
  duration: string;
  thumbnailUrl: string;
};

function CommunityBetaVideoCard({ clip }: { clip: CommunityBetaClip }) {
  return (
    <View className="h-44 w-[300px] overflow-hidden rounded-[24px] border border-border/70 bg-muted shadow-sm">
      <ImageBackground
        source={{ uri: clip.thumbnailUrl }}
        resizeMode="cover"
        className="h-full w-full"
      >
        <View className="absolute inset-0 bg-black/25" />

        <View className="absolute left-3 right-3 top-3 flex-row items-start justify-between gap-2">
          <View className="flex-row items-center gap-1.5 rounded-lg bg-card px-2.5 py-1.5 shadow-sm">
            <Icon as={UserRound} size={12} className="text-foreground" strokeWidth={2.5} />
            <Text className="text-[11px] font-bold text-foreground">{clip.author}</Text>
          </View>
          <View className="rounded-lg bg-card px-2.5 py-1.5 shadow-sm">
            <Text className="text-[11px] font-bold text-foreground">{clip.duration}</Text>
          </View>
        </View>

        <View className="absolute inset-0 items-center justify-center">
          <View className="h-14 w-14 items-center justify-center rounded-full bg-card/95 shadow-sm">
            <Icon as={Play} size={24} className="ml-1 text-foreground" strokeWidth={2.3} />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

function getStableIndex(value: string, modulo: number) {
  const hash = value.split("").reduce((currentHash, character) => {
    return currentHash + character.charCodeAt(0);
  }, 0);

  return hash % modulo;
}

function getChallengeMatchScore(challenge: Challenge, routeViewModel: RouteViewModel) {
  const { route } = routeViewModel;
  let score = 0;

  if (challenge.climbingTypes.includes(route.climbingType)) {
    score += 3;
  }

  score +=
    route.routeCharacters.filter((character) => challenge.routeCharacters.includes(character))
      .length * 2;
  score += route.sessionGoals.filter((goal) => challenge.sessionGoals.includes(goal)).length * 2;
  score += route.routeStatuses.filter((status) => challenge.routeStatuses.includes(status)).length;

  const minGrade = Number(challenge.gradeScaleRange?.[0] ?? route.gradeScale);
  const maxGrade = Number(challenge.gradeScaleRange?.[1] ?? route.gradeScale);
  const routeGrade = Number(route.gradeScale);

  if (routeGrade >= minGrade && routeGrade <= maxGrade) {
    score += 2;
  }

  if (route.hasChallenge) {
    score += 1;
  }

  return score;
}

export {
  RouteBetaSection,
  RouteGymChallengesSection,
  RouteMoreRoutesSection,
  RouteOverviewSection,
};
