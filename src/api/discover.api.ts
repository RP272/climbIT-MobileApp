import { apiClient } from "@/src/api/api.client";
import challengesData from "@/src/data/challenges.json";
import gymsData from "@/src/data/gyms.json";
import recommendedRoutesData from "@/src/data/recommended-routes.json";
import { normalizeHexColor } from "@/src/features/discover/utils/route-color.utils";
import type {
  ChallengeResponseDto,
  FacilityResponseDto,
  RouteSetterResponseDto,
  RouteResponseDto,
  RouteTypeDto,
} from "@/src/types/api";
import type {
  Challenge,
  ChallengeIconName,
  ChallengeTone,
  ClimbProfile,
  ClimbStyleTags,
  Gym,
  RecommendedRoute,
  RouteStyleTags,
} from "@/src/types/discover";
import type {
  ClimbingGrade,
  ClimbingType,
  RouteCharacter,
  RouteStatus,
  SessionGoal,
} from "@/src/types/discover-filters";

const CLIMB_PROFILE_CHARACTERS = {
  Slab: ["balance"],
  Vertical: ["technical"],
  Overhang: ["overhang", "power"],
} as const satisfies Record<string, readonly RouteCharacter[]>;

const CLIMB_STYLE_LABELS = {
  Warmup: "Warmup",
  Dyno: "Dyno",
  Power: "Power",
  Endurance: "Endurance",
  Technical: "Technical",
  Balance: "Balance",
} as const;

const CLIMB_STYLE_CHARACTERS = {
  Warmup: ["technical"],
  Dyno: ["dynamic"],
  Power: ["power"],
  Endurance: ["endurance"],
  Technical: ["technical"],
  Balance: ["balance"],
} as const satisfies Record<keyof typeof CLIMB_STYLE_LABELS, readonly RouteCharacter[]>;

const CLIMB_STYLE_SESSION_GOALS = {
  Warmup: ["warmup"],
  Dyno: ["fun"],
  Power: ["training"],
  Endurance: ["training"],
  Technical: ["technique"],
  Balance: ["technique"],
} as const satisfies Partial<Record<keyof typeof CLIMB_STYLE_LABELS, readonly SessionGoal[]>>;

const FALLBACK_GYMS = gymsData as unknown as Gym[];
const FALLBACK_ROUTES = recommendedRoutesData.map(toFallbackRecommendedRoute);
const FALLBACK_CHALLENGES = challengesData as unknown as Challenge[];

const FALLBACK_GYM_IMAGES = FALLBACK_GYMS.map((gym) => gym.imageUrl);
const FALLBACK_ROUTE_IMAGES = FALLBACK_ROUTES.map((route) => route.imageUrl);

const DEFAULT_GYM_IMAGE =
  FALLBACK_GYM_IMAGES[0] ??
  "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=1200&q=80";
const DEFAULT_ROUTE_IMAGE =
  FALLBACK_ROUTE_IMAGES[0] ??
  "https://images.unsplash.com/photo-1564769662533-4f00a87b4056?auto=format&fit=crop&w=1200&q=80";

export async function fetchFeaturedGyms(): Promise<Gym[]> {
  const [facilities, routes, challenges] = await Promise.all([
    fetchFacilities(),
    fetchAllFacilityRoutes(),
    fetchWeeklyChallenges(),
  ]);

  return facilities.map((facility, index) =>
    toGym(facility, index, {
      routes: routes.filter((route) => route.facilityId === facility.id),
      challenges: challenges.filter((challenge) => challenge.gymId === facility.id),
    }),
  );
}

export async function fetchGymById(gymId: string): Promise<Gym | null> {
  if (!gymId) {
    return null;
  }

  const [facility, routes, challenges] = await Promise.all([
    fetchFacility(gymId),
    fetchRoutesByFacilityId(gymId),
    fetchWeeklyChallenges(),
  ]);

  return toGym(facility, getStableIndex(facility.id, FALLBACK_GYMS.length || 1), {
    routes,
    challenges: challenges.filter((challenge) => challenge.gymId === facility.id),
  });
}

