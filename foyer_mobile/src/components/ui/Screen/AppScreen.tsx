import React from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useAppTheme, spacing } from "@/theme";
import type { AppScreenProps } from "./types";

export const AppScreen = React.memo(function AppScreen({
  children,
  scrollable = true,
  backgroundColor,
  statusBarStyle = "auto",
  safeAreaEdges = ["top", "bottom", "left", "right"],
  keyboardAvoiding = true,
  keyboardOffset = 0,
  padding = spacing.lg,
  style,
  contentContainerStyle,
  testID,
}: AppScreenProps) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();

  const bg = backgroundColor ?? theme.colors.background;

  const paddingTop = safeAreaEdges.includes("top") ? insets.top : 0;
  const paddingBottom = safeAreaEdges.includes("bottom") ? insets.bottom : 0;
  const paddingLeft = safeAreaEdges.includes("left") ? insets.left : 0;
  const paddingRight = safeAreaEdges.includes("right") ? insets.right : 0;

  const containerStyle = [
    styles.container,
    {
      backgroundColor: bg,
      paddingTop,
      paddingBottom,
      paddingLeft,
      paddingRight,
    },
    style,
  ];

  const content = scrollable ? (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={[
        { padding },
        contentContainerStyle,
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.nonScrollContainer, { padding }, contentContainerStyle]}>
      {children}
    </View>
  );

  return (
    <View style={containerStyle} testID={testID}>
      <StatusBar style={statusBarStyle} />
      {keyboardAvoiding ? (
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={keyboardOffset}
        >
          {content}
        </KeyboardAvoidingView>
      ) : (
        content
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  nonScrollContainer: {
    flex: 1,
  },
});
