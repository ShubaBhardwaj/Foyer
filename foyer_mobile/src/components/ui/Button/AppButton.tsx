import React, { useCallback } from "react";
import { ActivityIndicator, StyleSheet, Pressable, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useAppTheme, spacing, radius, fontFamily, animation, opacity } from "@/theme";
import type { AppButtonProps, ButtonVariant, ButtonSize } from "./types";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SIZE_CONFIG: Record<ButtonSize, { height: number; paddingHorizontal: number; fontSize: number; iconSize: number }> = {
  sm: { height: 36, paddingHorizontal: spacing.md, fontSize: 13, iconSize: 16 },
  md: { height: 44, paddingHorizontal: spacing.lg, fontSize: 14, iconSize: 18 },
  lg: { height: 52, paddingHorizontal: spacing.xl, fontSize: 16, iconSize: 20 },
};

export const AppButton = React.memo(function AppButton({
  label,
  variant = "filled",
  size = "md",
  loading = false,
  disabled = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  onPress,
  fullWidth = false,
  accessibilityLabel,
  accessibilityHint,
  testID,
}: AppButtonProps) {
  const theme = useAppTheme();
  const scale = useSharedValue(1);
  const sizeConfig = SIZE_CONFIG[size];

  const isDisabled = disabled || loading;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withTiming(0.97, { duration: animation.fast });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withTiming(1, { duration: animation.fast });
  }, [scale]);

  const handlePress = useCallback(() => {
    if (isDisabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  }, [isDisabled, onPress]);

  const colors = getVariantColors(variant, theme.colors);
  const iconColor = colors.text;

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      testID={testID}
      style={[
        animatedStyle,
        styles.base,
        {
          height: sizeConfig.height,
          paddingHorizontal: sizeConfig.paddingHorizontal,
          backgroundColor: colors.bg,
          borderColor: colors.border,
          borderWidth: variant === "outlined" ? 1 : 0,
          borderRadius: radius.md,
          opacity: isDisabled ? opacity.disabled : 1,
          alignSelf: fullWidth ? "stretch" : "flex-start",
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.text} />
      ) : (
        <View style={styles.content}>
          {LeftIcon && (
            <LeftIcon
              size={sizeConfig.iconSize}
              color={iconColor}
              style={styles.leftIcon}
            />
          )}
          <Animated.Text
            style={[
              styles.label,
              {
                fontSize: sizeConfig.fontSize,
                color: colors.text,
                fontFamily: fontFamily.semiBold,
              },
            ]}
          >
            {label}
          </Animated.Text>
          {RightIcon && (
            <RightIcon
              size={sizeConfig.iconSize}
              color={iconColor}
              style={styles.rightIcon}
            />
          )}
        </View>
      )}
    </AnimatedPressable>
  );
});

function getVariantColors(
  variant: ButtonVariant,
  colors: ReturnType<typeof useAppTheme>["colors"]
) {
  switch (variant) {
    case "filled":
      return { bg: colors.primary, text: colors.onPrimary, border: "transparent" };
    case "tonal":
      return { bg: colors.secondaryContainer, text: colors.onSecondaryContainer, border: "transparent" };
    case "outlined":
      return { bg: "transparent", text: colors.primary, border: colors.outline };
    case "text":
      return { bg: "transparent", text: colors.primary, border: "transparent" };
    case "danger":
      return { bg: colors.error, text: colors.onError, border: "transparent" };
  }
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 64,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  label: {
    textAlign: "center",
  },
  leftIcon: {
    marginRight: 2,
  },
  rightIcon: {
    marginLeft: 2,
  },
});