export async function fetchRecommendedRoutes(): Promise<RecommendedRoute[]> {
  const [facilities, routes, challengeDtos] = await Promise.all([
    fetchFacilities(),
    fetchAllFacilityRoutes(),
    fetchChallenges(),
  ]);

  return toRecommendedRoutes(routes, facilities, challengeDtos);
}

export async function fetchRouteById(routeId: string): Promise<RecommendedRoute | null> {
  if (!routeId) {
    return null;
  }

  const [route, facilities, challengeDtos] = await Promise.all([
    fetchRoute(routeId),
    fetchFacilities(),
    fetchChallenges(),
  ]);

  return toRecommendedRoute(route, {
    facility: facilities.find((facility) => facility.id === route.facilityId),
    challengeRouteIds: getChallengeRouteIds(challengeDtos),
    index: getStableIndex(route.id, FALLBACK_ROUTES.length || 1),
  });
}

export async function fetchRouteSetterById(
  routeSetterId: string,
): Promise<RouteSetterResponseDto | null> {
  if (!routeSetterId) {
    return null;
  }

  return fetchRouteSetter(routeSetterId);
}

export async function fetchRoutesByGymId(gymId: string): Promise<RecommendedRoute[]> {
  if (!gymId) {
    return [];
  }

  const [facility, routes, challengeDtos] = await Promise.all([
    fetchFacility(gymId),
    fetchRoutesByFacilityId(gymId),
    fetchChallenges(),
  ]);

  return toRecommendedRoutes(routes, [facility], challengeDtos);
}

export async function fetchWeeklyChallenges(): Promise<Challenge[]> {
  const [challengeDtos, facilities] = await Promise.all([fetchChallenges(), fetchFacilities()]);

  return challengeDtos.map((challenge, index) =>
    toChallenge(challenge, {
      facility: getChallengeFacility(challenge, facilities),
      fallback: FALLBACK_CHALLENGES[index % FALLBACK_CHALLENGES.length],
      index,
    }),
  );
}

export async function fetchChallengeById(challengeId: string): Promise<Challenge | null> {
  if (!challengeId) {
    return null;
  }

  const [challenge, facilities] = await Promise.all([
    fetchChallenge(challengeId),
    fetchFacilities(),
  ]);

  return toChallenge(challenge, {
    facility: getChallengeFacility(challenge, facilities),
    fallback: FALLBACK_CHALLENGES.find((item) => item.id === challenge.id),
    index: getStableIndex(challenge.id, FALLBACK_CHALLENGES.length || 1),
  });
}

export async function fetchChallengesByGymId(gymId: string): Promise<Challenge[]> {
  if (!gymId) {
    return [];
  }

  const challenges = await fetchWeeklyChallenges();

  return challenges.filter((challenge) => challenge.gymId === gymId);
}

export async function fetchChallengeRoutes(challengeId: string): Promise<RecommendedRoute[]> {
  if (!challengeId) {
    return [];
  }

  const [routes, facilities, challenge] = await Promise.all([
    fetchChallengeRouteDtos(challengeId),
    fetchFacilities(),
    fetchChallenge(challengeId),
  ]);

  return toRecommendedRoutes(routes, facilities, [challenge]);
}

function fetchFacilities() {
  return apiClient.get<FacilityResponseDto[]>("/facilities").then((response) => response.data);
}

function fetchFacility(facilityId: string) {
  return apiClient
    .get<FacilityResponseDto>(`/facilities/${facilityId}`)
    .then((response) => response.data);
}

function fetchRoutesByFacilityId(facilityId: string) {
  return apiClient
    .get<RouteResponseDto[]>(`/routes/fetch-all/${facilityId}`)
    .then((response) => response.data);
}

async function fetchAllFacilityRoutes() {
  const facilities = await fetchFacilities();
  const routeGroups = await Promise.all(
    facilities.map((facility) => fetchRoutesByFacilityId(facility.id)),
  );

  return routeGroups.flat();
}

