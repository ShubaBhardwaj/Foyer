import React from "react";
import { View, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  AppScreen,
  AppButton,
  AppLoader,
} from "@/components/ui";
import { spacing } from "@/theme";
import {
  useFacilityDetails,
  FacilitiesHeader,
  FacilityHero,
  FacilityGallery,
  FacilityAmenities,
  FacilityRules,
} from "@/features/facilities";
import { CalendarCheck } from "lucide-react-native";

export default function FacilityDetailsScreen() {
  const router = useRouter();
  const { facilityId } = useLocalSearchParams<{ facilityId: string }>();

  const { facility, isLoading } = useFacilityDetails(facilityId);

  if (isLoading || !facility) {
    return (
      <AppScreen scrollable={false}>
        {/* TODO: Replace with backend loading state */}
        <AppLoader mode="fullscreen" message="Loading facility details..." />
      </AppScreen>
    );
  }

  const isBookable = facility.status === "Available";

  return (
    <AppScreen scrollable={true} statusBarStyle="auto">
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <FacilitiesHeader
        title={facility.name}
        showBack={true}
        onBackPress={() => router.back()}
      />

      {/* ─── Hero Overview Card ─────────────────────────────────────────── */}
      <FacilityHero facility={facility} />

      {/* ─── Photo Gallery ──────────────────────────────────────────────── */}
      <FacilityGallery />

      {/* ─── Amenities ──────────────────────────────────────────────────── */}
      <FacilityAmenities amenities={facility.amenities} />

      {/* ─── Rules & Guidelines ─────────────────────────────────────────── */}
      <FacilityRules rules={facility.rules} />

      {/* ─── Book Action Button ────────────────────────────────────────── */}
      <View style={styles.actionContainer}>
        <AppButton
          label={isBookable ? "Book Facility & Select Time Slot" : "Facility Unavailable"}
          variant="filled"
          size="lg"
          disabled={!isBookable}
          leftIcon={CalendarCheck}
          onPress={() => router.push(`/(app)/(tabs)/(facilities)/${facility.id}/availability` as any)}
          fullWidth
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  actionContainer: {
    marginVertical: spacing.lg,
  },
});
