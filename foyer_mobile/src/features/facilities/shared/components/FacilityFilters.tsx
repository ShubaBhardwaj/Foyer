import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { AppChip } from "@/components/ui";
import { spacing } from "@/theme";
import { FacilityCategory } from "../types/facility.types";

interface FacilityFiltersProps {
  categories: FacilityCategory[];
  selectedCategory: FacilityCategory;
  onSelectCategory: (category: FacilityCategory) => void;
}

export const FacilityFilters = React.memo(function FacilityFilters({
  categories,
  selectedCategory,
  onSelectCategory,
}: FacilityFiltersProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((cat) => (
          <AppChip
            key={cat}
            label={cat}
            selected={selectedCategory === cat}
            onPress={() => onSelectCategory(cat)}
            accessibilityLabel={`Filter by category ${cat}`}
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
