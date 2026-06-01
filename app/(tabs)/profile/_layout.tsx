import { Stack } from "expo-router";

export default function ProfileStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="achievements" />
      <Stack.Screen name="activity" />
      <Stack.Screen name="stats" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
