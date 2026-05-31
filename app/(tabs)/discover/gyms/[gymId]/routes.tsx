import { RoutesListScreen } from "@/components/discover/routes/all-routes-screen";
import { useGymDetails } from "@/src/features/discover/hooks/useDiscoverGyms";
import { useGymRoutes } from "@/src/features/discover/hooks/useGymRoutes";
import { useQueryRefresh } from "@/src/query/use-query-refresh";
import { useLocalSearchParams } from "expo-router";

export default function GymRoutesScreen() {
  const { gymId } = useLocalSearchParams<{ gymId?: string | string[] }>();
  const selectedGymId = getParamValue(gymId);
  const {
    data: routes = [],
    isLoading: isLoadingRoutes,
    refetch: refetchRoutes,
  } = useGymRoutes(selectedGymId);
  const { data: gym, isLoading: isLoadingGym, refetch: refetchGym } = useGymDetails(selectedGymId);
  const refresh = useQueryRefresh([{ refetch: refetchRoutes }, { refetch: refetchGym }]);

  return (
    <RoutesListScreen
      routes={routes}
      isLoading={isLoadingRoutes || isLoadingGym}
      refreshing={refresh.refreshing}
      onRefresh={refresh.onRefresh}
      title={gym ? `Trasy w ${gym.name}` : "Trasy w ściance"}
    />
  );
}

function getParamValue(param: string | string[] | undefined) {
  return Array.isArray(param) ? param[0] : param;
}
