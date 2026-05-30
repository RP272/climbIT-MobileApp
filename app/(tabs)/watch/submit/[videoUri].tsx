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
import { fetchRouteById } from "@/src/api/routes.api";
import { isAuthError } from "@/src/api/is-auth-error";
import { useDiscoverGyms } from "@/src/features/discover/hooks/useDiscoverGyms";
import { useGymRoutes } from "@/src/features/discover/hooks/useGymRoutes";
import { useUploadWatchVideo } from "@/src/features/watch/hooks/useUploadWatchVideo";
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
import { SafeAreaView } from "react-native-safe-area-context";

const HORIZONTAL_PADDING = 32;
const COLUMN_GAP = 12;

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
  const { width: screenWidth } = useWindowDimensions();
  const params = useLocalSearchParams<{ videoUri: string; routeId?: string }>();
  const decodedVideoUri = useMemo(() => decodeParam(params.videoUri), [params.videoUri]);
  const scannedRouteId = decodeParam(params.routeId);

  const contentWidth = screenWidth - HORIZONTAL_PADDING - COLUMN_GAP;
  const previewWidth = Math.round(contentWidth * 0.38);
  const previewHeight = previewWidth * (16 / 9);

  const [title, setTitle] = useState("");
  const [selectedGymId, setSelectedGymId] = useState<string | undefined>();
  const [selectedRouteId, setSelectedRouteId] = useState<string | undefined>();
  const [hasPrefilledFromScan, setHasPrefilledFromScan] = useState(false);

  const {
    data: gyms = [],
    isLoading: isGymsLoading,
    isError: isGymsError,
    error: gymsError,
    refetch: refetchGyms,
  } = useDiscoverGyms();
  const selectedGym = gyms.find((gym) => gym.id === selectedGymId);
  const {
    data: routes = [],
    isLoading: isRoutesLoading,
    isError: isRoutesError,
    refetch: refetchRoutes,
  } = useGymRoutes(selectedGymId, selectedGym?.name);
  const uploadMutation = useUploadWatchVideo();
  const player = useVideoPlayer(decodedVideoUri, (p) => {
    p.loop = true;
    p.play();
  });

  const selectedRoute = routes.find((route) => route.id === selectedRouteId);

  useEffect(() => {
    if (!scannedRouteId || hasPrefilledFromScan) return;

    void fetchRouteById(scannedRouteId).then((match) => {
      if (!match?.gymId) return;

      setSelectedGymId(match.gymId);
      setSelectedRouteId(match.id);
      setHasPrefilledFromScan(true);
    });
  }, [scannedRouteId, hasPrefilledFromScan]);

  function handleGymChange(gymId: string | undefined) {
    setSelectedGymId(gymId);
    setSelectedRouteId(undefined);
  }

  async function handleSubmit() {
    if (!decodedVideoUri) {
      Alert.alert("Błąd", "Brak nagrania do wysłania.");
      return;
    }

    if (!title.trim()) {
      Alert.alert("Opis", "Dodaj krótki opis przejścia przed publikacją.");
      return;
    }

    if (!selectedGymId) {
      Alert.alert("Obiekt", "Wybierz ściankę, na której nagrywałeś.");
      return;
    }

    if (!selectedRouteId) {
      Alert.alert("Trasa", "Wybierz problem powiązany z klipem.");
      return;
    }

    const placeLabel = selectedGym ? `${selectedGym.name} · ${selectedGym.city}` : undefined;

    try {
      await uploadMutation.mutateAsync({
        videoUri: decodedVideoUri,
        gymId: selectedGymId,
        routeId: selectedRouteId,
        title: title.trim(),
        routeName: selectedRoute?.name,
        place: placeLabel,
      });
      router.replace("/(tabs)/watch");
    } catch {
      Alert.alert("Wysyłanie", "Nie udało się opublikować klipu. Spróbuj ponownie.");
    }
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
              Powiąż klip ze ścianką i problemem
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
          contentContainerClassName="gap-5 px-4 pb-10"
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
                placeholder="Np. Flash po dynie — czysty top!"
                editable={!uploadMutation.isPending}
                className="min-h-[96px] rounded-2xl"
              />
              <Text className="text-[11px] leading-relaxed text-muted-foreground">
                Krótki opis przejścia pojawi się pod klipem na feedzie.
              </Text>
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
                        label: selectedGym ? `${selectedGym.name} · ${selectedGym.city}` : "",
                      }
                    : undefined
                }
                onValueChange={(option) => handleGymChange(option?.value)}
                disabled={uploadMutation.isPending || isGymsLoading || isGymsError}
              >
                <SelectTrigger nativeID="gym" className="h-12 w-full rounded-2xl">
                  {isGymsLoading ? (
                    <ActivityIndicator size="small" />
                  ) : isGymsError ? (
                    <Text className="text-sm text-muted-foreground">
                      {isAuthError(gymsError) ? "Wymagane logowanie" : "Błąd ładowania obiektów"}
                    </Text>
                  ) : gyms.length === 0 ? (
                    <Text className="text-sm text-muted-foreground">Brak obiektów w bazie</Text>
                  ) : (
                    <SelectValue placeholder="Wybierz ściankę" />
                  )}
                </SelectTrigger>
                <SelectContent className="w-full">
                  <NativeSelectScrollView>
                    {gyms.map((gym) => (
                      <SelectItem key={gym.id} value={gym.id} label={`${gym.name} · ${gym.city}`} />
                    ))}
                  </NativeSelectScrollView>
                </SelectContent>
              </Select>
              {isGymsError && !isAuthError(gymsError) ? (
                <Pressable onPress={() => void refetchGyms()}>
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
                  selectedRouteId
                    ? {
                        value: selectedRouteId,
                        label: selectedRoute
                          ? `${selectedRoute.name} · ${selectedRoute.grade}`
                          : "",
                      }
                    : undefined
                }
                onValueChange={(option) => setSelectedRouteId(option?.value)}
                disabled={
                  uploadMutation.isPending ||
                  !selectedGymId ||
                  isRoutesLoading ||
                  isRoutesError ||
                  routes.length === 0
                }
              >
                <SelectTrigger nativeID="route" className="h-12 w-full rounded-2xl">
                  {!selectedGymId ? (
                    <Text className="text-sm text-muted-foreground">Najpierw wybierz ściankę</Text>
                  ) : isRoutesLoading ? (
                    <ActivityIndicator size="small" />
                  ) : isRoutesError ? (
                    <Text className="text-sm text-muted-foreground">Błąd ładowania tras</Text>
                  ) : routes.length === 0 ? (
                    <Text className="text-sm text-muted-foreground">
                      Brak problemów na tej ściance
                    </Text>
                  ) : (
                    <SelectValue placeholder="Wybierz problem" />
                  )}
                </SelectTrigger>
                <SelectContent className="w-full">
                  <NativeSelectScrollView>
                    {routes.map((route) => (
                      <SelectItem
                        key={route.id}
                        value={route.id}
                        label={`${route.name} · ${route.grade}`}
                      />
                    ))}
                  </NativeSelectScrollView>
                </SelectContent>
              </Select>
              {isRoutesError && selectedGymId ? (
                <Pressable onPress={() => void refetchRoutes()}>
                  <Text className="text-xs font-medium text-primary">Spróbuj ponownie</Text>
                </Pressable>
              ) : null}
            </View>
          </View>

          <Button
            className="h-12 w-full rounded-full"
            disabled={uploadMutation.isPending}
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
