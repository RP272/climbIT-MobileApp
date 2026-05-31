import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";

type RefreshableQuery = {
  refetch: () => Promise<unknown>;
};

export function useQueryRefresh(queries: readonly RefreshableQuery[] = []) {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    const refreshPromise =
      queries.length > 0
        ? Promise.all(queries.map((query) => query.refetch()))
        : queryClient.invalidateQueries();

    void refreshPromise.finally(() => {
      setRefreshing(false);
    });
  }, [queries, queryClient]);

  return {
    refreshing,
    onRefresh,
  };
}
