import React from "react";
import { View, StyleSheet, useColorScheme } from "react-native";
import { useAppTheme, spacing, radius, fontFamily } from "@/theme";
import { Label } from "../Typography";
import type { AppStatusPillProps, StatusPillStatus } from "./types";

/** Status label defaults */
const STATUS_LABELS: Record<StatusPillStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  neutral: "Neutral",
};

export const AppStatusPill = React.memo(function AppStatusPill({
  status,
  variant = "full",
  label,
  icon: Icon,
  accessibilityLabel,
  testID,
}: AppStatusPillProps) {
  const theme = useAppTheme();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const colors = getStatusColors(status, isDark, theme.colors);
  const displayLabel = label ?? STATUS_LABELS[status];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.bg },
        variant === "compact" && styles.compact,
      ]}
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel ?? displayLabel}
      testID={testID}
    >
      <View style={[styles.dot, { backgroundColor: colors.dot }]} />
      {variant === "full" && (
        <>
          {Icon && (
            <Icon size={12} color={colors.text} style={styles.icon} />
          )}
          <Label style={{ color: colors.text, fontFamily: fontFamily.medium }}>
            {displayLabel}
          </Label>
        </>
      )}
    </View>
  );
});

function getStatusColors(
  status: StatusPillStatus,
  isDark: boolean,
  themeColors: ReturnType<typeof useAppTheme>["colors"]
) {
  switch (status) {
    case "pending":
      // tertiary (amber)
      return {
        bg: themeColors.tertiaryContainer,
        text: themeColors.onTertiaryContainer,
        dot: themeColors.tertiary,
      };
    case "approved":
      // secondary (sage green)
      return {
        bg: themeColors.secondaryContainer,
        text: themeColors.onSecondaryContainer,
        dot: themeColors.secondary,
      };
    case "rejected":
      // error (muted red)
      return {
        bg: themeColors.errorContainer,
        text: themeColors.onErrorContainer,
        dot: themeColors.error,
      };
    case "neutral":
      return {
        bg: isDark ? "#374151" : "#F3F4F6",
        text: isDark ? "#9CA3AF" : "#6B7280",
        dot: isDark ? "#6B7280" : "#9CA3AF",
      };
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
    gap: 6,
  },
  compact: {
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  icon: {
    marginRight: 2,
  },
});
