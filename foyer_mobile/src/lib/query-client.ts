import { QueryClient } from "@tanstack/react-query";

/**
 * Reusable QueryClient instance with production-ready default options.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 60_000, // 1 minute
      gcTime: 5 * 60_000, // 5 minutes
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      networkMode: "online",
    },
    mutations: {
      retry: 1,
      networkMode: "online",
    },
  },
});
