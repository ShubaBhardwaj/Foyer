import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { AppScreen } from "@/components/ui";
import { spacing } from "@/theme";
import {
  useFacilities,
  FacilitiesHeader,
  FacilitySearch,
  FacilitySegment,
  FacilityFilters,
  FacilityGrid,
} from "@/features/facilities";
import { History } from "lucide-react-native";

export default function FacilitiesHomeScreen() {
  const router = useRouter();
  const [segmentIndex, setSegmentIndex] = useState(0); // 0 = Facilities, 1 = My Bookings

  const {
    facilities,
    categories,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    isLoading,
  } = useFacilities();

  const handleFacilityPress = (facilityId: string) => {
    router.push(`/(app)/(tabs)/(facilities)/${facilityId}` as any);
  };

  const handleSegmentChange = (index: number) => {
    if (index === 1) {
      router.push("/(app)/(tabs)/(facilities)/bookings" as any);
    } else {
      setSegmentIndex(0);
    }
  };

  return (
    <AppScreen scrollable={true} statusBarStyle="auto">
      {/* ─── 1. Header ─────────────────────────────────────────────────── */}
      <FacilitiesHeader
        title="Facilities"
        rightActionIcon={History}
        onRightActionPress={() => router.push("/(app)/(tabs)/(facilities)/booking-history" as any)}
      />

      {/* ─── 2. Search Bar ─────────────────────────────────────────────── */}
      <FacilitySearch value={searchQuery} onChangeText={setSearchQuery} />

      {/* ─── 3. Segment Control (Facilities / My Bookings) ──────────────── */}
      <FacilitySegment
        selectedIndex={segmentIndex}
        onSegmentChange={handleSegmentChange}
      />

      {/* ─── 4. Category Filters Chips ─────────────────────────────────── */}
      <FacilityFilters
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* ─── 5. 2-Column Responsive Image Grid ─────────────────────────── */}
      <FacilityGrid
        facilities={facilities}
        onFacilityPress={handleFacilityPress}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onResetSearch={() => setSearchQuery("")}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({});
