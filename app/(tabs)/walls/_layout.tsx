import { Stack } from "expo-router";

export default function WallsStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Walls" }} />
    </Stack>
  );
}
