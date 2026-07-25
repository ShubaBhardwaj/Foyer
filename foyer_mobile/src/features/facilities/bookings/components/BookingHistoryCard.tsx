import React from "react";
import { View, StyleSheet } from "react-native";
import { AppCard, Subtitle, Body, Caption, AppStatusPill } from "@/components/ui";
import { useAppTheme, spacing } from "@/theme";
import { Calendar, Clock, Building2 } from "lucide-react-native";
import { BookingItem } from "../../shared/types/facility.types";

interface BookingHistoryCardProps {
  booking: BookingItem;
  onPress?: (bookingId: string) => void;
}

export const BookingHistoryCard = React.memo(function BookingHistoryCard({
  booking,
  onPress,
}: BookingHistoryCardProps) {
  const theme = useAppTheme();

  return (
    <AppCard
      variant="outlined"
      onPress={onPress ? () => onPress(booking.id) : undefined}
      style={styles.card}
    >
      <View style={styles.header}>
        <Subtitle style={{ color: theme.colors.onSurface, flex: 1, fontSize: 15 }}>
          {booking.facilityName}
        </Subtitle>
        <AppStatusPill status={booking.status === "Completed" ? "neutral" : "rejected"} label={booking.status} />
      </View>

      <View style={styles.infoRow}>
        <Calendar size={14} color={theme.colors.onSurfaceVariant} />
        <Caption style={{ color: theme.colors.onSurfaceVariant }}>{booking.date}</Caption>
        <Clock size={14} color={theme.colors.onSurfaceVariant} style={{ marginLeft: spacing.sm }} />
        <Caption style={{ color: theme.colors.onSurfaceVariant }}>{booking.timeSlot}</Caption>
      </View>
    </AppCard>
  );
});

const styles = StyleSheet.create({
  card: {
    marginVertical: spacing.xs,
    padding: spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});
