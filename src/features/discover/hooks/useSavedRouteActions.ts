import {
  addRouteToSavedRoutes,
  fetchSavedRouteIds,
  removeRouteFromSavedRoutes,
} from "@/src/api/profile.api";
import { PROFILE_QUERY_KEYS } from "@/src/query/profile.query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const DISCOVER_SAVED_ROUTES_QUERY_KEY = ["discover", "routes", "saved"] as const;
export const DISCOVER_SAVED_ROUTE_IDS_QUERY_KEY = ["discover", "routes", "saved-ids"] as const;

export type SavedRouteMutationVariables = {
  routeId: string;
  shouldSave: boolean;
};

export function useSavedRouteIdsQuery() {
  return useQuery({
    queryKey: DISCOVER_SAVED_ROUTE_IDS_QUERY_KEY,
    queryFn: fetchSavedRouteIds,
  });
}

export function useSavedRouteMutation({
  onError,
}: {
  onError?: (variables: SavedRouteMutationVariables) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ routeId, shouldSave }: SavedRouteMutationVariables) => {
      if (shouldSave) {
        await addRouteToSavedRoutes(routeId);
        return;
      }

      await removeRouteFromSavedRoutes(routeId);
    },
    onError: (_error, variables) => {
      onError?.(variables);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: DISCOVER_SAVED_ROUTE_IDS_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: DISCOVER_SAVED_ROUTES_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.savedRoutes() });
    },
  });
}
