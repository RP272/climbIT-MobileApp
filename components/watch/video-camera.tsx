import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useUploadWatchVideo } from "@/src/features/watch/hooks/useUploadWatchVideo";
import {
  parseQrNavigationTarget,
  type QrNavigationTarget,
} from "@/src/features/watch/utils/qr-route.utils";
import {
  CameraView,
  type CameraType,
  useCameraPermissions,
  useMicrophonePermissions,
} from "expo-camera";
import { BlurView } from "expo-blur";
import { ChevronLeft, QrCode, RefreshCw, Square, Zap } from "lucide-react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Alert, Platform, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeOut,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";

const MAX_RECORDING_SECONDS = 60;
const RECORD_RING_SIZE = 88;
const RECORD_RING_STROKE = 3.5;
const HOLD_TO_STOP_MS = 280;

function RecordingProgressRing({ progress }: { progress: number }) {
  const radius = (RECORD_RING_SIZE - RECORD_RING_STROKE) / 2;
  const center = RECORD_RING_SIZE / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const strokeDashoffset = circumference * (1 - clampedProgress);

  return (
    <Svg width={RECORD_RING_SIZE} height={RECORD_RING_SIZE} style={{ position: "absolute" }}>
      <Defs>
        <LinearGradient id="recordingRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#ef4444" />
          <Stop offset="100%" stopColor="#b91c1c" />
        </LinearGradient>
      </Defs>
      <Circle
        cx={center}
        cy={center}
        r={radius}
        stroke="rgba(255,255,255,0.18)"
        strokeWidth={RECORD_RING_STROKE}
        fill="transparent"
      />
      <Circle
        cx={center}
        cy={center}
        r={radius}
        stroke="url(#recordingRingGradient)"
        strokeWidth={RECORD_RING_STROKE}
        fill="transparent"
        strokeLinecap="round"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={strokeDashoffset}
        transform={`rotate(-90 ${center} ${center})`}
      />
    </Svg>
  );
}

