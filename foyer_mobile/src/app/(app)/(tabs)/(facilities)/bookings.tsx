import React from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { AppScreen, AppChip, AppCard } from "@/components/ui";
import { spacing } from "@/theme";
import {
  useBookings,
  FacilitiesHeader,
  FacilitySegment,
  BookingCard,
  FacilitiesEmptyState,
  BookingStatus,
} from "@/features/facilities";
import { History } from "lucide-react-native";

export default function MyBookingsScreen() {
  const router = useRouter();
  const {
    bookings,
    selectedFilter,
    setSelectedFilter,
    isLoading,
    handleCancelBooking,
  } = useBookings();

  const filterOptions: ("All" | BookingStatus)[] = [
    "All",
    "Upcoming",
    "Active",
    "Completed",
    "Cancelled",
  ];

  return (
    <AppScreen scrollable={true} statusBarStyle="auto">
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <FacilitiesHeader
        title="My Bookings"
        showBack={true}
        onBackPress={() => router.back()}
        rightActionIcon={History}
        onRightActionPress={() => router.push("/(app)/(tabs)/(facilities)/booking-history" as any)}
      />

      {/* ─── Segment Switcher ────────────────────────────────────────────── */}
      <FacilitySegment
        selectedIndex={1}
        onSegmentChange={(index) => {
          if (index === 0) router.push("/(app)/(tabs)/(facilities)" as any);
        }}
      />

      {/* ─── Filter Chips ────────────────────────────────────────────────── */}
      <View style={styles.chipsRow}>
        {filterOptions.map((opt) => (
          <AppChip
            key={opt}
            label={opt}
            selected={selectedFilter === opt}
            onPress={() => setSelectedFilter(opt)}
          />
        ))}
      </View>

      {/* ─── Bookings List / Empty State ────────────────────────────────── */}
      {bookings.length === 0 ? (
        <FacilitiesEmptyState
          type="bookings"
          onActionPress={() => router.push("/(app)/(tabs)/(facilities)" as any)}
        />
      ) : (
        <View style={styles.listContainer}>
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onPress={() => router.push(`/(app)/(tabs)/(facilities)/${booking.facilityId}` as any)}
              onCancel={handleCancelBooking}
            />
          ))}
        </View>
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  chipsRow: {
    flexDirection: "row",
    gap: spacing.xs,
    marginVertical: spacing.xs,
  },
  listContainer: {
    marginVertical: spacing.sm,
    gap: spacing.xs,
  },
});
