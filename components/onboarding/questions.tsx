import { Dimensions, ScrollView, Text, View } from "react-native";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Send } from "lucide-react-native";
import { questions } from "@/src/data/onboarding-questions";
import Question from "@/components/onboarding/question";
import { Progress } from "@/components/ui/progress";
import { useOnboarding } from "@/src/features/onboarding/contexts/useOnboarding";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import Welcome from "@/components/onboarding/welcome";
import { router } from "expo-router";

type Questions = typeof questions;

interface QuestionsProps {
  questions: Questions;
}
export default function Questions({ questions }: QuestionsProps) {
  const { onboardingData } = useOnboarding();
  const progressPercent =
    (onboardingData.filter((q) => q.answer).length / onboardingData.length) * 100;

  const scrollRef = useRef<ScrollView>(null);
  const { width } = Dimensions.get("window");

  return (
    <View className="py-12">
      <View className="px-4">
        <Progress
          value={progressPercent}
          className="bg-gray-200"
          indicatorClassName={cn("bg-violet-500", progressPercent === 0 && "bg-tra")}
        />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        scrollEnabled={false}
        ref={scrollRef}
        className="h-full"
      >
        <View className="w-screen h-full p-4 flex flex-col justify-between items-between">
          <Welcome />

          <Button onPress={() => scrollRef.current?.scrollTo({ x: width, animated: true })}>
            <Text className="text-white">Zaczynamy</Text>
            <ArrowRight color="white" />
          </Button>
        </View>

        {questions.map((question, index) => {
          const i = index + 1;

          return (
            <View
              className="w-screen h-full p-4 flex flex-col justify-between items-between"
              key={question.id}
            >
              <Question id={question.id} question={question.question} answers={question.answers} />

              <View className="flex flex-row gap-4">
                {index !== 0 && (
                  <Button
                    variant="secondary"
                    className={cn(index !== questions.length - 1 && "flex-grow")}
                    onPress={() =>
                      scrollRef.current?.scrollTo({ x: width * (i - 1), animated: true })
                    }
                  >
                    <Text>Wstecz</Text>
                    <ArrowLeft />
                  </Button>
                )}

                {index === questions.length - 1 && (
                  <Button
                    variant="default"
                    onPress={() => {
                      console.log(onboardingData);
                      router.back();
                    }}
                    className="flex-grow"
                  >
                    <Text className="text-white">Prześlij</Text>
                    <Send color="white" size={18} />
                  </Button>
                )}
                {index !== questions.length - 1 && (
                  <Button
                    className="flex-grow"
                    disabled={!onboardingData[index].answer}
                    onPress={() =>
                      scrollRef.current?.scrollTo({ x: width * (i + 1), animated: true })
                    }
                  >
                    <Text className="text-white">Dalej</Text>
                    <ArrowRight color="white" />
                  </Button>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
