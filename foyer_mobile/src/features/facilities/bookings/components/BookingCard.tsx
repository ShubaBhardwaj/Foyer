import React from "react";
import { View, StyleSheet } from "react-native";
import {
  AppCard,
  Subtitle,
  Body,
  Caption,
  AppStatusPill,
  AppButton,
} from "@/components/ui";
import { useAppTheme, spacing } from "@/theme";
import { Calendar, Clock, Hash, Image as ImageIcon } from "lucide-react-native";
import { BookingItem, BookingStatus } from "../../shared/types/facility.types";

interface BookingCardProps {
  booking: BookingItem;
  onPress: (bookingId: string) => void;
  onCancel?: (bookingId: string) => void;
}

export const BookingCard = React.memo(function BookingCard({
  booking,
  onPress,
  onCancel,
}: BookingCardProps) {
  const theme = useAppTheme();

  return (
    <AppCard
      variant="elevated"
      onPress={() => onPress(booking.id)}
      style={styles.card}
      accessibilityLabel={`Booking for ${booking.facilityName}`}
    >
      <View style={styles.header}>
        <View style={[styles.thumb, { backgroundColor: theme.colors.primaryContainer }]}>
          <ImageIcon size={22} color={theme.colors.onPrimaryContainer} />
        </View>

        <View style={styles.headerText}>
          <Subtitle style={{ color: theme.colors.onSurface, fontSize: 16 }}>
            {booking.facilityName}
          </Subtitle>
          <Caption style={{ color: theme.colors.outline }}>
            Pass Code: {booking.bookingCode}
          </Caption>
        </View>

        <AppStatusPill
          status={getBookingPillStatus(booking.status)}
          label={booking.status}
        />
      </View>

      <View style={styles.detailsGrid}>
        <View style={styles.detailRow}>
          <Calendar size={16} color={theme.colors.primary} />
          <Body style={{ color: theme.colors.onSurface, fontSize: 13 }}>
            {booking.date}
          </Body>
        </View>

        <View style={styles.detailRow}>
          <Clock size={16} color={theme.colors.primary} />
          <Body style={{ color: theme.colors.onSurface, fontSize: 13 }}>
            {booking.timeSlot}
          </Body>
        </View>

        {booking.purpose && (
          <Caption style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}>
            Purpose: {booking.purpose}
          </Caption>
        )}
      </View>

      {booking.status === "Upcoming" && onCancel && (
        <View style={styles.footer}>
          <AppButton
            label="Cancel Reservation"
            variant="outlined"
            size="sm"
            onPress={() => onCancel(booking.id)}
          />
        </View>
      )}
    </AppCard>
  );
});

function getBookingPillStatus(status: BookingStatus) {
  switch (status) {
    case "Active":
    case "Upcoming":
      return "approved"; // Green
    case "Completed":
      return "neutral";
    case "Cancelled":
    default:
      return "rejected"; // Red
  }
}

const styles = StyleSheet.create({
  card: {
    marginVertical: spacing.xs,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  thumb: {
    width: 44,
    height: 44,
    borderRadius: spacing.xs,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
  },
  detailsGrid: {
    marginVertical: spacing.sm,
    gap: 4,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  footer: {
    alignItems: "flex-end",
    marginTop: spacing.xs,
  },
});
