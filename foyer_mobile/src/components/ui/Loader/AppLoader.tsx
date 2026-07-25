import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useAppTheme, spacing, radius } from "@/theme";
import { Body } from "../Typography";
import type { AppLoaderProps, SkeletonVariant } from "./types";

export const AppLoader = React.memo(function AppLoader({
  mode = "inline",
  skeletonVariant = "line",
  size = "small",
  message,
  style,
  testID,
}: AppLoaderProps) {
  const theme = useAppTheme();
  const opacityVal = useSharedValue(0.4);

  useEffect(() => {
    if (mode === "skeleton") {
      opacityVal.value = withRepeat(
        withSequence(
          withTiming(0.85, { duration: 750 }),
          withTiming(0.4, { duration: 750 })
        ),
        -1,
        true
      );
    }
  }, [mode, opacityVal]);

  const animatedSkeletonStyle = useAnimatedStyle(() => ({
    opacity: opacityVal.value,
  }));

  if (mode === "skeleton") {
    return (
      <View style={[styles.skeletonContainer, style]} testID={testID}>
        <RenderSkeleton
          variant={skeletonVariant}
          animatedStyle={animatedSkeletonStyle}
          themeColors={theme.colors}
        />
      </View>
    );
  }

  if (mode === "fullscreen") {
    return (
      <View
        style={[
          styles.fullscreenContainer,
          { backgroundColor: theme.colors.background },
          style,
        ]}
        accessibilityRole="progressbar"
        accessibilityLabel={message ?? "Loading"}
        testID={testID}
      >
        <ActivityIndicator size={size} color={theme.colors.primary} />
        {message && <Body style={styles.message}>{message}</Body>}
      </View>
    );
  }

  if (mode === "overlay") {
    return (
      <View
        style={[styles.overlayContainer, style]}
        accessibilityRole="progressbar"
        accessibilityLabel={message ?? "Loading"}
        testID={testID}
      >
        <View
          style={[
            styles.overlayBox,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <ActivityIndicator size={size} color={theme.colors.primary} />
          {message && <Body style={styles.message}>{message}</Body>}
        </View>
      </View>
    );
  }

  // Inline mode
  return (
    <View
      style={[styles.inlineContainer, style]}
      accessibilityRole="progressbar"
      testID={testID}
    >
      <ActivityIndicator size={size} color={theme.colors.primary} />
    </View>
  );
});

function RenderSkeleton({
  variant,
  animatedStyle,
  themeColors,
}: {
  variant: SkeletonVariant;
  animatedStyle: any;
  themeColors: ReturnType<typeof useAppTheme>["colors"];
}) {
  const baseBg = { backgroundColor: themeColors.surfaceVariant ?? themeColors.outline };

  if (variant === "avatar") {
    return (
      <Animated.View
        style={[
          styles.skeletonAvatar,
          baseBg,
          animatedStyle,
        ]}
      />
    );
  }

  if (variant === "list-row") {
    return (
      <View style={styles.skeletonRow}>
        <Animated.View
          style={[styles.skeletonAvatar, baseBg, animatedStyle]}
        />
        <View style={styles.skeletonRowContent}>
          <Animated.View
            style={[styles.skeletonLineFull, baseBg, animatedStyle]}
          />
          <Animated.View
            style={[styles.skeletonLineHalf, baseBg, animatedStyle]}
          />
        </View>
      </View>
    );
  }

  if (variant === "card") {
    return (
      <View
        style={[
          styles.skeletonCard,
          { backgroundColor: themeColors.surface, borderColor: themeColors.outline },
        ]}
      >
        <Animated.View
          style={[styles.skeletonCardHeader, baseBg, animatedStyle]}
        />
        <Animated.View
          style={[styles.skeletonLineFull, baseBg, animatedStyle]}
        />
        <Animated.View
          style={[styles.skeletonLineHalf, baseBg, animatedStyle]}
        />
      </View>
    );
  }

  // default line
  return (
    <Animated.View
      style={[styles.skeletonLineFull, baseBg, animatedStyle]}
    />
  );
}

const styles = StyleSheet.create({
  inlineContainer: {
    padding: spacing.xs,
    justifyContent: "center",
    alignItems: "center",
  },
  fullscreenContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  overlayBox: {
    padding: spacing.xl,
    borderRadius: radius.lg,
    alignItems: "center",
    minWidth: 120,
    elevation: 4,
  },
  message: {
    marginTop: spacing.md,
    textAlign: "center",
  },
  skeletonContainer: {
    width: "100%",
    paddingVertical: spacing.xs,
  },
  skeletonAvatar: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
  },
  skeletonLineFull: {
    width: "100%",
    height: 16,
    borderRadius: radius.xs,
    marginVertical: 4,
  },
  skeletonLineHalf: {
    width: "60%",
    height: 14,
    borderRadius: radius.xs,
    marginVertical: 4,
  },
  skeletonRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    gap: spacing.md,
  },
  skeletonRowContent: {
    flex: 1,
  },
  skeletonCard: {
    width: "100%",
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.sm,
  },
  skeletonCardHeader: {
    width: "40%",
    height: 20,
    borderRadius: radius.xs,
    marginBottom: spacing.xs,
  },
});
