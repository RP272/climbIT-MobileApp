import { Stack } from "expo-router";

export default function AddStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Add" }} />
    </Stack>
  );
}
