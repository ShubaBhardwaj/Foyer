import React, { useState, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput as PaperTextInput } from "react-native-paper";
import { Eye, EyeOff } from "lucide-react-native";
import { useAppTheme, spacing, fontFamily } from "@/theme";
import { Caption } from "../Typography";
import type { AppTextFieldProps } from "./types";

export const AppTextField = React.forwardRef<any, AppTextFieldProps>(
  function AppTextField(
    {
      label,
      helperText,
      errorMessage,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      onRightIconPress,
      isPassword = false,
      secureTextEntry,
      disabled = false,
      multiline = false,
      style,
      accessibilityLabel,
      accessibilityHint,
      testID,
      ...restProps
    },
    ref
  ) {
    const theme = useAppTheme();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const isSecure = isPassword ? !isPasswordVisible : secureTextEntry;
    const isError = Boolean(errorMessage);

    const togglePasswordVisibility = useCallback(() => {
      setIsPasswordVisible((prev) => !prev);
    }, []);

    const iconColor = isError
      ? theme.colors.error
      : theme.colors.onSurfaceVariant;

    // Determine left node for Paper TextInput
    const leftNode = LeftIcon ? (
      <PaperTextInput.Icon
        icon={() => <LeftIcon size={20} color={iconColor} />}
        forceTextInputFocus={false}
      />
    ) : undefined;

    // Determine right node for Paper TextInput
    let rightNode = undefined;
    if (isPassword) {
      const ToggleIcon = isPasswordVisible ? EyeOff : Eye;
      rightNode = (
        <PaperTextInput.Icon
          icon={() => <ToggleIcon size={20} color={iconColor} />}
          onPress={togglePasswordVisibility}
          accessibilityLabel={
            isPasswordVisible ? "Hide password" : "Show password"
          }
          forceTextInputFocus={false}
        />
      );
    } else if (RightIcon) {
      rightNode = (
        <PaperTextInput.Icon
          icon={() => <RightIcon size={20} color={iconColor} />}
          onPress={onRightIconPress}
          forceTextInputFocus={false}
        />
      );
    }

    return (
      <View style={styles.container}>
        <PaperTextInput
          ref={ref}
          mode="outlined"
          label={label}
          disabled={disabled}
          multiline={multiline}
          secureTextEntry={isSecure}
          error={isError}
          left={leftNode}
          right={rightNode}
          accessibilityLabel={accessibilityLabel ?? label}
          accessibilityHint={accessibilityHint}
          accessibilityRole="none"
          testID={testID}
          theme={{
            roundness: 12,
            fonts: {
              bodyLarge: { fontFamily: fontFamily.regular },
            },
          }}
          outlineStyle={{
            borderRadius: 12,
            borderColor: isError ? theme.colors.error : theme.colors.outline,
          }}
          contentStyle={[
            {
              fontFamily: fontFamily.regular,
              color: theme.colors.onSurface,
            },
          ]}
          style={[styles.input, style]}
          {...restProps}
        />
        {isError ? (
          <Caption style={[styles.message, { color: theme.colors.error }]}>
            {errorMessage}
          </Caption>
        ) : helperText ? (
          <Caption
            style={[
              styles.message,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {helperText}
          </Caption>
        ) : null}
      </View>
    );
  }
);
AppTextField.displayName = "AppTextField";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: "transparent",
  },
  message: {
    marginTop: spacing.xs,
    marginLeft: spacing.sm,
  },
});
