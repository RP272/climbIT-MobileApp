import { RoutesListScreen } from "@/components/discover/routes/all-routes-screen";
import {
  useChallengeDetails,
  useChallengeRoutes,
} from "@/src/features/discover/hooks/useDiscoverChallenges";
import { useQueryRefresh } from "@/src/query/use-query-refresh";
import { useLocalSearchParams } from "expo-router";

export default function ChallengeRoutesScreen() {
  const { challengeId } = useLocalSearchParams<{ challengeId?: string | string[] }>();
  const selectedChallengeId = getParamValue(challengeId);
  const {
    data: challenge,
    isLoading: isLoadingChallenge,
    refetch: refetchChallenge,
  } = useChallengeDetails(selectedChallengeId);
  const {
    data: routes = [],
    isLoading: isLoadingRoutes,
    refetch: refetchRoutes,
  } = useChallengeRoutes(selectedChallengeId);
  const refresh = useQueryRefresh([{ refetch: refetchRoutes }, { refetch: refetchChallenge }]);

  return (
    <RoutesListScreen
      routes={routes}
      isLoading={isLoadingChallenge || isLoadingRoutes}
      refreshing={refresh.refreshing}
      onRefresh={refresh.onRefresh}
      title={challenge ? `Trasy do: ${challenge.title}` : "Trasy do wyzwania"}
    />
  );
}

function getParamValue(param: string | string[] | undefined) {
  return Array.isArray(param) ? param[0] : param;
}