function fetchRoute(routeId: string) {
  return apiClient.get<RouteResponseDto>(`/routes/${routeId}`).then((response) => response.data);
}

function fetchRouteSetter(routeSetterId: string) {
  return apiClient
    .get<RouteSetterResponseDto>(`/route-setters/${routeSetterId}`)
    .then((response) => response.data);
}

function fetchChallenges() {
  return apiClient.get<ChallengeResponseDto[]>("/challenges").then((response) => response.data);
}

function fetchChallenge(challengeId: string) {
  return apiClient
    .get<ChallengeResponseDto>(`/challenges/${challengeId}`)
    .then((response) => response.data);
}

function fetchChallengeRouteDtos(challengeId: string) {
  return apiClient
    .get<RouteResponseDto[]>(`/challenges/${challengeId}/routes`)
    .then((response) => response.data);
}

function toGym(
  facility: FacilityResponseDto,
  index: number,
  {
    routes,
    challenges,
  }: {
    routes: readonly RouteResponseDto[];
    challenges: readonly Challenge[];
  },
): Gym {
  const fallback = getGymFallback(facility, index);
  const activeRoutes = routes.filter((route) => route.status !== "INACTIVE");
  const routeTypes = getRouteTypes(activeRoutes);
  const routeStatuses = getGymRouteStatuses(activeRoutes);

  return {
    ...fallback,
    id: facility.id,
    name: facility.name,
    city: getCityFromAddress(facility.address) ?? fallback.city,
    newRoutesCount: activeRoutes.length || fallback.newRoutesCount,
    imageUrl: fallback.imageUrl ?? DEFAULT_GYM_IMAGE,
    tags: getGymTags(routeTypes, routeStatuses),
    isOpenNow: fallback.isOpenNow,
    climbingTypes: routeTypes.length ? routeTypes : fallback.climbingTypes,
    gradeScaleRange: getGradeScaleRange(activeRoutes) ?? fallback.gradeScaleRange,
    routeCharacters: getRouteCharacters(activeRoutes),
    sessionGoals: getSessionGoals(activeRoutes),
    routeStatuses,
    hasChallenges: challenges.length > 0,
    description: facility.description ?? fallback.description,
    address: facility.address ?? fallback.address,
  };
}

function toRecommendedRoutes(
  routes: readonly RouteResponseDto[],
  facilities: readonly FacilityResponseDto[],
  challenges: readonly (Challenge | ChallengeResponseDto)[],
) {
  const challengeRouteIds = getChallengeRouteIds(challenges);

  return routes.map((route, index) =>
    toRecommendedRoute(route, {
      facility: facilities.find((facility) => facility.id === route.facilityId),
      challengeRouteIds,
      index,
    }),
  );
}

function toRecommendedRoute(
  route: RouteResponseDto,
  {
    facility,
    challengeRouteIds,
    index,
  }: {
    facility?: FacilityResponseDto;
    challengeRouteIds: ReadonlySet<string>;
    index: number;
  },
): RecommendedRoute {
  const fallback = getRouteFallback(route, index);
  const climbingType = toClimbingType(route.type) ?? fallback.climbingType;
  const grade = formatGrade(route.difficultyGrade, fallback.grade);
  const gradeScale = toClimbingGrade(route.difficultyGrade, fallback.gradeScale);
  const climbProfile = getRouteClimbProfile(route, fallback);
  const climbStyles = getRouteClimbStyles(route, fallback);
  const routeCharacters = getRouteCharacters([route]);
  const sessionGoals = getSessionGoals([route]);
  const routeStatuses = toRouteStatuses(route);
  const hasChallenge = challengeRouteIds.has(route.id);

  return {
    ...fallback,
    id: route.id,
    gymId: route.facilityId ?? fallback.gymId,
    grade,
    gradeScale,
    name: route.name,
    gymName: facility?.name ?? fallback.gymName,
    sector: route.sector ?? fallback.sector,
    routeSetterId: getRouteSetterId(route),
    climbingType,
    climbingTypeLabel: getClimbingTypeLabel(climbingType),
    distanceKm: fallback.distanceKm,
    isOpenNow: fallback.isOpenNow,
    imageUrl: fallback.imageUrl ?? DEFAULT_ROUTE_IMAGE,
    holdLabel: getRouteHoldLabel(route, fallback),
    climbProfile,
    climbStyles,
    styleTags: normalizeRouteStyleTags(climbStyles),
    holdColorHex: normalizeHexColor(route.color) ?? fallback.holdColorHex,
    routeCharacters,
    sessionGoals,
    routeStatuses,
    hasChallenge,
    recommendationReason: route.description ?? getRecommendationReason(route),
    badge: route.basePoints
      ? `+${route.basePoints} XP`
      : hasChallenge
        ? "Wyzwanie"
        : fallback.badge,
  };
}

