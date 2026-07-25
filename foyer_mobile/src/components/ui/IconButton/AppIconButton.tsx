import React, { useCallback } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useAppTheme, radius, animation, opacity } from "@/theme";
import type { AppIconButtonProps, IconButtonVariant } from "./types";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const AppIconButton = React.memo(function AppIconButton({
  icon: Icon,
  variant = "filled",
  size = 40,
  disabled = false,
  onPress,
  accessibilityLabel,
  accessibilityHint,
  testID,
}: AppIconButtonProps) {
  const theme = useAppTheme();
  const scale = useSharedValue(1);
  const iconSize = Math.round(size * 0.5);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withTiming(0.92, { duration: animation.fast });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withTiming(1, { duration: animation.fast });
  }, [scale]);

  const handlePress = useCallback(() => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  }, [disabled, onPress]);

  const colors = getVariantColors(variant, theme.colors);

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      testID={testID}
      style={[
        animatedStyle,
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: radius.full,
          backgroundColor: colors.bg,
          borderColor: colors.border,
          borderWidth: variant === "outlined" ? 1 : 0,
          opacity: disabled ? opacity.disabled : 1,
        },
      ]}
    >
      <Icon size={iconSize} color={colors.icon} />
    </AnimatedPressable>
  );
});

function getVariantColors(
  variant: IconButtonVariant,
  colors: ReturnType<typeof useAppTheme>["colors"]
) {
  switch (variant) {
    case "filled":
      return { bg: colors.primary, icon: colors.onPrimary, border: "transparent" };
    case "tonal":
      return { bg: colors.secondaryContainer, icon: colors.onSecondaryContainer, border: "transparent" };
    case "outlined":
      return { bg: "transparent", icon: colors.primary, border: colors.outline };
  }
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
  },
});
