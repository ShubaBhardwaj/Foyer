import React from "react";
import { View, StyleSheet } from "react-native";
import { AppCard, Title, Subtitle, Body, Caption, AppStatusPill } from "@/components/ui";
import { useAppTheme, spacing, radius } from "@/theme";
import { CheckCircle2, ShieldCheck, QrCode } from "lucide-react-native";
import { BookingItem } from "../../shared/types/facility.types";

interface BookingConfirmationCardProps {
  booking: Partial<BookingItem>;
}

export const BookingConfirmationCard = React.memo(function BookingConfirmationCard({
  booking,
}: BookingConfirmationCardProps) {
  const theme = useAppTheme();

  return (
    <AppCard variant="elevated" style={styles.card}>
      <View style={[styles.successIconCircle, { backgroundColor: theme.colors.secondaryContainer }]}>
        <CheckCircle2 size={48} color={theme.colors.primary} />
      </View>

      <Title center style={{ color: theme.colors.onSurface, marginTop: spacing.md, fontSize: 22 }}>
        Booking Confirmed!
      </Title>
      <Body center style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}>
        Your facility reservation has been registered successfully.
      </Body>

      <View style={styles.badgeRow}>
        <AppStatusPill status="approved" label="Reservation Approved" />
      </View>

      <View style={[styles.passBox, { backgroundColor: theme.colors.surfaceVariant ?? "#F5F0E8" }]}>
        <ShieldCheck size={20} color={theme.colors.primary} />
        <Caption style={{ color: theme.colors.onSurface, fontWeight: "700", fontSize: 14 }}>
          PASS ID: {booking.bookingCode ?? "BK-FYR-8821"}
        </Caption>
      </View>

      <View style={styles.detailsBlock}>
        <Caption style={{ color: theme.colors.outline }}>Facility Name</Caption>
        <Subtitle style={{ color: theme.colors.onSurface }}>{booking.facilityName ?? "Olympic Swimming Pool"}</Subtitle>

        <Caption style={{ color: theme.colors.outline, marginTop: spacing.xs }}>Scheduled Date & Time</Caption>
        <Body style={{ color: theme.colors.onSurface, fontWeight: "600" }}>
          {booking.date ?? "Tomorrow, 26 Jul 2026"} • {booking.timeSlot ?? "07:00 AM - 08:00 AM"}
        </Body>
      </View>

      <View style={styles.rulesNotice}>
        <Caption style={{ color: theme.colors.onSurfaceVariant, textAlign: "center" }}>
          Please arrive 5 minutes prior to your booked slot and present your digital pass code at the amenity entry kiosk.
        </Caption>
      </View>
    </AppCard>
  );
});

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    padding: spacing.xl,
    marginVertical: spacing.md,
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeRow: {
    marginVertical: spacing.sm,
  },
  passBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    marginVertical: spacing.sm,
  },
  detailsBlock: {
    alignItems: "center",
    marginVertical: spacing.sm,
  },
  rulesNotice: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.sm,
  },
});
