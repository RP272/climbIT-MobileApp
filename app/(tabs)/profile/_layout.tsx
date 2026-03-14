import { Stack } from "expo-router";

export default function ProfileStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Profile" }} />
    </Stack>
  );
}
