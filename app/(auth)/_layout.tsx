import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/src/providers/auth-provider";

const ONBOARDING_ROUTE = "/onboarding" as any;

export default function AuthLayout() {
  const { isReady, isAuthenticated, needsOnboarding, onboardingStatusLoaded } = useAuth();

  if (!isReady) {
    return null;
  }

  if (isAuthenticated) {
    if (!onboardingStatusLoaded) {
      return null;
    }

    return <Redirect href={needsOnboarding ? ONBOARDING_ROUTE : "/(tabs)/home"} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="signin" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}
