import React from "react";
import { View, StyleSheet } from "react-native";
import { AppSearchBar } from "@/components/ui";
import { spacing } from "@/theme";

interface CommunitySearchProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const CommunitySearch = React.memo(function CommunitySearch({
  value,
  onChangeText,
  placeholder = "Search posts, polls, events, notices...",
}: CommunitySearchProps) {
  return (
    <View style={styles.container}>
      <AppSearchBar
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        accessibilityLabel="Search community content input"
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
  },
});