function getRouteSetterId(route: RouteResponseDto) {
  return route.routeSetterId ?? route.route_setter_id;
}

function toChallenge(
  challenge: ChallengeResponseDto,
  {
    facility,
    fallback,
    index,
  }: {
    facility?: FacilityResponseDto;
    fallback?: Challenge;
    index: number;
  },
): Challenge {
  const routeIdsCount = challenge.routeIds.length;
  const requiredCount = Math.max(challenge.requiredCount ?? routeIdsCount, 1);
  const progressCount = Math.min(
    Math.max(challenge.progress?.progressCount ?? 0, 0),
    requiredCount,
  );
  const progress = Math.round((progressCount / requiredCount) * 100);
  const rewardXp = challenge.bonusPoints ?? fallback?.rewardXp ?? 100;
  const descriptionRules = getChallengeDescriptionRules(challenge.description);

  return {
    id: challenge.id,
    gymId: facility?.id ?? fallback?.gymId,
    title: challenge.name,
    description: challenge.description ?? fallback?.description,
    progressLabel: `${progressCount}/${requiredCount} tras`,
    progress,
    progressCount,
    requiredCount,
    rewardXp,
    rewardLabel: fallback?.rewardLabel ?? `${rewardXp} XP za ukończenie`,
    expiresLabel: formatExpiresLabel(challenge.endDate),
    difficultyLabel: fallback?.difficultyLabel ?? "Wyzwanie",
    suggestedActionLabel: fallback?.suggestedActionLabel ?? "Wybierz trasę",
    rules:
      descriptionRules.length > 0
        ? descriptionRules
        : (fallback?.rules ??
          getChallengeRules(challenge, routeIdsCount, facility?.name ?? "wybranym obiekcie")),
    iconName: fallback?.iconName ?? getChallengeIcon(index),
    tone: fallback?.tone ?? getChallengeTone(index),
    distanceKm: fallback?.distanceKm ?? 0,
    isOpenNow: fallback?.isOpenNow ?? true,
    climbingTypes: fallback?.climbingTypes ?? ["bouldering", "rope"],
    gradeScaleRange: fallback?.gradeScaleRange,
    routeCharacters: fallback?.routeCharacters ?? [],
    sessionGoals: fallback?.sessionGoals ?? ["training"],
    routeStatuses: fallback?.routeStatuses ?? ["not-done"],
    mode: "with-challenge",
  };
}

function getChallengeDescriptionRules(description: string | undefined) {
  return (
    description
      ?.split(";")
      .map((rule) => rule.trim())
      .filter(Boolean) ?? []
  );
}

function getGymFallback(facility: FacilityResponseDto, index: number) {
  return (
    FALLBACK_GYMS.find((gym) => gym.id === facility.id || gym.name === facility.name) ??
    FALLBACK_GYMS[index % FALLBACK_GYMS.length] ?? {
      id: facility.id,
      name: facility.name,
      city: "Wrocław",
      distanceKm: 0,
      newRoutesCount: 0,
      rating: 4.7,
      imageUrl: DEFAULT_GYM_IMAGE,
      tags: ["Ścianka"],
      isOpenNow: true,
      climbingTypes: ["bouldering"],
      gradeScaleRange: ["1", "9"],
      routeCharacters: ["technical"],
      sessionGoals: ["training"],
      routeStatuses: ["not-done"],
      hasChallenges: false,
    }
  );
}

