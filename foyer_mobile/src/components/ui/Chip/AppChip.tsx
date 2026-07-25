import React, { useCallback } from "react";
import { View, Pressable, StyleSheet } from "react-native";
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
    <View
      style={[
        styles.container,
        {
          backgroundColor: bg,
          borderColor,
          opacity: disabled ? opacity.disabled : 1,
        },
      ]}
      testID={testID}
    >
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ selected, disabled }}
        style={styles.mainArea}
      >
        {LeadingIcon && (
          <LeadingIcon size={16} color={textColor} style={styles.leadingIcon} />
        )}
        <Label style={{ color: textColor, fontFamily: fontFamily.medium }}>
          {label}
        </Label>
      </Pressable>
      {TrailingIcon && (
        <Pressable
          onPress={handleTrailingPress}
          hitSlop={8}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${label}`}
          style={styles.trailingArea}
        >
          <TrailingIcon size={16} color={textColor} style={styles.trailingIcon} />
        </Pressable>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.sm,
    borderWidth: 1,
    alignSelf: "flex-start",
    overflow: "hidden",
  },
  mainArea: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
    paddingVertical: spacing.sm,
    gap: 4,
  },
  leadingIcon: {
    marginRight: 2,
  },
  trailingArea: {
    paddingRight: spacing.md,
    paddingVertical: spacing.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  trailingIcon: {
    marginLeft: 2,
  },
});
