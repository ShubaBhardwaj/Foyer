import React from "react";
import { StyleSheet, ViewProps } from "react-native";
import { AppCard } from "@/components/ui";
import { spacing } from "@/theme";

interface ProfileCardProps extends ViewProps {
  children: React.ReactNode;
  variant?: "elevated" | "outlined" | "flat";
}

export const ProfileCard = React.memo(function ProfileCard({
  children,
  variant = "elevated",
  style,
  ...props
}: ProfileCardProps) {
  return (
    <AppCard variant={variant as any} style={[styles.card, style] as any} {...props}>
      {children}
    </AppCard>
  );
});

const styles = StyleSheet.create({
  card: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    overflow: "hidden",
    marginVertical: spacing.xs,
  },
});