function getRouteFallback(route: RouteResponseDto, index: number) {
  return (
    FALLBACK_ROUTES.find((fallbackRoute) => fallbackRoute.id === route.id) ??
    FALLBACK_ROUTES[index % FALLBACK_ROUTES.length] ?? {
      id: route.id,
      gymId: route.facilityId ?? "",
      grade: "5",
      gradeScale: "5",
      name: route.name,
      gymName: "Ścianka",
      sector: "Sektor",
      climbingType: "bouldering",
      climbingTypeLabel: "Boulder",
      distanceKm: 0,
      isOpenNow: true,
      imageUrl: DEFAULT_ROUTE_IMAGE,
      holdLabel: "Jug",
      climbProfile: "Vertical",
      climbStyles: ["Technical"],
      styleTags: ["Technical"],
      holdColorHex: undefined,
      routeCharacters: ["technical"],
      sessionGoals: ["training"],
      routeStatuses: ["not-done"],
      hasChallenge: false,
      recommendationReason: "dostępna na backendzie.",
    }
  );
}

function toFallbackRecommendedRoute(
  route: (typeof recommendedRoutesData)[number],
): RecommendedRoute {
  const climbStyles = normalizeClimbStyles(route.climbStyles);

  return {
    ...(route as unknown as Omit<
      RecommendedRoute,
      "holdLabel" | "climbProfile" | "climbStyles" | "styleTags"
    >),
    holdLabel: normalizeHoldLabel(route.holdLabel),
    climbProfile: normalizeClimbProfile(route.climbProfile),
    climbStyles,
    styleTags: normalizeRouteStyleTags(climbStyles),
  };
}

function normalizeHoldLabel(holdLabel: unknown) {
  return typeof holdLabel === "string" && holdLabel.trim() ? holdLabel : "Jug";
}

function normalizeRouteStyleTags(tags: readonly string[]): RouteStyleTags {
  const [primaryTag, secondaryTag] = tags;

  if (!primaryTag) {
    return ["Technical"];
  }

  return secondaryTag ? [primaryTag, secondaryTag] : [primaryTag];
}

function normalizeClimbProfile(profile: unknown): ClimbProfile {
  const normalizedProfile = typeof profile === "string" ? profile : undefined;

  return isClimbProfile(normalizedProfile) ? normalizedProfile : "Vertical";
}

function normalizeClimbStyles(styles: unknown): ClimbStyleTags {
  if (!Array.isArray(styles)) {
    return ["Technical"];
  }

  const normalizedStyles = styles.filter(isClimbStyle);
  const [primaryStyle, secondaryStyle] = normalizedStyles;

  if (!primaryStyle) {
    return ["Technical"];
  }

  return secondaryStyle ? [primaryStyle, secondaryStyle] : [primaryStyle];
}

function getRouteTypes(routes: readonly RouteResponseDto[]) {
  const routeTypes = routes
    .map((route) => toClimbingType(route.type))
    .filter((type): type is ClimbingType => Boolean(type));

  return Array.from(new Set(routeTypes));
}

function toClimbingType(type: RouteTypeDto | undefined): ClimbingType | null {
  switch (type) {
    case "BOULDER":
      return "bouldering";
    case "ROPE":
      return "rope";
    case "AUTO_BELAY":
      return "auto-belay";
    default:
      return null;
  }
}

function getClimbingTypeLabel(type: ClimbingType) {
  switch (type) {
    case "bouldering":
      return "Boulder";
    case "rope":
      return "Lina";
    case "auto-belay":
      return "Auto";
  }
}

