import React from "react";
import { View, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  AppScreen,
  AppButton,
  AppCard,
  AppSectionHeader,
  AppTextField,
} from "@/components/ui";
import { spacing } from "@/theme";
import {
  useFacilityDetails,
  useAvailability,
  FacilitiesHeader,
  AvailabilityGrid,
} from "@/features/facilities";
import { Calendar, ArrowRight } from "lucide-react-native";

export default function AvailabilityScreen() {
  const router = useRouter();
  const { facilityId } = useLocalSearchParams<{ facilityId: string }>();

  const { facility } = useFacilityDetails(facilityId);
  const {
    selectedDate,
    setSelectedDate,
    slots,
    selectedSlotId,
    selectedSlot,
    handleSelectSlot,
  } = useAvailability(facilityId);

  return (
    <AppScreen scrollable={true} statusBarStyle="auto">
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <FacilitiesHeader
        title="Check Availability"
        showBack={true}
        onBackPress={() => router.back()}
      />

      {/* ─── Selected Date Bar ──────────────────────────────────────────── */}
      <AppSectionHeader title="Select Reservation Date" />
      <AppCard variant="outlined" style={styles.dateCard}>
        <AppTextField
          label="Reservation Date"
          value={selectedDate}
          onChangeText={setSelectedDate}
          leftIcon={Calendar}
        />
      </AppCard>

      {/* ─── Time Slot Picker Grid ──────────────────────────────────────── */}
      <AvailabilityGrid
        slots={slots}
        selectedSlotId={selectedSlotId}
        onSelectSlot={handleSelectSlot}
      />

      {/* ─── Continue Booking Action Button ────────────────────────────── */}
      <View style={styles.actionContainer}>
        <AppButton
          label={selectedSlot ? `Continue Booking (${selectedSlot.time})` : "Select a Time Slot"}
          variant="filled"
          size="lg"
          disabled={!selectedSlotId}
          rightIcon={ArrowRight}
          onPress={() =>
            router.push(`/(app)/(tabs)/(facilities)/${facilityId}/book?slotId=${selectedSlotId}` as any)
          }
          fullWidth
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  dateCard: {
    marginBottom: spacing.md,
  },
  actionContainer: {
    marginVertical: spacing.lg,
  },
});
