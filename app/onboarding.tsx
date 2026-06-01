import { Redirect } from "expo-router";

import Questions from "@/components/onboarding/questions";
import { questions } from "@/src/data/onboarding-questions";
import { OnboardingProvider } from "@/src/features/onboarding/contexts/useOnboarding";
import { useAuth } from "@/src/providers/auth-provider";

export default function Onboarding() {
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

  if (!needsOnboarding) {
    return <Redirect href="/(tabs)/home" />;
  }

  return (
    <OnboardingProvider>
      <Questions questions={questions} />
    </OnboardingProvider>
  );
}
