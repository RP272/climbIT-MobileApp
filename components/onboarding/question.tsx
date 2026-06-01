import { Card } from "@/components/ui/card";
import { useOnboarding } from "@/src/features/onboarding/contexts/useOnboarding";
import { cn } from "@/lib/utils";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

interface QuestionProps {
  id: number;
  question: string;
  answers: readonly string[];
}

export default function Question({ id, question, answers }: QuestionProps) {
  const { onboardingData, setOnboardingData } = useOnboarding();
  const userAnswer = onboardingData.find((item) => item.id === id)?.answer;

  function handleAnswer(answer: string) {
    setOnboardingData((data) => data.map((item) => (item.id === id ? { ...item, answer } : item)));
  }

  return (
    <View className="gap-8 pt-2">
      <Text className="mb-4 text-xl font-bold">{question}</Text>
      <FlatList
        scrollEnabled={false}
        data={answers}
        className="flex gap-4"
        ItemSeparatorComponent={() => <View className="h-2" />}
        renderItem={(answer) => (
          <TouchableOpacity onPress={() => handleAnswer(answer.item)}>
            <Card className={cn("w-full px-4", userAnswer === answer.item && "bg-primary")}>
              <Text className={cn(userAnswer === answer.item && "text-white")}>{answer.item}</Text>
            </Card>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
