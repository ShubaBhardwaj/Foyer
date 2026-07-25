import React from "react";
import { View, StyleSheet } from "react-native";
import { AppSearchBar } from "@/components/ui";
import { spacing } from "@/theme";

interface FacilitySearchProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const FacilitySearch = React.memo(function FacilitySearch({
  value,
  onChangeText,
  placeholder = "Search swimming pool, gym, tennis...",
}: FacilitySearchProps) {
  return (
    <View style={styles.container}>
      <AppSearchBar
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        accessibilityLabel="Search facilities input"
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
  },
});