function getGymTags(types: readonly ClimbingType[], statuses: readonly RouteStatus[]) {
  const tags = [
    statuses.includes("new") ? "Nowe sety" : null,
    types.includes("bouldering") ? "Boulder" : null,
    types.includes("rope") ? "Lina" : null,
    types.includes("auto-belay") ? "Auto" : null,
  ].filter((tag): tag is string => Boolean(tag));

  return tags.length ? tags.slice(0, 2) : ["Ścianka"];
}

function getGymRouteStatuses(routes: readonly RouteResponseDto[]): RouteStatus[] {
  const statuses = new Set<RouteStatus>();

  if (routes.some(isNewRoute)) {
    statuses.add("new");
  }

  statuses.add("not-done");

  if (routes.length >= 5) {
    statuses.add("popular");
  }

  return Array.from(statuses);
}

function toRouteStatuses(route: RouteResponseDto): RouteStatus[] {
  const statuses = new Set<RouteStatus>(["not-done"]);

  if (isNewRoute(route) || route.status === "PLANNED") {
    statuses.add("new");
  }

  if ((route.basePoints ?? 0) >= 120) {
    statuses.add("popular");
  }

  return Array.from(statuses);
}

function isNewRoute(route: RouteResponseDto) {
  if (!route.createdAt) {
    return route.status === "PLANNED";
  }

  const createdAt = new Date(route.createdAt).getTime();

  return Number.isFinite(createdAt) && Date.now() - createdAt < 14 * 24 * 60 * 60 * 1000;
}

function getGradeScaleRange(
  routes: readonly RouteResponseDto[],
): readonly [ClimbingGrade, ClimbingGrade] | null {
  const grades = routes
    .map((route) => route.difficultyGrade)
    .filter((grade): grade is number => typeof grade === "number")
    .map((grade) => Number(toClimbingGrade(grade, "5")));

  if (!grades.length) {
    return null;
  }

  return [toClimbingGrade(Math.min(...grades), "1"), toClimbingGrade(Math.max(...grades), "9")];
}

function formatGrade(grade: number | undefined, fallback: string) {
  if (typeof grade !== "number") {
    return fallback;
  }

  return String(grade);
}

function toClimbingGrade(grade: number | undefined, fallback: ClimbingGrade): ClimbingGrade {
  if (typeof grade !== "number") {
    return fallback;
  }

  const normalizedGrade = Math.min(9, Math.max(1, Math.floor(grade / 10) || grade));
  const gradeText = String(normalizedGrade).charAt(0);

  if (isClimbingGrade(gradeText)) {
    return gradeText;
  }

  return fallback;
}

