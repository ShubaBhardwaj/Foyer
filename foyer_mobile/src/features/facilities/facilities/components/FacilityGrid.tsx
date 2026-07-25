import React from "react";
import { View, StyleSheet } from "react-native";
import { AppLoader } from "@/components/ui";
import { FacilityCard } from "./FacilityCard";
import { FacilitiesEmptyState } from "../../shared/components/FacilitiesEmptyState";
import { FacilityItem } from "../../shared/types/facility.types";

interface FacilityGridProps {
  facilities: FacilityItem[];
  onFacilityPress: (facilityId: string) => void;
  isLoading?: boolean;
  searchQuery?: string;
  onResetSearch?: () => void;
}

export const FacilityGrid = React.memo(function FacilityGrid({
  facilities,
  onFacilityPress,
  isLoading = false,
  searchQuery,
  onResetSearch,
}: FacilityGridProps) {
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        {/* TODO: Replace with backend loading state */}
        <AppLoader mode="skeleton" skeletonVariant="card" />
        <AppLoader mode="skeleton" skeletonVariant="card" />
      </View>
    );
  }

  if (facilities.length === 0) {
    return (
      <FacilitiesEmptyState
        type={searchQuery ? "search" : "facilities"}
        query={searchQuery}
        onResetSearch={onResetSearch}
      />
    );
  }

  return (
    <View style={styles.gridContainer}>
      {facilities.map((fac) => (
        <View key={fac.id} style={styles.col}>
          <FacilityCard facility={fac} onPress={onFacilityPress} />
        </View>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  loadingContainer: {
    marginVertical: 12,
    gap: 12,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  col: {
    width: "48.5%",
  },
});
