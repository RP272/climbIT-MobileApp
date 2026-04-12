import { router, Stack } from "expo-router";
import { useEffect } from "react";

export default function HomeScreen() {
  const isNewUser = true;

  useEffect(() => {
    if (isNewUser) {
      router.push("/onboarding");
    }
  }, []);

  return null;
}
