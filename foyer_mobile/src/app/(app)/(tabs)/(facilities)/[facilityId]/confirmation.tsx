import React from "react";
import { View, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  AppScreen,
  AppButton,
} from "@/components/ui";
import { spacing } from "@/theme";
import {
  useFacilityDetails,
  FacilitiesHeader,
  BookingConfirmationCard,
} from "@/features/facilities";
import { CalendarCheck, Check } from "lucide-react-native";

export default function BookingConfirmationScreen() {
  const router = useRouter();
  const { facilityId } = useLocalSearchParams<{ facilityId: string }>();

  const { facility } = useFacilityDetails(facilityId);

  return (
    <AppScreen scrollable={true} statusBarStyle="auto">
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <FacilitiesHeader
        title="Confirmation"
        showBack={false}
      />

      {/* ─── Success Confirmation Card ──────────────────────────────────── */}
      <BookingConfirmationCard
        booking={{
          facilityName: facility?.name ?? "Olympic Swimming Pool",
          date: "Tomorrow, 26 Jul 2026",
          timeSlot: "07:00 AM - 08:00 AM",
          bookingCode: "BK-POOL-8821",
        }}
      />

      {/* ─── Action Buttons ────────────────────────────────────────────── */}
      <View style={styles.buttonGroup}>
        <AppButton
          label="View My Bookings"
          variant="filled"
          size="lg"
          leftIcon={CalendarCheck}
          onPress={() => router.push("/(app)/(tabs)/(facilities)/bookings" as any)}
          fullWidth
        />
        <AppButton
          label="Done — Back to Facilities"
          variant="outlined"
          size="lg"
          leftIcon={Check}
          onPress={() => router.push("/(app)/(tabs)/(facilities)" as any)}
          fullWidth
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  buttonGroup: {
    gap: spacing.sm,
    marginVertical: spacing.lg,
  },
});
