import React from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import { QueryClientProvider } from "@tanstack/react-query";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import Toast from "react-native-toast-message";

import { queryClient } from "@/lib/query-client";
import { AppLightTheme, AppDarkTheme } from "@/theme/theme";

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key (EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY) to your .env file.");
}

interface AppProviderProps {
  children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? AppDarkTheme : AppLightTheme;

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
            <PaperProvider theme={theme}>
              <BottomSheetModalProvider>
                {children}
                <Toast />
              </BottomSheetModalProvider>
            </PaperProvider>
          </ClerkProvider>
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
