import { Stack } from "expo-router";

export default function DiscoverStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Discover" }} />
    </Stack>
  );
}
