import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";
import * as Haptics from "expo-haptics";
import { useAppTheme, spacing, radius, fontFamily, opacity } from "@/theme";
import { Title, Caption } from "../Typography";
import type { AppOtpInputProps } from "./types";

export const AppOtpInput = React.memo(function AppOtpInput({
  length = 6,
  value: externalValue,
  onChange,
  onComplete,
  masked = false,
  error,
  disabled = false,
  style,
  accessibilityLabel = "OTP entry code",
  testID,
}: AppOtpInputProps) {
  const theme = useAppTheme();
  const inputRef = useRef<TextInput>(null);
  const [internalValue, setInternalValue] = useState(externalValue ?? "");
  const [isFocused, setIsFocused] = useState(false);

  const code = externalValue !== undefined ? externalValue : internalValue;
  const isError = Boolean(error);
  const errorMessage = typeof error === "string" ? error : undefined;

  useEffect(() => {
    if (externalValue !== undefined) {
      setInternalValue(externalValue);
    }
  }, [externalValue]);

  const handleChangeText = useCallback(
    (text: string) => {
      // Clean non-numeric characters if numeric
      const sanitized = text.replace(/[^0-9a-zA-Z]/g, "").slice(0, length);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      setInternalValue(sanitized);
      onChange?.(sanitized);

      if (sanitized.length === length) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onComplete?.(sanitized);
      }
    },
    [length, onChange, onComplete]
  );

  const handleBoxPress = useCallback(() => {
    if (disabled) return;
    inputRef.current?.focus();
  }, [disabled]);

  const digits = code.split("");

  return (
    <View style={[styles.outerContainer, style]} testID={testID}>
      {/* Hidden Master TextInput for input/paste/SMS autofill */}
      <TextInput
        ref={inputRef}
        value={code}
        onChangeText={handleChangeText}
        maxLength={length}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        editable={!disabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        accessibilityLabel={accessibilityLabel}
        style={styles.hiddenInput}
      />

      <Pressable
        onPress={handleBoxPress}
        disabled={disabled}
        accessibilityRole="none"
        accessibilityLabel={`OTP Code: ${code}`}
        style={[
          styles.boxesRow,
          { opacity: disabled ? opacity.disabled : 1 },
        ]}
      >
        {Array.from({ length }).map((_, index) => {
          const char = digits[index] ?? "";
          const isCurrentBox = isFocused && index === Math.min(digits.length, length - 1);
          const displayChar = masked && char ? "•" : char;

          let boxBorderColor = theme.colors.outline;
          if (isError) {
            boxBorderColor = theme.colors.error;
          } else if (isCurrentBox) {
            boxBorderColor = theme.colors.primary;
          }

          return (
            <View
              key={index}
              style={[
                styles.box,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: boxBorderColor,
                  borderWidth: isCurrentBox || isError ? 2 : 1,
                  borderRadius: radius.md,
                },
              ]}
            >
              <Title
                style={[
                  styles.digitText,
                  {
                    color: isError
                      ? theme.colors.error
                      : theme.colors.onSurface,
                  },
                ]}
              >
                {displayChar}
              </Title>
            </View>
          );
        })}
      </Pressable>

      {errorMessage && (
        <Caption style={[styles.errorText, { color: theme.colors.error }]}>
          {errorMessage}
        </Caption>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  outerContainer: {
    alignItems: "center",
    width: "100%",
  },
  hiddenInput: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
  boxesRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.sm,
    width: "100%",
  },
  box: {
    width: 48,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  digitText: {
    fontSize: 22,
    fontFamily: fontFamily.bold,
  },
  errorText: {
    marginTop: spacing.sm,
    textAlign: "center",
  },
});
