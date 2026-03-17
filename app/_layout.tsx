import "../global.css";

import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";

import { QueryProvider } from "@/src/providers/query-provider";

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const theme = colorScheme === "dark" ? DarkTheme : DefaultTheme;

  return (
    <QueryProvider>
      <ThemeProvider value={theme}>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
        <PortalHost />
      </ThemeProvider>
    </QueryProvider>
  );
}
