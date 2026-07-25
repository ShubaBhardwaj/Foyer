import React, { useCallback } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useAppTheme, spacing, radius, elevation as elevationTokens, animation } from "@/theme";
import type { AppCardProps, CardVariant } from "./types";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const AppCard = React.memo(function AppCard({
  children,
  variant = "elevated",
  onPress,
  style,
  accessibilityLabel,
  accessibilityHint,
  testID,
}: AppCardProps) {
  const theme = useAppTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    if (onPress) {
      scale.value = withTiming(0.98, { duration: animation.fast });
    }
  }, [onPress, scale]);

  const handlePressOut = useCallback(() => {
    if (onPress) {
      scale.value = withTiming(1, { duration: animation.fast });
    }
  }, [onPress, scale]);

  const handlePress = useCallback(() => {
    if (!onPress) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }, [onPress]);

  const variantStyle = getVariantStyle(variant, theme.colors);
  const Container = onPress ? AnimatedPressable : View;

  const containerProps = onPress
    ? {
        onPress: handlePress,
        onPressIn: handlePressIn,
        onPressOut: handlePressOut,
        accessibilityRole: "button" as const,
      }
    : {};

  return (
    <Container
      {...containerProps}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      testID={testID}
      style={[
        onPress ? animatedStyle : undefined,
        styles.base,
        variantStyle,
        style,
      ] as any}
    >
      {children}
    </Container>
  );
});

function getVariantStyle(
  variant: CardVariant,
  colors: ReturnType<typeof useAppTheme>["colors"]
) {
  switch (variant) {
    case "elevated":
      return {
        backgroundColor: colors.surface,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: elevationTokens.md,
      };
    case "outlined":
      return {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.outline,
      };
    case "filled":
      return {
        backgroundColor: colors.surfaceVariant ?? colors.secondaryContainer,
      };
  }
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    overflow: "hidden",
  },
});
