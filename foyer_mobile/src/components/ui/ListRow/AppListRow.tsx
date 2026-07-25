import React, { useCallback } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { ChevronRight } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useAppTheme, spacing, animation } from "@/theme";
import { Body, Subtitle } from "../Typography";
import { AppLoader } from "../Loader";
import type { AppListRowProps } from "./types";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const AppListRow = React.memo(function AppListRow({
  title,
  subtitle,
  leading,
  trailing,
  showChevron = false,
  onPress,
  loading = false,
  divider = true,
  style,
  accessibilityLabel,
  accessibilityHint,
  testID,
}: AppListRowProps) {
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
    if (!onPress || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }, [onPress, loading]);

  if (loading) {
    return <AppLoader mode="skeleton" skeletonVariant="list-row" style={style} />;
  }

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
      accessibilityLabel={accessibilityLabel ?? `${title}${subtitle ? `, ${subtitle}` : ""}`}
      accessibilityHint={accessibilityHint}
      testID={testID}
      style={[
        onPress ? animatedStyle : undefined,
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderBottomColor: divider ? theme.colors.outline : "transparent",
          borderBottomWidth: divider ? StyleSheet.hairlineWidth : 0,
        },
        style,
      ] as any}
    >
      {leading && <View style={styles.leadingContainer}>{leading}</View>}
      <View style={styles.contentContainer}>
        <Body style={styles.title}>{title}</Body>
        {subtitle && (
          <Subtitle
            style={[
              styles.subtitle,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {subtitle}
          </Subtitle>
        )}
      </View>
      {(trailing || showChevron) && (
        <View style={styles.trailingContainer}>
          {trailing}
          {showChevron && (
            <ChevronRight
              size={18}
              color={theme.colors.onSurfaceVariant}
              style={styles.chevron}
            />
          )}
        </View>
      )}
    </Container>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    width: "100%",
    minHeight: 56,
  },
  leadingContainer: {
    marginRight: spacing.md,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: "500",
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  trailingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: spacing.md,
  },
  chevron: {
    marginLeft: spacing.xs,
  },
});
