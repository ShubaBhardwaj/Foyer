import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { Stack, Redirect } from "expo-router";
import { useAuthInitializer } from "@/hooks/useAuthInitializer";
import { useAuthStore } from "@/store/use-auth-store";
import { colors } from "@/theme";

export default function AppLayout() {
  useAuthInitializer();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  // 1. Splash loading screen while backend verifies session
  if (!isInitialized) {
    return (
      <View style={styles.splashContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // 2. Both route groups must be registered so Expo Router
  //    knows about them. Use `redirect` to control access.
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" redirect={isAuthenticated} />
      <Stack.Screen name="(tabs)" redirect={!isAuthenticated} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
});