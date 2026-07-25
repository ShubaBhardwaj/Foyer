import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Pressable,
  LayoutChangeEvent,
  StyleSheet,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useAppTheme, spacing, radius, fontFamily, opacity } from "@/theme";
import { Label } from "../Typography";
import type { AppSegmentedControlProps, SegmentItem } from "./types";

export function AppSegmentedControl<T extends string = string>({
  segments,
  value,
  onChange,
  fullWidth = true,
  disabled = false,
  style,
  testID,
}: AppSegmentedControlProps<T>) {
  const theme = useAppTheme();
  const [containerWidth, setContainerWidth] = useState(0);

  const selectedIndex = segments.findIndex((s) => s.value === value);
  const activeIndex = selectedIndex >= 0 ? selectedIndex : 0;

  const numSegments = segments.length;
  const itemWidth = containerWidth > 0 ? (containerWidth - 8) / numSegments : 0;

  const indicatorTranslateX = useSharedValue(0);

  useEffect(() => {
    if (itemWidth > 0) {
      indicatorTranslateX.value = withSpring(activeIndex * itemWidth, {
        damping: 18,
        stiffness: 180,
      });
    }
  }, [activeIndex, itemWidth, indicatorTranslateX]);

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  }, []);

  const handleSelect = useCallback(
    (item: SegmentItem<T>) => {
      if (disabled || item.value === value) return;
      Haptics.selectionAsync();
      onChange(item.value);
    },
    [disabled, value, onChange]
  );

  const animatedIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorTranslateX.value }],
    width: itemWidth,
  }));

  return (
    <View
      onLayout={handleLayout}
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surfaceVariant ?? theme.colors.secondaryContainer,
          opacity: disabled ? opacity.disabled : 1,
          alignSelf: fullWidth ? "stretch" : "flex-start",
        },
        style,
      ]}
      accessibilityRole="tablist"
      testID={testID}
    >
      {containerWidth > 0 && (
        <Animated.View
          style={[
            styles.indicator,
            { backgroundColor: theme.colors.surface },
            animatedIndicatorStyle,
          ]}
        />
      )}
      {segments.map((segment) => {
        const isSelected = segment.value === value;
        const Icon = segment.icon;

        return (
          <Pressable
            key={segment.value}
            onPress={() => handleSelect(segment)}
            disabled={disabled}
            accessibilityRole="tab"
            accessibilityLabel={segment.label}
            accessibilityState={{ selected: isSelected, disabled }}
            style={styles.segmentButton}
          >
            {Icon && (
              <Icon
                size={16}
                color={
                  isSelected
                    ? theme.colors.primary
                    : theme.colors.onSurfaceVariant
                }
              />
            )}
            <Label
              style={[
                styles.label,
                {
                  fontFamily: isSelected
                    ? fontFamily.semiBold
                    : fontFamily.medium,
                  color: isSelected
                    ? theme.colors.primary
                    : theme.colors.onSurfaceVariant,
                },
              ]}
            >
              {segment.label}
            </Label>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 40,
    borderRadius: radius.md,
    padding: 4,
    position: "relative",
    alignItems: "center",
  },
  indicator: {
    position: "absolute",
    top: 4,
    bottom: 4,
    left: 4,
    borderRadius: radius.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentButton: {
    flex: 1,
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    zIndex: 1,
  },
  label: {
    fontSize: 13,
  },
});
