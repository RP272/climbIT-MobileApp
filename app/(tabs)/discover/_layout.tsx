import { Stack } from "expo-router";

export default function DiscoverStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Discover" }} />
      <Stack.Screen name="map" options={{ title: "Mapa ścianek" }} />
      <Stack.Screen name="routes" options={{ title: "Wszystkie trasy" }} />
      <Stack.Screen name="routes/[routeId]" options={{ title: "Szczegóły trasy" }} />
      <Stack.Screen name="gyms/index" options={{ title: "Wszystkie ścianki" }} />
      <Stack.Screen name="gyms/[gymId]" options={{ title: "Szczegóły ścianki" }} />
      <Stack.Screen name="gyms/[gymId]/routes" options={{ title: "Wszystkie trasy" }} />
      <Stack.Screen name="gyms/[gymId]/challenges" options={{ title: "Wyzwania" }} />
    </Stack>
  );
}
