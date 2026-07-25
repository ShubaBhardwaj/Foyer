import React from "react";
import { View, StyleSheet, useColorScheme } from "react-native";
import { spacing, radius, fontFamily, semanticColors } from "@/theme";
import { Label } from "../Typography";
import type { AppBadgeProps, BadgeStatus } from "./types";

export const AppBadge = React.memo(function AppBadge({
  label,
  status = "neutral",
  icon: Icon,
  accessibilityLabel,
  testID,
}: AppBadgeProps) {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const colors = getStatusColors(status, isDark);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.bg },
      ]}
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel ?? label}
      testID={testID}
    >
      {Icon && (
        <Icon size={12} color={colors.text} style={styles.icon} />
      )}
      <Label style={{ color: colors.text, fontFamily: fontFamily.medium }}>
        {label}
      </Label>
    </View>
  );
});

function getStatusColors(status: BadgeStatus, isDark: boolean) {
  const palette = isDark ? semanticColors.dark : semanticColors.light;

  switch (status) {
    case "success":
      return { bg: palette.successContainer, text: isDark ? palette.success : palette.success };
    case "warning":
      return { bg: palette.warningContainer, text: isDark ? palette.warning : palette.warning };
    case "error": {
      const errBg = isDark ? "#6B231E" : "#F6D8D5";
      const errText = isDark ? "#E0736C" : "#B3413A";
      return { bg: errBg, text: errText };
    }
    case "info":
      return { bg: palette.infoContainer, text: isDark ? palette.info : palette.info };
    case "neutral":
      return { bg: palette.neutralContainer, text: isDark ? palette.neutral : palette.neutral };
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    alignSelf: "flex-start",
  },
  icon: {
    marginRight: 4,
  },
});
