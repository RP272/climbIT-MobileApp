import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { BlurView } from "expo-blur";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronLeft, RefreshCw, Zap } from "lucide-react-native";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

export default function VideoCamera() {
  const router = useRouter();
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [hasScannedQRCode, setHasScannedQRCode] = useState(false);

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
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        mode="video"
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={(scanningResult) => {
          if (hasScannedQRCode) return;

          setHasScannedQRCode(true);
          console.log(scanningResult.data);
          router.navigate("(tabs)/discover/routes/edge-balance");
        }}
      />

      <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
        <SafeAreaView edges={["top"]} className="flex-row items-center justify-between px-4 pt-2">
          <Pressable
            onPress={() => router.back()}
            className="h-11 w-11 items-center justify-center rounded-full bg-black/45 active:bg-black/60"
            accessibilityRole="button"
            accessibilityLabel="Wróć"
          >
            <Icon as={ChevronLeft} size={28} className="text-white" strokeWidth={2.2} />
          </Pressable>
          <View className="h-11 w-11 items-center justify-center rounded-full bg-black/35">
            <Icon as={Zap} size={22} className="text-white/90" strokeWidth={2.2} />
          </View>
        </SafeAreaView>

        <View className="flex-1 justify-end">
          <BlurView
            intensity={42}
            tint="dark"
            className="overflow-hidden rounded-t-[28px] border-t border-white/10"
          >
            <View className="px-6 pb-10 pt-6">
              <View className="mb-8 flex-row items-end justify-between gap-6">
                <View className="h-14 w-14" />

                <View className="items-center">
                  <Text className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">
                    nagrywanie
                  </Text>
                  <View className="h-[76px] w-[76px] items-center justify-center rounded-full border-[4px] border-white shadow-lg shadow-black/40">
                    <View className="h-[58px] w-[58px] rounded-full bg-white" />
                  </View>
                </View>

                <Pressable
                  onPress={toggleCameraFacing}
                  className="h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 active:bg-white/18"
                >
                  <Icon as={RefreshCw} size={26} className="text-white" strokeWidth={2.2} />
                </Pressable>
              </View>

              <Text className="text-center text-xs text-white/45">
                Tryb wideo · skan QR bez zmian w działaniu
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
