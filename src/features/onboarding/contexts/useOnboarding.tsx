import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  useContext,
  useState,
} from "react";
import { questions } from "@/src/data/onboarding-questions";

interface QuestionState {
  id: number;
  answer: string;
}

interface OnboardingType {
  onboardingData: QuestionState[];
  setOnboardingData: Dispatch<SetStateAction<QuestionState[]>>;
}

const OnboardingContext = createContext<OnboardingType | null>(null);

export function useOnboarding() {
  const context = useContext(OnboardingContext);

  if (!context) {
    throw new Error("Context is used outside its provider");
  }

  return context;
}

export function OnboardingProvider({ children }: PropsWithChildren) {
  const [onboardingData, setOnboardingData] = useState<QuestionState[]>(() =>
    questions.map((question) => ({ id: question.id, answer: "" })),
  );

  return (
    <OnboardingContext.Provider value={{ onboardingData, setOnboardingData }}>
      {children}
    </OnboardingContext.Provider>
  );
}