export default function VideoCamera() {
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
  const [scannedRouteId, setScannedRouteId] = useState<string | null>(null);
  const [scannedTarget, setScannedTarget] = useState<QrNavigationTarget | null>(null);
  const [recording, setRecording] = useState<"off" | "on" | "done">("off");
  const uploadMutation = useUploadWatchVideo();
  const isRecording = recording === "on";
  const isRecordingDone = recording === "done";
  const pressInTimeRef = useRef(0);
  const tapStartedThisCycleRef = useRef(false);
  const gestureStartedRecordingRef = useRef(false);
  const suppressNextPressRef = useRef(false);
  const isAndroid = Platform.OS === "android";
  const recordWithoutAudio =
    isAndroid && microphonePermission != null && !microphonePermission.granted;
  const recordingAnim = useSharedValue(0);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [videoUri, setVideoUri] = useState("");
  const player = useVideoPlayer(videoUri, (p) => {
    p.loop = true;
    p.play();
  });

  useEffect(() => {
    recordingAnim.value = withSpring(isRecording ? 1 : 0, {
      damping: 20,
      stiffness: 260,
      mass: 0.75,
    });
  }, [isRecording, recordingAnim]);

  useEffect(() => {
    if (!isRecording) {
      setRecordingSeconds(0);
      return;
    }

    const startedAt = Date.now();
    const updateElapsed = () => {
      const elapsed = Math.min(MAX_RECORDING_SECONDS, (Date.now() - startedAt) / 1000);
      setRecordingSeconds(elapsed);
    };

    updateElapsed();
    const intervalId = setInterval(updateElapsed, 100);

    return () => clearInterval(intervalId);
  }, [isRecording]);

  const recordingProgress = recordingSeconds / MAX_RECORDING_SECONDS;
  const recordingTimeLabel = useMemo(() => {
    if (!isRecording) return null;
    return `${Math.min(MAX_RECORDING_SECONDS, Math.ceil(recordingSeconds))}s / ${MAX_RECORDING_SECONDS}s`;
  }, [isRecording, recordingSeconds]);

  const recordInnerStyle = useAnimatedStyle(() => {
    const size = 58 - recordingAnim.value * 6;

    return {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: interpolateColor(recordingAnim.value, [0, 1], ["#ffffff", "#ef4444"]),
    };
  });

  const recordStopIconStyle = useAnimatedStyle(() => ({
    opacity: recordingAnim.value,
    transform: [{ scale: 0.55 + recordingAnim.value * 0.45 }],
  }));

  if (!permission) {
    return <View className="flex-1 bg-black" />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-black">
        <SafeAreaView edges={["top"]} className="px-4 pt-2">
          <Pressable
            onPress={() => router.back()}
            className="h-11 w-11 items-center justify-center rounded-full bg-white/10 active:bg-white/20"
            accessibilityRole="button"
            accessibilityLabel="Wróć"
          >
            <Icon as={ChevronLeft} size={28} className="text-white" strokeWidth={2.2} />
          </Pressable>
        </SafeAreaView>
        <SafeAreaView className="flex-1 items-center justify-center px-8 pb-8">
          <BlurView
            intensity={40}
            tint="dark"
            className="w-full overflow-hidden rounded-3xl border border-white/10"
          >
            <View className="items-center gap-4 px-8 py-10">
              <View className="h-16 w-16 items-center justify-center rounded-full bg-white/10">
                <Icon as={Zap} size={32} className="text-white" strokeWidth={2} />
              </View>
              <Text className="text-center text-lg font-semibold text-white">Dostęp do kamery</Text>
              <Text className="text-center text-sm leading-relaxed text-white/70">
                Potrzebujemy zgody, żeby pokazać podgląd i nagrywać klipy wspinaczkowe.
              </Text>
              <Button
                variant="default"
                className="mt-2 rounded-full px-8"
                onPress={requestPermission}
              >
                <Text className="font-semibold text-primary-foreground">Zezwól</Text>
              </Button>
            </View>
          </BlurView>
        </SafeAreaView>
      </View>
    );
  }

  function toggleCameraFacing() {
    if (isRecording || uploadMutation.isPending) return;
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  function navigateToScannedTarget(target: QrNavigationTarget) {
    if (target.type === "gym") {
      router.push({
        pathname: "/(tabs)/discover/gyms/[gymId]",
        params: { gymId: target.id },
      });
      return;
    }

    router.push({
      pathname: "/(tabs)/discover/routes/[routeId]",
      params: { routeId: target.id },
    });
  }

  function handleBarcodeScanned(data: string) {
    if (scannedRouteId || scannedTarget || isRecording || uploadMutation.isPending) return;

    const target = parseQrNavigationTarget(data);

    if (!target) return;

    if (target.type === "route") {
      setScannedRouteId(target.id);
    }

    setScannedTarget(target);
  }

  function startRecording() {
    if (uploadMutation.isPending || isRecording || isRecordingDone) return;

    setRecording("on");
    void (async () => {
      try {
        if (isAndroid && !microphonePermission?.granted) {
          const micResult = await requestMicrophonePermission();
          if (!micResult.granted) {
            throw new Error("record_audio permission denied");
          }
        }

        const video = await cameraRef.current?.recordAsync({
          maxDuration: MAX_RECORDING_SECONDS,
        });
        setRecording("done");

        if (!video?.uri) return;
        player.replace(video.uri);
        setVideoUri(video.uri);
      } catch (error) {
        setRecording("off");
        const message =
          error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();

        if (message.includes("permission") || message.includes("record_audio")) {
          Alert.alert(
            "Nagrywanie",
            "Brak dostępu do mikrofonu. Zezwól na nagrywanie dźwięku w ustawieniach aplikacji.",
          );
          return;
        }

        Alert.alert(
          "Nagrywanie",
          "Nie udało się nagrać klipu. Zamknij inne aplikacje z kamerą i spróbuj ponownie.",
        );
      }
    })();
  }

  function stopRecording() {
    if (!isRecording) return;
    cameraRef.current?.stopRecording();
  }

  function handleRecordPressIn() {
    if (uploadMutation.isPending || isRecordingDone) return;

    tapStartedThisCycleRef.current = false;
    gestureStartedRecordingRef.current = false;
    pressInTimeRef.current = Date.now();

    if (!isRecording) {
      gestureStartedRecordingRef.current = true;
      startRecording();
      tapStartedThisCycleRef.current = true;
    }
  }

  function handleRecordPressOut() {
    if (uploadMutation.isPending || isRecordingDone) return;

    const pressDuration = Date.now() - pressInTimeRef.current;
    const shouldStopHold =
      gestureStartedRecordingRef.current && isRecording && pressDuration >= HOLD_TO_STOP_MS;

    gestureStartedRecordingRef.current = false;

    if (shouldStopHold) {
      stopRecording();
      suppressNextPressRef.current = true;
    }
  }

  function handleRecordPress() {
    if (uploadMutation.isPending || isRecordingDone) return;

    if (suppressNextPressRef.current) {
      suppressNextPressRef.current = false;
      return;
    }

    if (tapStartedThisCycleRef.current) {
      tapStartedThisCycleRef.current = false;
      return;
    }

    if (isRecording) {
      stopRecording();
    }
  }

  const isBusy = isRecording || uploadMutation.isPending || isRecordingDone;

  return (
    <View style={styles.container}>
      {isRecordingDone && videoUri ? (
        <VideoView
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
          nativeControls={false}
          player={player}
        />
      ) : (
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          mode="video"
          mute={recordWithoutAudio}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={(scanningResult) => {
            handleBarcodeScanned(scanningResult.data);
          }}
        />
      )}

      <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
        <SafeAreaView edges={["top"]} className="flex-row items-center justify-between px-4 pt-2">
          <Pressable
            onPress={() => router.back()}
            disabled={uploadMutation.isPending}
            className="h-11 w-11 items-center justify-center rounded-full bg-black/45 active:bg-black/60"
            accessibilityRole="button"
            accessibilityLabel="Wróć"
          >
            <Icon as={ChevronLeft} size={28} className="text-white" strokeWidth={2.2} />
          </Pressable>
          <Pressable
            onPress={toggleCameraFacing}
            disabled={isBusy}
            className="h-11 w-11 items-center justify-center rounded-full bg-black/35 active:bg-black/50"
            accessibilityRole="button"
            accessibilityLabel="Przełącz kamerę"
          >
            <Icon as={RefreshCw} size={22} className="text-white/90" strokeWidth={2.2} />
          </Pressable>
        </SafeAreaView>

        {scannedTarget ? (
          <Animated.View
            entering={FadeInDown.springify().damping(16).stiffness(220)}
            exiting={FadeOut.duration(180)}
            className="mx-4 mt-2 self-center"
          >
            <Pressable
              onPress={() => navigateToScannedTarget(scannedTarget)}
              className="overflow-hidden rounded-2xl active:opacity-90"
            >
              <BlurView
                intensity={55}
                tint="dark"
                className="flex-row items-center gap-2.5 border border-emerald-400/35 px-4 py-2.5"
              >
                <View className="h-8 w-8 items-center justify-center rounded-full bg-emerald-500/25">
                  <Icon as={QrCode} size={16} className="text-emerald-300" strokeWidth={2.4} />
                </View>
                <View className="gap-0.5">
                  <Text className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-200/80">
                    {scannedTarget.type === "gym" ? "Ścianka powiązana" : "Trasa powiązana"}
                  </Text>
                  <Text className="text-xs font-semibold text-white" numberOfLines={1}>
                    {scannedTarget.id}
                  </Text>
                </View>
                <View className="ml-1 h-2 w-2 rounded-full bg-emerald-400" />
              </BlurView>
            </Pressable>
          </Animated.View>
        ) : null}

        <View className="flex-1 justify-end">
          <BlurView
            intensity={42}
            tint="dark"
            className="overflow-hidden rounded-t-[28px] border-t border-white/10"
          >
            <View className="px-6 pb-10 pt-6">
              <View className="mb-8 flex-row items-end justify-between gap-6">
                {isRecordingDone ? (
                  <Pressable
                    onPress={() => {
                      setRecording("off");
                    }}
                    className="h-10 min-w-[72px] items-center justify-center rounded-full bg-red-500 px-4 active:bg-red-600"
                  >
                    <Text className="text-sm font-semibold text-white">anuluj</Text>
                  </Pressable>
                ) : (
                  <View className="h-14 w-14" />
                )}

                <View className="items-center">
                  <Text className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">
                    {uploadMutation.isPending
                      ? "wysyłanie"
                      : isRecording
                        ? recordingTimeLabel
                          ? `nagrywanie · ${recordingTimeLabel}`
                          : "nagrywanie…"
                        : "nagrywanie"}
                  </Text>
                  <View
                    className="items-center justify-center"
                    style={{ width: RECORD_RING_SIZE, height: RECORD_RING_SIZE }}
                  >
                    {isRecording ? <RecordingProgressRing progress={recordingProgress} /> : null}
                    <Pressable
                      onPress={handleRecordPress}
                      onPressIn={handleRecordPressIn}
                      onPressOut={handleRecordPressOut}
                      disabled={uploadMutation.isPending || isRecordingDone}
                      accessibilityRole="button"
                      accessibilityState={{ disabled: uploadMutation.isPending || isRecordingDone }}
                      accessibilityLabel={
                        isRecording ? "Zatrzymaj nagrywanie" : "Rozpocznij nagrywanie"
                      }
                      className={`h-[76px] w-[76px] items-center justify-center rounded-full border-[4px] border-white shadow-lg shadow-black/40 ${isRecordingDone ? "opacity-45" : ""}`}
                    >
                      {uploadMutation.isPending ? (
                        <ActivityIndicator color="#fff" size="large" />
                      ) : (
                        <View className="h-[58px] w-[58px] items-center justify-center">
                          <Animated.View style={recordInnerStyle} />
                          <Animated.View
                            style={recordStopIconStyle}
                            className="absolute items-center justify-center"
                          >
                            <Icon
                              as={Square}
                              size={22}
                              className="fill-white text-white"
                              strokeWidth={0}
                            />
                          </Animated.View>
                        </View>
                      )}
                    </Pressable>
                  </View>
                </View>

                {isRecordingDone ? (
                  <Pressable
                    onPress={() => {
                      router.push({
                        pathname: "/(tabs)/watch/submit/[videoUri]",
                        params: {
                          videoUri: encodeURIComponent(videoUri),
                          ...(scannedRouteId ? { routeId: scannedRouteId } : {}),
                        },
                      });
                    }}
                    className="h-10 min-w-[72px] items-center justify-center rounded-full bg-emerald-500 px-4 active:bg-emerald-600"
                  >
                    <Text className="text-sm font-semibold text-white">dalej</Text>
                  </Pressable>
                ) : (
                  <View className="h-14 w-14" />
                )}
              </View>

              <Text className="text-center text-xs text-white/45">
                {uploadMutation.isPending
                  ? "Trwa mock upload na backend…"
                  : "Skanuj QR · dotknij, by nagrać · dotknij ponownie, by zakończyć"}
              </Text>
            </View>
          </BlurView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
});
