import { Stack } from "expo-router";

export default function RankingStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Ranking" }} />
    </Stack>
  );
}
