import { RoutesListScreen } from "@/components/discover/routes/all-routes-screen";
import { useChallengeDetails } from "@/src/features/discover/hooks/useDiscoverChallenges";
import { useRecommendedRoutes } from "@/src/features/discover/hooks/useRecommendedRoutes";
import { getChallengeProgressRoutes } from "@/src/features/discover/utils/challenges.utils";
import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";

export default function ChallengeRoutesScreen() {
  const { challengeId } = useLocalSearchParams<{ challengeId?: string | string[] }>();
  const selectedChallengeId = getParamValue(challengeId);
  const { data: challenge, isLoading: isLoadingChallenge } =
    useChallengeDetails(selectedChallengeId);
  const { data: routes = [], isLoading: isLoadingRoutes } = useRecommendedRoutes();

  const progressRoutes = useMemo(
    () => (challenge ? getChallengeProgressRoutes(challenge, routes) : []),
    [challenge, routes],
  );

  return (
    <RoutesListScreen
      routes={progressRoutes}
      isLoading={isLoadingChallenge || isLoadingRoutes}
      title={challenge ? `Trasy do: ${challenge.title}` : "Trasy do wyzwania"}
    />
  );
}

function getParamValue(param: string | string[] | undefined) {
  return Array.isArray(param) ? param[0] : param;
}
