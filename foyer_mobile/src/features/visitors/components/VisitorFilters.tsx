import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { AppChip } from "@/components/ui";
import { spacing } from "@/theme";
import { VisitorFilterCategory } from "../types";

interface VisitorFiltersProps {
  filters: VisitorFilterCategory[];
  selectedFilter: VisitorFilterCategory;
  onSelectFilter: (filter: VisitorFilterCategory) => void;
}

export const VisitorFilters = React.memo(function VisitorFilters({
  filters,
  selectedFilter,
  onSelectFilter,
}: VisitorFiltersProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filters.map((filter) => (
          <AppChip
            key={filter}
            label={filter}
            selected={selectedFilter === filter}
            onPress={() => onSelectFilter(filter)}
            accessibilityLabel={`Filter by ${filter}`}
          />
        ))}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
  },
  scrollContent: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
});
