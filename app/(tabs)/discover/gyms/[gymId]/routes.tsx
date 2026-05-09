import { RoutesListScreen } from "@/components/discover/routes/all-routes-screen";
import { useGymDetails } from "@/src/features/discover/hooks/useDiscoverGyms";
import { useGymRoutes } from "@/src/features/discover/hooks/useGymRoutes";
import { useLocalSearchParams } from "expo-router";

export default function GymRoutesScreen() {
  const { gymId } = useLocalSearchParams<{ gymId?: string | string[] }>();
  const selectedGymId = getParamValue(gymId);
  const { data: routes = [], isLoading: isLoadingRoutes } = useGymRoutes(selectedGymId);
  const { data: gym, isLoading: isLoadingGym } = useGymDetails(selectedGymId);

  return (
    <RoutesListScreen
      routes={routes}
      isLoading={isLoadingRoutes || isLoadingGym}
      title={gym ? `Trasy w ${gym.name}` : "Trasy w ściance"}
    />
  );
}

function getParamValue(param: string | string[] | undefined) {
  return Array.isArray(param) ? param[0] : param;
}
