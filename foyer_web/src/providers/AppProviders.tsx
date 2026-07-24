"use client";

import { useState, useEffect } from "react";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "sonner";
import { registerClerkTokenGetter } from "@/services/api/axiosClient";

function ClerkTokenRegistrar({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();

  useEffect(() => {
    registerClerkTokenGetter(() => getToken());
  }, [getToken]);

  return <>{children}</>;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            refetchOnWindowFocus: false,
            retry: (failureCount, error: any) => {
              // Don't retry on 401, 403, 404
              const status = error?.response?.status;
              if (status === 401 || status === 403 || status === 404) return false;
              return failureCount < 2;
            },
          },
        },
      })
  );

  return (
    <ClerkProvider>
      <ClerkTokenRegistrar>
        <QueryClientProvider client={queryClient}>
          <NextThemesProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster position="top-right" richColors closeButton />
          </NextThemesProvider>
        </QueryClientProvider>
      </ClerkTokenRegistrar>
    </ClerkProvider>
  );
}
