import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/src/providers/auth-provider";
import { Link, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type AuthMode = "signin" | "signup";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AuthFormScreen({ mode }: { mode: AuthMode }) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isSignIn = mode === "signin";
  const heading = useMemo(() => (isSignIn ? "Welcome back" : "Create your account"), [isSignIn]);
  const subtitle = useMemo(
    () =>
      isSignIn
        ? "Use your email and password to continue."
        : "Create an account to unlock the climbing dashboard.",
    [isSignIn],
  );
  const actionLabel = isSignIn ? "Sign in" : "Sign up";

  const handleSubmit = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      setErrorMessage("Enter a valid email address.");
      return;
    }

    if (password.trim().length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (isSignIn) {
        await signIn({ email: normalizedEmail, password });
      } else {
        await signUp({ email: normalizedEmail, password });
      }

      router.replace("/");
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-background"
    >
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: Math.max(insets.bottom + 32, 48),
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-between px-5 pt-12">
          <View className="absolute left-[-40px] top-14 h-28 w-28 rounded-full bg-primary/15" />
          <View className="absolute right-[-24px] top-28 h-20 w-20 rounded-full bg-primary/10" />

          <View className="gap-6">
            <View className="gap-3">
              <View className="self-start rounded-full border border-border bg-card px-3 py-1.5">
                <Text className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                  climbIT
                </Text>
              </View>
              <View className="gap-2">
                <Text className="text-[34px] font-extrabold leading-10 text-foreground">
                  {heading}
                </Text>
                <Text className="max-w-[320px] text-[15px] leading-6 text-muted-foreground">
                  {subtitle}
                </Text>
              </View>
            </View>

            <View className="gap-3 rounded-3xl border border-border bg-card p-4 shadow-sm">
              <View className="gap-2">
                <Text className="text-[12px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Email
                </Text>
                <Input
                  value={email}
                  onChangeText={setEmail}
                  placeholder="name@example.com"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  textContentType="emailAddress"
                />
              </View>

              <View className="gap-2">
                <Text className="text-[12px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Password
                </Text>
                <Input
                  value={password}
                  onChangeText={setPassword}
                  placeholder="At least 8 characters"
                  secureTextEntry
                  autoComplete="password"
                  textContentType="password"
                />
              </View>

              {errorMessage ? (
                <View className="rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2">
                  <Text className="text-[13px] leading-5 text-destructive">{errorMessage}</Text>
                </View>
              ) : null}

              <Button onPress={handleSubmit} disabled={isSubmitting} className="mt-2">
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-[15px] font-semibold text-primary-foreground">
                    {actionLabel}
                  </Text>
                )}
              </Button>
            </View>

            <View className="rounded-3xl border border-border bg-card px-4 py-3">
              <View className="flex-row items-center justify-between gap-2">
                <Text className="text-[12px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Climb mood
                </Text>
                <Text className="text-lg">🧗 🪢 🧗‍♀️ 🧗‍♂️</Text>
              </View>
              <Text className="mt-2 text-[13px] leading-5 text-muted-foreground">
                Keep your hands on the wall and your session in sync.
              </Text>
            </View>
          </View>

          <View className="gap-3 pt-6">
            <View className="flex-row items-center justify-center gap-2">
              <Text className="text-[14px] text-muted-foreground">
                {isSignIn ? "No account yet?" : "Already have an account?"}
              </Text>
              {isSignIn ? (
                <Link href="/(auth)/signup" asChild>
                  <Pressable>
                    <Text className="text-[14px] font-semibold text-primary">Sign up</Text>
                  </Pressable>
                </Link>
              ) : (
                <Link href="/(auth)/signin" asChild>
                  <Pressable>
                    <Text className="text-[14px] font-semibold text-primary">Sign in</Text>
                  </Pressable>
                </Link>
              )}
            </View>

            <Text className="text-center text-[12px] leading-5 text-muted-foreground">
              Your session is stored locally and reused across restarts.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function getAuthErrorMessage(error: unknown): string {
  if (typeof error === "object" && error && "response" in error) {
    const response = (error as { response?: { data?: { message?: string; error?: string } } })
      .response;
    const backendMessage = response?.data?.message || response?.data?.error;

    if (backendMessage) {
      return backendMessage;
    }
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return "Could not complete authentication. Try again.";
}
