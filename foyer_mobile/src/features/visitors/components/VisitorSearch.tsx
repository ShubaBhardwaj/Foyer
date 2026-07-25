import React from "react";
import { View, StyleSheet } from "react-native";
import { AppSearchBar } from "@/components/ui";
import { spacing } from "@/theme";

interface VisitorSearchProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const VisitorSearch = React.memo(function VisitorSearch({
  value,
  onChangeText,
  placeholder = "Search visitors, flat, purpose...",
}: VisitorSearchProps) {
  return (
    <View style={styles.container}>
      <AppSearchBar
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        accessibilityLabel="Search visitors input"
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
  },
});
