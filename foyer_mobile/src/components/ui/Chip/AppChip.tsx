import React, { useCallback } from "react";
import { Pressable, View, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import { useAppTheme, spacing, radius, fontFamily, opacity } from "@/theme";
import { Label } from "../Typography";
import type { AppChipProps } from "./types";

export const AppChip = React.memo(function AppChip({
  label,
  mode = "filter",
  selected = false,
  leadingIcon: LeadingIcon,
  trailingIcon: TrailingIcon,
  onPress,
  onTrailingIconPress,
  disabled = false,
  accessibilityLabel,
  accessibilityHint,
  testID,
}: AppChipProps) {
  const theme = useAppTheme();

  const handlePress = useCallback(() => {
    if (disabled) return;
    Haptics.selectionAsync();
    onPress?.();
  }, [disabled, onPress]);

  const handleTrailingPress = useCallback(() => {
    if (disabled) return;
    Haptics.selectionAsync();
    onTrailingIconPress?.();
  }, [disabled, onTrailingIconPress]);

  const bg = selected ? theme.colors.secondaryContainer : "transparent";
  const borderColor = selected ? theme.colors.secondary : theme.colors.outline;
  const textColor = selected
    ? theme.colors.onSecondaryContainer
    : theme.colors.onSurface;

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ selected, disabled }}
      testID={testID}
      style={[
        styles.container,
        {
          backgroundColor: bg,
          borderColor,
          opacity: disabled ? opacity.disabled : 1,
        },
      ]}
    >
      {LeadingIcon && (
        <LeadingIcon size={16} color={textColor} style={styles.leadingIcon} />
      )}
      <Label style={{ color: textColor, fontFamily: fontFamily.medium }}>
        {label}
      </Label>
      {TrailingIcon && (
        <Pressable
          onPress={handleTrailingPress}
          hitSlop={8}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${label}`}
        >
          <TrailingIcon size={16} color={textColor} style={styles.trailingIcon} />
        </Pressable>
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    alignSelf: "flex-start",
    gap: 4,
  },
  leadingIcon: {
    marginRight: 2,
  },
  trailingIcon: {
    marginLeft: 2,
  },
});
