import React from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import { QueryClientProvider } from "@tanstack/react-query";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import Toast from "react-native-toast-message";

import { queryClient } from "@/lib/query-client";
import { AppLightTheme } from "@/theme/theme";

interface AppProviderProps {
  children: React.ReactNode;
}

/**
 * Root Application Provider.
 * Wraps the app hierarchy in the exact recommended best practice order:
 * 1. GestureHandlerRootView (Required at root for react-native-gesture-handler & gorhom bottom sheet)
 * 2. SafeAreaProvider (Handles safe area notches & status bar spacing)
 * 3. PaperProvider (React Native Paper Material 3 design system & components context)
 * 4. QueryClientProvider (React Query cache & state management)
 * 5. BottomSheetModalProvider (Enables Gorhom BottomSheet modal stack)
 * 6. Children (Expo Router Stack / navigation tree)
 * 7. Toast (Global React Native Toast Message renderer at top of tree)
 */
export function AppProvider({ children }: AppProviderProps) {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <PaperProvider theme={AppLightTheme}>
          <QueryClientProvider client={queryClient}>
            <BottomSheetModalProvider>
              {children}
              <Toast />
            </BottomSheetModalProvider>
          </QueryClientProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
