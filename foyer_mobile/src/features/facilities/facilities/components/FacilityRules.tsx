import React from "react";
import { View, StyleSheet } from "react-native";
import { AppSectionHeader, AppCard, Body, Caption } from "@/components/ui";
import { useAppTheme, spacing } from "@/theme";
import { ShieldAlert } from "lucide-react-native";

interface FacilityRulesProps {
  rules: string[];
}

export const FacilityRules = React.memo(function FacilityRules({
  rules,
}: FacilityRulesProps) {
  const theme = useAppTheme();

  return (
    <View style={styles.container}>
      <AppSectionHeader title="Rules & Booking Guidelines" />
      <AppCard variant="outlined" style={styles.card}>
        {rules.map((rule, index) => (
          <View key={index} style={styles.ruleRow}>
            <ShieldAlert size={16} color={theme.colors.error} />
            <Body style={{ color: theme.colors.onSurface, flex: 1 }}>{rule}</Body>
          </View>
        ))}
      </AppCard>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
  },
  card: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  ruleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
});