function isClimbingGrade(value: string): value is ClimbingGrade {
  return ["1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(value);
}

function getRouteHoldLabel(route: RouteResponseDto, fallback: RecommendedRoute) {
  if (!route.hold) {
    return fallback.holdLabel;
  }

  switch (route.hold) {
    case "JUG":
      return "Jug";
    case "CRIMP":
      return "Crimp";
    case "SLOPER":
      return "Sloper";
    case "PINCH":
      return "Pinch";
    case "POCKET":
      return "Pocket";
    case "EDGE":
      return "Edge";
  }
}

function getRouteCharacters(routes: readonly RouteResponseDto[]): RouteCharacter[] {
  const characters = new Set<RouteCharacter>();

  routes.forEach((route, index) => {
    const fallback = getRouteFallback(route, index);
    const profile = getRouteClimbProfile(route, fallback);

    CLIMB_PROFILE_CHARACTERS[profile].forEach((character) => characters.add(character));

    getRouteClimbStyles(route, fallback).forEach((style) => {
      CLIMB_STYLE_CHARACTERS[style].forEach((character) => characters.add(character));
    });
  });

  return Array.from(characters.size ? characters : new Set<RouteCharacter>(["technical"]));
}

function getSessionGoals(routes: readonly RouteResponseDto[]): SessionGoal[] {
  const goals = new Set<SessionGoal>();

  routes.forEach((route, index) => {
    const fallback = getRouteFallback(route, index);

    getRouteClimbStyles(route, fallback).forEach((style) => {
      CLIMB_STYLE_SESSION_GOALS[style]?.forEach((goal) => goals.add(goal));
    });
  });

  return Array.from(goals.size ? goals : new Set<SessionGoal>(["training"]));
}

function getRouteClimbProfile(route: RouteResponseDto, fallback: RecommendedRoute): ClimbProfile {
  const values = [
    route.climbProfile,
    route.climb_profile,
    route.profile,
    ...(route.profiles ?? []).map((profile) =>
      typeof profile === "string" ? profile : profile.profile,
    ),
  ];

  const [profile] = values.filter(isClimbProfile);

  return profile ?? fallback.climbProfile ?? "Vertical";
}

function getRouteClimbStyles(route: RouteResponseDto, fallback: RecommendedRoute): ClimbStyleTags {
  const values = [
    route.climbStyle,
    route.climb_style,
    route.style,
    ...(route.styles ?? []).map((style) => (typeof style === "string" ? style : style.style)),
  ];

  const styles = values.filter(isClimbStyle);

  return normalizeClimbStyles(styles.length ? styles : fallback.climbStyles);
}

function isClimbProfile(
  value: string | undefined | null,
): value is keyof typeof CLIMB_PROFILE_CHARACTERS {
  return Boolean(value && value in CLIMB_PROFILE_CHARACTERS);
}

function isClimbStyle(value: string | undefined | null): value is keyof typeof CLIMB_STYLE_LABELS {
  return Boolean(value && value in CLIMB_STYLE_LABELS);
}

function getChallengeRouteIds(challenges: readonly (Challenge | ChallengeResponseDto)[]) {
  return new Set(
    challenges.flatMap((challenge) => ("routeIds" in challenge ? challenge.routeIds : [])),
  );
}

function getChallengeFacility(
  challenge: ChallengeResponseDto,
  facilities: readonly FacilityResponseDto[],
) {
  const routeFacilityId = FALLBACK_ROUTES.find((route) =>
    challenge.routeIds.includes(route.id),
  )?.gymId;

  return routeFacilityId
    ? facilities.find((facility) => facility.id === routeFacilityId)
    : undefined;
}

function getRecommendationReason(route: RouteResponseDto) {
  if (route.status === "PLANNED") {
    return "planowana w najbliższym secie.";
  }

  if (route.sector) {
    return `sektor ${route.sector}.`;
  }

  return "dostępna na backendzie.";
}

function getCityFromAddress(address: string | undefined) {
  if (!address) {
    return null;
  }

  const parts = address.split(",").map((part) => part.trim());

  return parts[parts.length - 1] || parts[0] || null;
}

function formatExpiresLabel(endDate: string | undefined) {
  if (!endDate) {
    return "Brak";
  }

  const date = new Date(endDate);

  if (!Number.isFinite(date.getTime())) {
    return `Do ${endDate}`;
  }

  return `Do ${date.toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;
}

function getChallengeRules(
  challenge: ChallengeResponseDto,
  routeIdsCount: number,
  facilityName: string,
) {
  return [
    `Ukończ ${routeIdsCount || "wymagane"} trasy przypisane do wyzwania.`,
    `Wyzwanie jest powiązane z obiektem ${facilityName}.`,
    challenge.bonusPoints
      ? `Po ukończeniu otrzymasz ${challenge.bonusPoints} XP bonusu.`
      : "Bonus naliczy się po spełnieniu celu.",
  ];
}

function getChallengeIcon(index: number): ChallengeIconName {
  const icons: ChallengeIconName[] = ["star", "zap", "sparkles", "mountain", "repeat", "flame"];

  return icons[index % icons.length];
}

function getChallengeTone(index: number): ChallengeTone {
  const tones: ChallengeTone[] = ["primary", "cyan", "amber", "rose", "sky", "emerald"];

  return tones[index % tones.length];
}

function getStableIndex(value: string, modulo: number) {
  if (modulo <= 0) {
    return 0;
  }

  const hash = value.split("").reduce((currentHash, character) => {
    return currentHash + character.charCodeAt(0);
  }, 0);

  return hash % modulo;
}
