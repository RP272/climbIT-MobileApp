import { Redirect } from "expo-router";

import { AppTabs } from "@/components/navigation/app-tabs";
import { useAuth } from "@/src/providers/auth-provider";

const ONBOARDING_ROUTE = "/onboarding" as any;

export default function TabsLayout() {
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

  if (needsOnboarding) {
    return <Redirect href={ONBOARDING_ROUTE} />;
  }

  return <AppTabs />;
}
