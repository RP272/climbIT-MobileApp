import { Stack } from "expo-router";

export default function ProfileStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Profil" }} />
      <Stack.Screen name="achievements" options={{ title: "Statystyki" }} />
      <Stack.Screen name="activity" options={{ title: "Historia aktywności" }} />
      <Stack.Screen name="stats" options={{ title: "Statystyki" }} />
    </Stack>
  );
}
