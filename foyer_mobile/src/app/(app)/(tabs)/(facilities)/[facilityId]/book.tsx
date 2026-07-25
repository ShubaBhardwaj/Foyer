import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  AppScreen,
  AppTextField,
  AppButton,
  AppCard,
  AppSectionHeader,
  Caption,
  Body,
} from "@/components/ui";
import { useAppTheme, spacing } from "@/theme";
import {
  useFacilityDetails,
  useAvailability,
  FacilitiesHeader,
  BookingSummary,
  createFacilityBooking,
} from "@/features/facilities";
import { FileText, ShieldAlert, CheckCircle2 } from "lucide-react-native";

export default function BookFacilityScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const { facilityId } = useLocalSearchParams<{ facilityId: string }>();

  const { facility } = useFacilityDetails(facilityId);
  const { selectedDate, selectedSlot } = useAvailability(facilityId);

  const [purpose, setPurpose] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    // TODO: Replace dummy booking creation with POST /api/v1/facilities/:id/bookings API call
    await createFacilityBooking(facilityId ?? "fac_001", {
      date: selectedDate,
      timeSlot: selectedSlot?.time ?? "07:00 AM - 08:00 AM",
      purpose,
      notes,
    });
    setIsSubmitting(false);

    router.push(`/(app)/(tabs)/(facilities)/${facilityId}/confirmation` as any);
  };

  return (
    <AppScreen scrollable={true} statusBarStyle="auto">
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <FacilitiesHeader
        title="Book Facility"
        showBack={true}
        onBackPress={() => router.back()}
      />

      {/* ─── Booking Order Summary ───────────────────────────────────────── */}
      {facility && (
        <BookingSummary
          facility={facility}
          date={selectedDate}
          slot={selectedSlot}
        />
      )}

      {/* ─── Purpose & Notes Input Form ─────────────────────────────────── */}
      <AppSectionHeader title="Booking Purpose & Details" />
      <AppCard variant="outlined" style={styles.cardSection}>
        <AppTextField
          label="Purpose of Reservation"
          value={purpose}
          onChangeText={setPurpose}
          placeholder="e.g. Personal Training, Family Event"
          leftIcon={FileText}
        />
        <AppTextField
          label="Special Requests / Notes (Optional)"
          value={notes}
          onChangeText={setNotes}
          placeholder="e.g. Additional seating request, guest count"
          multiline={true}
        />
      </AppCard>

      {/* ─── Booking Rules Disclaimer ───────────────────────────────────── */}
      <AppSectionHeader title="Terms & Cancellation Policy" />
      <AppCard variant="outlined" style={styles.rulesNotice}>
        <ShieldAlert size={18} color={theme.colors.primary} />
        <Body style={{ color: theme.colors.onSurfaceVariant, flex: 1, fontSize: 13 }}>
          Free cancellation is available up to 2 hours before your scheduled time slot. Please adhere to society amenity guidelines.
        </Body>
      </AppCard>

      {/* ─── Confirm Booking Action Button ──────────────────────────────── */}
      <View style={styles.submitContainer}>
        <AppButton
          label="Confirm & Reserve Facility"
          variant="filled"
          size="lg"
          loading={isSubmitting}
          leftIcon={CheckCircle2}
          onPress={handleConfirmBooking}
          fullWidth
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  cardSection: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  rulesNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  submitContainer: {
    marginVertical: spacing.lg,
  },
});
