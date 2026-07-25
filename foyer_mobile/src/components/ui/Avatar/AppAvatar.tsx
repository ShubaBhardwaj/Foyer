import React from "react";
import { View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useAppTheme, fontFamily, radius } from "@/theme";
import { Body } from "../Typography";
import type { AppAvatarProps, AvatarSize } from "./types";

const SIZE_MAP: Record<AvatarSize, { container: number; fontSize: number; iconSize: number }> = {
  sm: { container: 32, fontSize: 12, iconSize: 16 },
  md: { container: 40, fontSize: 14, iconSize: 20 },
  lg: { container: 56, fontSize: 20, iconSize: 28 },
  xl: { container: 72, fontSize: 26, iconSize: 36 },
};

export const AppAvatar = React.memo(function AppAvatar({
  mode,
  source,
  initials,
  icon: Icon,
  size = "md",
  accessibilityLabel,
  testID,
}: AppAvatarProps) {
  const theme = useAppTheme();
  const sizeConfig = SIZE_MAP[size];

  const containerStyle = [
    styles.container,
    {
      width: sizeConfig.container,
      height: sizeConfig.container,
      borderRadius: radius.full,
      backgroundColor: theme.colors.primaryContainer,
    },
  ];

  return (
    <View
      style={containerStyle}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel ?? initials ?? "Avatar"}
      testID={testID}
    >
      {mode === "image" && source ? (
        <Image
          source={source}
          style={[
            styles.image,
            {
              width: sizeConfig.container,
              height: sizeConfig.container,
              borderRadius: radius.full,
            },
          ]}
          contentFit="cover"
          transition={200}
        />
      ) : mode === "initials" && initials ? (
        <Body
          style={{
            fontSize: sizeConfig.fontSize,
            fontFamily: fontFamily.semiBold,
            color: theme.colors.onPrimaryContainer,
          }}
        >
          {initials.toUpperCase().slice(0, 2)}
        </Body>
      ) : mode === "icon" && Icon ? (
        <Icon
          size={sizeConfig.iconSize}
          color={theme.colors.onPrimaryContainer}
        />
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  image: {
    position: "absolute",
  },
});
