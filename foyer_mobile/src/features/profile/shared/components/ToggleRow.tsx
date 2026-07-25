import React from "react";
import { View, StyleSheet, Switch } from "react-native";
import { Body, Caption } from "@/components/ui";
import { useAppTheme, spacing } from "@/theme";

interface ToggleRowProps {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
  divider?: boolean;
}

export const ToggleRow = React.memo(function ToggleRow({
  label,
  description,
  value,
  onValueChange,
  divider = true,
}: ToggleRowProps) {
  const theme = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        divider && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.colors.outline },
      ]}
    >
      <View style={styles.textCol}>
        <Body style={{ color: theme.colors.onSurface, fontWeight: "500" }}>
          {label}
        </Body>
        {description && (
          <Caption style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}>
            {description}
          </Caption>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: theme.colors.outline,
          true: theme.colors.primary,
        }}
        thumbColor={theme.colors.surface}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  textCol: {
    flex: 1,
    paddingRight: spacing.md,
  },
});
