import "../global.css";

import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";

import { DARK_THEME, LIGHT_THEME } from "@/theme";

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const theme = colorScheme === "dark" ? DARK_THEME : LIGHT_THEME;

  return (
    <ThemeProvider value={theme}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
      <PortalHost />
    </ThemeProvider>
  );
}
