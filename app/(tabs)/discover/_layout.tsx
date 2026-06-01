import { Stack } from "expo-router";

export default function DiscoverStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="map" />
      <Stack.Screen name="routes" />
      <Stack.Screen name="routes/[routeId]" />
      <Stack.Screen name="challenges/index" />
      <Stack.Screen name="challenges/[challengeId]" />
      <Stack.Screen name="gyms/index" />
      <Stack.Screen name="gyms/[gymId]" />
      <Stack.Screen name="gyms/[gymId]/routes" />
      <Stack.Screen name="gyms/[gymId]/challenges" />
    </Stack>
  );
}
