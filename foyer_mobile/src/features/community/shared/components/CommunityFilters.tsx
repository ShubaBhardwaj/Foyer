import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { AppChip } from "@/components/ui";
import { spacing } from "@/theme";

export type CommunityCategoryFilter = string;

interface CommunityFiltersProps {
  filters: CommunityCategoryFilter[];
  selectedFilter: CommunityCategoryFilter;
  onSelectFilter: (filter: CommunityCategoryFilter) => void;
}

export const CommunityFilters = React.memo(function CommunityFilters({
  filters,
  selectedFilter,
  onSelectFilter,
}: CommunityFiltersProps) {
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
