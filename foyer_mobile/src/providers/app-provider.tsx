import React from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import { QueryClientProvider } from "@tanstack/react-query";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import Toast from "react-native-toast-message";

import { queryClient } from "@/lib/query-client";
import { getClerkModule, getClerkTokenCache } from "@/lib/clerk";
import { AppLightTheme, AppDarkTheme } from "@/theme/theme";

const CLERK_PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  "pk_test_Y2xhc3NpYy1idWNrLTEzLmNsZXJrLmFjY291bnRzLmRldiQ";

interface AppProviderProps {
  children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? AppDarkTheme : AppLightTheme;

  const clerk = getClerkModule();
  const ClerkProviderComponent = clerk?.ClerkProvider ?? null;
  const tokenCache = getClerkTokenCache();

  const inner = (
    <PaperProvider theme={theme}>
      <BottomSheetModalProvider>
        {children}
        <Toast />
      </BottomSheetModalProvider>
    </PaperProvider>
  );

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          {ClerkProviderComponent ? (
            <ClerkProviderComponent
              publishableKey={CLERK_PUBLISHABLE_KEY}
              tokenCache={tokenCache}
            >
              {inner}
            </ClerkProviderComponent>
          ) : (
            inner
          )}
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
