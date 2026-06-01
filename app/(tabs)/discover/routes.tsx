import { AllRoutesScreen } from "@/components/discover/routes/all-routes-screen";
import { useLocalSearchParams } from "expo-router";

export default function DiscoverRoutesRoute() {
  const { personalFilter } = useLocalSearchParams<{ personalFilter?: string | string[] }>();
  const selectedPersonalFilter = Array.isArray(personalFilter) ? personalFilter[0] : personalFilter;

  return (
    <AllRoutesScreen
      initialPersonalFilterIds={selectedPersonalFilter === "project" ? ["project"] : []}
    />
  );
}
