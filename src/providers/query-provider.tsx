import { queryClient } from "@/src/query/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

type QueryProviderProps = {
  children: ReactNode;
};

export function QueryProvider({ children }: QueryProviderProps) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
