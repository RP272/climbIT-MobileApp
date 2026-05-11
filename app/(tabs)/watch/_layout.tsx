import { Stack } from "expo-router";

export default function WatchStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Watch", headerShown: false }} />
      <Stack.Screen name="camera" options={{ title: "Kamera", headerShown: false }} />
    </Stack>
  );
}
