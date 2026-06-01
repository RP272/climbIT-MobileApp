import { useMemo, useRef, useState } from "react";
import { Dimensions, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { ArrowLeft, ArrowRight, Send } from "lucide-react-native";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Question from "@/components/onboarding/question";
import Welcome from "@/components/onboarding/welcome";
import { isAuthError } from "@/src/api/is-auth-error";
import { useAuth } from "@/src/providers/auth-provider";
import { useOnboarding } from "@/src/features/onboarding/contexts/useOnboarding";
import { cn } from "@/lib/utils";
import { questions } from "@/src/data/onboarding-questions";

type Questions = typeof questions;

interface QuestionsProps {
  questions: Questions;
}

const SKILL_LEVEL_OPTIONS = [
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Advanced", label: "Advanced" },
  { value: "Pro", label: "Pro" },
] as const;

export default function QuestionsScreen({ questions }: QuestionsProps) {
  const { onboardingData } = useOnboarding();
  const { onboardingStatus, completeOnboarding } = useAuth();
  const [nickname, setNickname] = useState(onboardingStatus?.nickname ?? "");
  const [skillLevel, setSkillLevel] = useState(onboardingStatus?.skillLevel ?? "");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const progressPercent =
    ((onboardingData.filter((question) => question.answer).length +
      (nickname ? 1 : 0) +
      (skillLevel ? 1 : 0)) /
      (onboardingData.length + 2)) *
    100;

  const scrollRef = useRef<ScrollView>(null);
  const { width } = Dimensions.get("window");

  const canSubmit = useMemo(
    () => Boolean(nickname.trim() && skillLevel.trim()),
    [nickname, skillLevel],
  );

  async function handleSubmit() {
    if (!nickname.trim()) {
      setErrorMessage("Podaj nickname.");
      return;
    }

    if (!skillLevel.trim()) {
      setErrorMessage("Wybierz poziom.");
      return;
    }

    setErrorMessage(null);

    try {
      await completeOnboarding({
        nickname: nickname.trim(),
        skillLevel: skillLevel.trim(),
        favouriteFacilityId: null,
        profilePhotoUrl: null,
      });

      router.replace("/");
    } catch (error) {
      if (isAuthError(error)) {
        router.replace("/(auth)/signin");
        return;
      }

      setErrorMessage("Nie udało się zapisać onboarding. Spróbuj ponownie.");
    }
  }

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
        <View className="flex h-full w-screen flex-col items-between justify-between p-4">
          <Welcome />

          <Button onPress={() => scrollRef.current?.scrollTo({ x: width, animated: true })}>
            <Text className="text-white">Zaczynamy</Text>
            <ArrowRight color="white" />
          </Button>
        </View>

        {questions.map((question, index) => {
          const pageIndex = index + 1;
          const isCurrentQuestionAnswered = Boolean(onboardingData[index]?.answer);

          return (
            <View
              className="flex h-full w-screen flex-col items-between justify-between p-4"
              key={question.id}
            >
              <Question id={question.id} question={question.question} answers={question.answers} />

              <View className="flex flex-row gap-4">
                {index !== 0 && (
                  <Button
                    variant="secondary"
                    className={cn(index !== questions.length - 1 && "flex-grow")}
                    onPress={() =>
                      scrollRef.current?.scrollTo({ x: width * (pageIndex - 1), animated: true })
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
                      scrollRef.current?.scrollTo({ x: width * (pageIndex + 1), animated: true });
                    }}
                    className="flex-grow"
                    disabled={!isCurrentQuestionAnswered}
                  >
                    <Text className="text-white">Dalej</Text>
                    <ArrowRight color="white" />
                  </Button>
                )}

                {index !== questions.length - 1 && (
                  <Button
                    className="flex-grow"
                    disabled={!isCurrentQuestionAnswered}
                    onPress={() =>
                      scrollRef.current?.scrollTo({ x: width * (pageIndex + 1), animated: true })
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

        <View className="flex h-full w-screen flex-col justify-between p-4">
          <View className="gap-6">
            <View className="gap-2">
              <Text className="text-2xl font-bold">Prawie gotowe</Text>
              <Text className="text-muted-foreground">
                Uzupełnij nickname i poziom, żeby zapisać onboarding w bazie.
              </Text>
            </View>

            <View className="gap-2">
              <Text className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Nickname
              </Text>
              <Input
                value={nickname}
                onChangeText={setNickname}
                placeholder="Jak mamy Cię pokazywać?"
                autoCapitalize="words"
              />
            </View>

            <View className="gap-2">
              <Text className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Skill level
              </Text>
              <Select
                value={skillLevel ? { value: skillLevel, label: skillLevel } : undefined}
                onValueChange={(item) => {
                  if (item) setSkillLevel(item.value);
                }}
              >
                <SelectTrigger className="h-12 w-full rounded-2xl">
                  <SelectValue placeholder="Wybierz poziom" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  {SKILL_LEVEL_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value} label={option.label}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </View>

            {errorMessage ? (
              <View className="rounded-2xl border border-destructive/20 bg-destructive/10 px-3 py-2">
                <Text className="text-[13px] leading-5 text-destructive">{errorMessage}</Text>
              </View>
            ) : null}
          </View>

          <View className="flex-row gap-4">
            <Button
              variant="secondary"
              className="flex-grow"
              onPress={() =>
                scrollRef.current?.scrollTo({ x: width * questions.length, animated: true })
              }
            >
              <Text>Wstecz</Text>
              <ArrowLeft />
            </Button>

            <Button
              variant="default"
              onPress={() => void handleSubmit()}
              className="flex-grow"
              disabled={!canSubmit}
            >
              <Text className="text-white">Prześlij</Text>
              <Send color="white" size={18} />
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
