import { questions } from "@/src/data/onboarding-questions";
import Questions from "@/components/onboarding/questions";
import { OnboardingProvider } from "@/src/features/onboarding/contexts/useOnboarding";

export default function Onboarding() {
  return (
    <OnboardingProvider>
      <Questions questions={questions} />
    </OnboardingProvider>
  );
}
