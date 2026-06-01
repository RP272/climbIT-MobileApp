import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Label } from "@/components/ui/label";
import {
  NativeSelectScrollView,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { fetchFacilities } from "@/src/api/facility.api";
import { REEL_TITLE_PLACEHOLDER } from "@/src/features/watch/utils/reel-metadata.utils";
import { isAuthError } from "@/src/api/is-auth-error";
import { fetchRouteById, fetchRoutesByFacilityId } from "@/src/api/routes.api";
import { useUploadWatchVideo } from "@/src/features/watch/hooks/useUploadWatchVideo";
import type { Gym, RecommendedRoute } from "@/src/types/discover";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { AlignLeft, ChevronLeft, MapPin, Mountain, Upload } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

type RouteParams = {
  videoUri: string;
  routeId?: string;
};

function decodeParam(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return "";

  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export default function Submit() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const params = useLocalSearchParams<RouteParams>();
  const decodedVideoUri = useMemo(() => decodeParam(params.videoUri), [params.videoUri]);
  const scannedRouteId = decodeParam(params.routeId);

  const HORIZONTAL_PADDING = 32;
  const COLUMN_GAP = 12;
  const contentWidth = screenWidth - HORIZONTAL_PADDING - COLUMN_GAP;
  const previewWidth = Math.max(150, Math.round(contentWidth * 0.33));
  const previewHeight = previewWidth * (16 / 9);

  const [title, setTitle] = useState("");
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [routes, setRoutes] = useState<RecommendedRoute[]>([]);
  const [isLoadingGyms, setIsLoadingGyms] = useState(true);
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(false);
  const [loadError, setLoadError] = useState<unknown>(null);
  const [selectedGymId, setSelectedGymId] = useState<string | undefined>();
  const [selectedRouteId, setSelectedRouteId] = useState<string | undefined>();
  const [retryNonce, setRetryNonce] = useState(0);

  const uploadMutation = useUploadWatchVideo();
  const player = useVideoPlayer(decodedVideoUri, (videoPlayer) => {
    videoPlayer.loop = true;
    videoPlayer.play();
  });

  useEffect(() => {
    player.muted = true;
  }, [player]);

  useEffect(() => {
    let mounted = true;

    setIsLoadingGyms(true);

    void fetchFacilities()
      .then(async (facilities) => {
        if (!mounted) {
          return;
        }

        setGyms(facilities);
        setLoadError(null);

        if (scannedRouteId) {
          const scannedRoute = await fetchRouteById(scannedRouteId);
          if (!mounted) {
            return;
          }

          if (scannedRoute?.gymId) {
            setSelectedGymId(scannedRoute.gymId);
            setSelectedRouteId(scannedRoute.id);
            return;
          }
        }

        setSelectedGymId(facilities[0]?.id);
      })
      .catch((error) => {
        if (!mounted) {
          return;
        }

        setLoadError(error);
      })
      .finally(() => {
        if (mounted) {
          setIsLoadingGyms(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [scannedRouteId, retryNonce]);

  useEffect(() => {
    if (!selectedGymId) {
      setRoutes([]);
      return;
    }

    let mounted = true;
    const gym = gyms.find((item) => item.id === selectedGymId);

    setIsLoadingRoutes(true);

    void fetchRoutesByFacilityId(selectedGymId, gym?.name ?? "")
      .then((facilityRoutes) => {
        if (!mounted) {
          return;
        }

        setRoutes(facilityRoutes);

        if (selectedRouteId && !facilityRoutes.some((route) => route.id === selectedRouteId)) {
          setSelectedRouteId(undefined);
        }
      })
      .catch(() => {
        if (!mounted) {
          return;
        }

        setRoutes([]);
      })
      .finally(() => {
        if (mounted) {
          setIsLoadingRoutes(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [selectedGymId, gyms]);

  const selectedGym = gyms.find((gym) => gym.id === selectedGymId);
  const selectedRoute = routes.find((route) => route.id === selectedRouteId);

  async function handleSubmit() {
    if (!decodedVideoUri) {
      Alert.alert("Błąd", "Brak nagrania do wysłania.");
      return;
    }

    if (!selectedRouteId) {
      Alert.alert("Trasa", "Wybierz trasę, żeby opublikować przejście.");
      return;
    }

    try {
      await uploadMutation.mutateAsync({
        videoUri: decodedVideoUri,
        routeId: selectedRouteId,
        title: title.trim() || undefined,
        routeName: selectedRoute?.name,
        place: selectedGym?.name,
      });
      router.replace("/(tabs)/watch");
    } catch {
      Alert.alert("Wysyłanie", "Nie udało się opublikować klipu. Spróbuj ponownie.");
    }
  }

  function handleGymChange(gymId: string | undefined) {
    setSelectedGymId(gymId);
    setSelectedRouteId(undefined);
  }

  if (!decodedVideoUri) {
    return (
      <View className="flex-1 items-center justify-center gap-3 bg-background px-8">
        <Text className="text-center text-base font-semibold">Brak nagrania</Text>
        <Button variant="secondary" onPress={() => router.back()}>
          <Text>Wróć</Text>
        </Button>
      </View>
    );
  }

  const canSubmit = Boolean(selectedRouteId) && !isLoadingGyms && !loadError;

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView edges={["top"]} className="px-4 pb-4 pt-2">
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={() => router.back()}
            disabled={uploadMutation.isPending}
            className="h-10 w-10 items-center justify-center rounded-full bg-muted active:opacity-80"
            accessibilityRole="button"
            accessibilityLabel="Wróć"
          >
            <Icon as={ChevronLeft} size={24} className="text-foreground" strokeWidth={2.2} />
          </Pressable>
          <View className="min-w-0 flex-1">
            <Text className="text-lg font-bold text-foreground">Opublikuj klip</Text>
            <Text className="text-sm text-muted-foreground">
              Wybierz obiekt i trasę. Utworzymy nowe przejście i przypiszemy do niego film.
            </Text>
          </View>
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            gap: 20,
            paddingHorizontal: 16,
            paddingTop: 8,
            paddingBottom: Math.max(insets.bottom + 140, 180),
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row items-start gap-3">
            <View className="min-w-0 flex-1 gap-2">
              <View className="flex-row items-center gap-2">
                <View className="h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Icon as={AlignLeft} size={15} className="text-primary" strokeWidth={2.4} />
                </View>
                <Label nativeID="title" className="text-base">
                  Opis
                </Label>
              </View>
              <Textarea
                nativeID="title"
                value={title}
                onChangeText={setTitle}
                placeholder={REEL_TITLE_PLACEHOLDER}
                editable={!uploadMutation.isPending}
                className="min-h-[96px] rounded-2xl"
              />
            </View>

            <View className="gap-2" style={{ width: previewWidth }}>
              <View className="h-8" />
              <View
                className="w-full overflow-hidden rounded-2xl border border-border bg-black shadow-md shadow-black/20"
                style={{ height: previewHeight }}
              >
                <VideoView
                  contentFit="cover"
                  nativeControls={false}
                  player={player}
                  style={{ width: previewWidth, height: previewHeight }}
                />
              </View>
            </View>
          </View>

          <View className="w-full gap-5">
            <View className="gap-2">
              <View className="flex-row items-center gap-2">
                <View className="h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Icon as={MapPin} size={15} className="text-primary" strokeWidth={2.4} />
                </View>
                <Label nativeID="gym" className="text-base">
                  Obiekt
                </Label>
              </View>
              <Select
                value={
                  selectedGymId
                    ? {
                        value: selectedGymId,
                        label: selectedGym?.name ?? "",
                      }
                    : undefined
                }
                onValueChange={(option) => handleGymChange(option?.value)}
                disabled={uploadMutation.isPending || isLoadingGyms || Boolean(loadError)}
              >
                <SelectTrigger nativeID="gym" className="h-12 w-full rounded-2xl">
                  {isLoadingGyms ? (
                    <ActivityIndicator size="small" />
                  ) : loadError ? (
                    <Text className="text-sm text-muted-foreground">
                      {isAuthError(loadError) ? "Wymagane logowanie" : "Błąd ładowania obiektów"}
                    </Text>
                  ) : gyms.length === 0 ? (
                    <Text className="text-sm text-muted-foreground">Brak obiektów w bazie</Text>
                  ) : (
                    <SelectValue placeholder="Wybierz obiekt" />
                  )}
                </SelectTrigger>
                <SelectContent className="w-full">
                  <NativeSelectScrollView>
                    {gyms.map((gym) => (
                      <SelectItem key={gym.id} value={gym.id} label={gym.name}>
                        {gym.name}
                      </SelectItem>
                    ))}
                  </NativeSelectScrollView>
                </SelectContent>
              </Select>
              {isAuthError(loadError) ? null : loadError ? (
                <Pressable onPress={() => setRetryNonce((value) => value + 1)}>
                  <Text className="text-xs font-medium text-primary">Spróbuj ponownie</Text>
                </Pressable>
              ) : null}
            </View>

            <View className="gap-2">
              <View className="flex-row items-center gap-2">
                <View className="h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Icon as={Mountain} size={15} className="text-primary" strokeWidth={2.4} />
                </View>
                <Label nativeID="route" className="text-base">
                  Trasa
                </Label>
              </View>
              <Select
                value={
                  selectedRouteId && selectedRoute
                    ? {
                        value: selectedRouteId,
                        label: selectedRoute.name,
                      }
                    : undefined
                }
                onValueChange={(option) => setSelectedRouteId(option?.value)}
                disabled={
                  uploadMutation.isPending ||
                  !selectedGymId ||
                  isLoadingRoutes ||
                  Boolean(loadError) ||
                  routes.length === 0
                }
              >
                <SelectTrigger nativeID="route" className="h-12 w-full rounded-2xl">
                  {!selectedGymId ? (
                    <Text className="text-sm text-muted-foreground">Najpierw wybierz obiekt</Text>
                  ) : isLoadingRoutes ? (
                    <ActivityIndicator size="small" />
                  ) : routes.length === 0 ? (
                    <Text className="text-sm text-muted-foreground">
                      Na tej ścianie nie ma jeszcze trasy
                    </Text>
                  ) : (
                    <SelectValue placeholder="Wybierz trasę" />
                  )}
                </SelectTrigger>
                <SelectContent className="w-full">
                  <NativeSelectScrollView>
                    {routes.map((route) => (
                      <SelectItem key={route.id} value={route.id} label={route.name}>
                        {route.name}
                      </SelectItem>
                    ))}
                  </NativeSelectScrollView>
                </SelectContent>
              </Select>
            </View>
          </View>

          <Button
            className="h-12 w-full rounded-full"
            disabled={uploadMutation.isPending || !canSubmit}
            onPress={() => void handleSubmit()}
          >
            {uploadMutation.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Icon as={Upload} size={18} className="text-primary-foreground" strokeWidth={2.4} />
                <Text className="font-semibold text-primary-foreground">Opublikuj</Text>
              </>
            )}
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
