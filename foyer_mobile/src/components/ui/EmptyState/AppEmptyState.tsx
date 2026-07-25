import React from "react";
import { View, StyleSheet } from "react-native";
import { useAppTheme, spacing, radius } from "@/theme";
import { Title, Body } from "../Typography";
import { AppButton } from "../Button";
import type { AppEmptyStateProps } from "./types";

export const AppEmptyState = React.memo(function AppEmptyState({
  title,
  description,
  icon: Icon,
  illustration,
  actionLabel,
  onActionPress,
  style,
  testID,
}: AppEmptyStateProps) {
  const theme = useAppTheme();

  return (
    <View style={[styles.container, style]} testID={testID}>
      {illustration ? (
        <View style={styles.graphicContainer}>{illustration}</View>
      ) : Icon ? (
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: theme.colors.secondaryContainer },
          ]}
        >
          <Icon size={36} color={theme.colors.primary} />
        </View>
      ) : null}

      <Title center style={styles.title}>
        {title}
      </Title>

      {description && (
        <Body
          center
          style={[
            styles.description,
            { color: theme.colors.onSurfaceVariant },
          ]}
        >
          {description}
        </Body>
      )}

      {actionLabel && onActionPress && (
        <View style={styles.actionContainer}>
          <AppButton
            label={actionLabel}
            variant="filled"
            onPress={onActionPress}
          />
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xxl,
    width: "100%",
  },
  graphicContainer: {
    marginBottom: spacing.lg,
    alignItems: "center",
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  title: {
    marginBottom: spacing.xs,
  },
  description: {
    marginBottom: spacing.xl,
    maxWidth: 280,
  },
  actionContainer: {
    marginTop: spacing.sm,
  },
});
