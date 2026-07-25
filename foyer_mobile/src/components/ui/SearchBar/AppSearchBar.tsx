import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Search, X } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useAppTheme, spacing, radius, fontFamily, opacity } from "@/theme";
import type { AppSearchBarProps } from "./types";

export const AppSearchBar = React.memo(function AppSearchBar({
  value: externalValue,
  onChangeText,
  onDebouncedChange,
  debounceMs = 300,
  placeholder = "Search...",
  loading = false,
  disabled = false,
  style,
  accessibilityLabel = "Search input",
  testID,
}: AppSearchBarProps) {
  const theme = useAppTheme();
  const [query, setQuery] = useState(externalValue ?? "");
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync external controlled value if supplied
  useEffect(() => {
    if (externalValue !== undefined && externalValue !== query) {
      setQuery(externalValue);
    }
  }, [externalValue]);

  const handleChangeText = useCallback(
    (text: string) => {
      setQuery(text);
      onChangeText?.(text);

      if (onDebouncedChange) {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(() => {
          onDebouncedChange(text);
        }, debounceMs);
      }
    },
    [onChangeText, onDebouncedChange, debounceMs]
  );

  const handleClear = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setQuery("");
    onChangeText?.("");
    onDebouncedChange?.("");
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  }, [onChangeText, onDebouncedChange]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const hasText = query.length > 0;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.outline,
          opacity: disabled ? opacity.disabled : 1,
        },
        style,
      ]}
      accessibilityRole="search"
      testID={testID}
    >
      <Search
        size={18}
        color={theme.colors.onSurfaceVariant}
        style={styles.searchIcon}
      />
      <TextInput
        value={query}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.onSurfaceVariant}
        editable={!disabled}
        accessibilityLabel={accessibilityLabel}
        style={[
          styles.input,
          {
            color: theme.colors.onSurface,
            fontFamily: fontFamily.regular,
          },
        ]}
      />
      {loading ? (
        <ActivityIndicator
          size="small"
          color={theme.colors.primary}
          style={styles.actionSlot}
        />
      ) : hasText ? (
        <Pressable
          onPress={handleClear}
          disabled={disabled}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          style={styles.actionSlot}
        >
          <X size={16} color={theme.colors.onSurfaceVariant} />
        </Pressable>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 44,
    borderRadius: radius.full,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    width: "100%",
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 14,
    height: "100%",
    paddingVertical: 0,
  },
  actionSlot: {
    marginLeft: spacing.sm,
    justifyContent: "center",
    alignItems: "center",
  },
});
