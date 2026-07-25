import React from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { AppScreen, AppSectionHeader } from "@/components/ui";
import { spacing } from "@/theme";
import {
  useBookingHistory,
  FacilitiesHeader,
  BookingHistoryCard,
  FacilitiesEmptyState,
} from "@/features/facilities";

export default function BookingHistoryScreen() {
  const router = useRouter();
  const { groupedHistory, isLoading } = useBookingHistory();

  return (
    <AppScreen scrollable={true} statusBarStyle="auto">
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <FacilitiesHeader
        title="Booking History"
        showBack={true}
        onBackPress={() => router.back()}
      />

      {/* ─── Grouped Timeline List ───────────────────────────────────────── */}
      {groupedHistory.length === 0 ? (
        <FacilitiesEmptyState type="history" />
      ) : (
        <View style={styles.container}>
          {groupedHistory.map((group) => (
            <View key={group.period} style={styles.groupSection}>
              <AppSectionHeader title={group.period} />
              {group.bookings.map((b) => (
                <BookingHistoryCard
                  key={b.id}
                  booking={b}
                  onPress={() => router.push(`/(app)/(tabs)/(facilities)/${b.facilityId}` as any)}
                />
              ))}
            </View>
          ))}
        </View>
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
  },
  groupSection: {
    marginBottom: spacing.md,
  },
});
