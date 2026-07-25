import React from "react";
import { Text } from "react-native";
import { useAppTheme, typographyScale } from "@/theme";
import type { TypographyProps } from "./types";

function createTypographyComponent(
  variant: keyof typeof typographyScale,
  defaultRole: "header" | "text" = "text"
) {
  const Component = React.memo(function TypographyComponent({
    children,
    color,
    center,
    style,
    accessibilityLabel,
    testID,
    ...rest
  }: TypographyProps) {
    const theme = useAppTheme();
    const scale = typographyScale[variant];

    return (
      <Text
        accessibilityRole={defaultRole}
        accessibilityLabel={accessibilityLabel}
        testID={testID}
        style={[
          {
            fontFamily: scale.fontFamily,
            fontSize: scale.fontSize,
            lineHeight: scale.lineHeight,
            color: color ?? theme.colors.onSurface,
            textAlign: center ? "center" : undefined,
          },
          style,
        ]}
        {...rest}
      >
        {children}
      </Text>
    );
  });

  Component.displayName = variant.charAt(0).toUpperCase() + variant.slice(1);
  return Component;
}

export const H1 = createTypographyComponent("h1", "header");
export const H2 = createTypographyComponent("h2", "header");
export const Title = createTypographyComponent("title", "header");
export const Subtitle = createTypographyComponent("subtitle");
export const Body = createTypographyComponent("body");
export const Caption = createTypographyComponent("caption");
export const Label = createTypographyComponent("label");
