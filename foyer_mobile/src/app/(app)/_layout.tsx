import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { Stack, Redirect } from "expo-router";
import { useAuthInitializer } from "@/hooks/useAuthInitializer";
import { useAuthStore } from "@/store/use-auth-store";
import { colors } from "@/theme";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

export default function AppLayout() {
  useAuthInitializer();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  if (!isInitialized) {
    return (
      <View style={styles.splashContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" redirect={!isAuthenticated} />
      <Stack.Screen name="(auth)" redirect={isAuthenticated} />
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