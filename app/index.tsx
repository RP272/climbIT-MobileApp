import { Redirect } from "expo-router";

import { useAuth } from "@/src/providers/auth-provider";

const ONBOARDING_ROUTE = "/onboarding" as any;

export default function Index() {
  const { isReady, isAuthenticated, needsOnboarding, onboardingStatusLoaded } = useAuth();

  if (!isReady) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/signin" />;
  }

  if (!onboardingStatusLoaded) {
    return null;
  }

  return <Redirect href={needsOnboarding ? ONBOARDING_ROUTE : "/(tabs)/home"} />;
}
