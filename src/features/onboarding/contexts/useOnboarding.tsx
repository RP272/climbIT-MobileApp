import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  PropsWithChildren,
  useState,
} from "react";
import { questions } from "@/src/data/onboarding-questions";

interface Question {
  id: number;
  answer: string;
}
interface OnboardingType {
  onboardingData: Question[];
  setOnboardingData: Dispatch<SetStateAction<Question[]>>;
}
const OnboardingContext = createContext<OnboardingType | null>(null);

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) throw new Error("Context is used outside its provider");

  return context;
}

export function OnboardingProvider({ children }: PropsWithChildren) {
  const [onboardingData, setOnboardingData] = useState<Question[]>(() =>
    questions.map((q) => ({ id: q.id, answer: "" })),
  );

  return (
    <OnboardingContext value={{ onboardingData, setOnboardingData }}>{children}</OnboardingContext>
  );
}
