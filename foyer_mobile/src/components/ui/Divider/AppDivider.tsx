import React from "react";
import { View, StyleSheet } from "react-native";
import { useAppTheme } from "@/theme";
import type { AppDividerProps } from "./types";

export const AppDivider = React.memo(function AppDivider({
  orientation = "horizontal",
  thickness = 1,
  color,
  spacing = 0,
  style,
  testID,
}: AppDividerProps) {
  const theme = useAppTheme();
  const dividerColor = color ?? theme.colors.outline;

  const isHorizontal = orientation === "horizontal";

  return (
    <View
      accessibilityRole="none"
      testID={testID}
      style={[
        isHorizontal
          ? {
              height: thickness,
              width: "100%",
              marginVertical: spacing,
              backgroundColor: dividerColor,
            }
          : {
              width: thickness,
              height: "100%",
              marginHorizontal: spacing,
              backgroundColor: dividerColor,
            },
        style,
      ]}
    />
  );
});
