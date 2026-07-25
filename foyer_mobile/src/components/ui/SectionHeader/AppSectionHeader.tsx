import React from "react";
import { View, StyleSheet } from "react-native";
import { useAppTheme, spacing } from "@/theme";
import { Title, Subtitle } from "../Typography";
import type { AppSectionHeaderProps } from "./types";

export const AppSectionHeader = React.memo(function AppSectionHeader({
  title,
  subtitle,
  action,
  style,
  accessibilityLabel,
  testID,
}: AppSectionHeaderProps) {
  const theme = useAppTheme();

  return (
    <View
      style={[styles.container, style]}
      accessibilityRole="header"
      accessibilityLabel={accessibilityLabel ?? title}
      testID={testID}
    >
      <View style={styles.textContainer}>
        <Title style={styles.title}>{title}</Title>
        {subtitle && (
          <Subtitle
            style={[
              styles.subtitle,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {subtitle}
          </Subtitle>
        )}
      </View>
      {action && <View style={styles.actionContainer}>{action}</View>}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
    width: "100%",
  },
  textContainer: {
    flex: 1,
    paddingRight: spacing.md,
  },
  title: {
    fontSize: 18,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  actionContainer: {
    alignItems: "flex-end",
  },
});
