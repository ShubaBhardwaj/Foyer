import React from "react";
import { View, StyleSheet } from "react-native";
import { AppCard, Title, Subtitle, Body, Caption, AppDivider } from "@/components/ui";
import { useAppTheme, spacing } from "@/theme";
import { Building2, Calendar, Clock, User, ShieldCheck } from "lucide-react-native";
import { FacilityItem, TimeSlotItem } from "../../shared/types/facility.types";

interface BookingSummaryProps {
  facility: FacilityItem;
  date: string;
  slot?: TimeSlotItem;
}

export const BookingSummary = React.memo(function BookingSummary({
  facility,
  date,
  slot,
}: BookingSummaryProps) {
  const theme = useAppTheme();

  return (
    <AppCard variant="elevated" style={styles.card}>
      <Title style={{ color: theme.colors.onSurface, fontSize: 18 }}>
        Booking Order Summary
      </Title>

      <AppDivider style={{ marginVertical: spacing.md }} />

      <View style={styles.detailsGrid}>
        <View style={styles.row}>
          <Building2 size={18} color={theme.colors.primary} />
          <View style={styles.textCol}>
            <Caption style={{ color: theme.colors.outline }}>Facility</Caption>
            <Body style={{ color: theme.colors.onSurface, fontWeight: "600" }}>
              {facility.name} ({facility.category})
            </Body>
          </View>
        </View>

        <View style={styles.row}>
          <Calendar size={18} color={theme.colors.primary} />
          <View style={styles.textCol}>
            <Caption style={{ color: theme.colors.outline }}>Selected Date</Caption>
            <Body style={{ color: theme.colors.onSurface, fontWeight: "600" }}>
              {date}
            </Body>
          </View>
        </View>

        <View style={styles.row}>
          <Clock size={18} color={theme.colors.primary} />
          <View style={styles.textCol}>
            <Caption style={{ color: theme.colors.outline }}>Selected Time Slot</Caption>
            <Body style={{ color: theme.colors.onSurface, fontWeight: "600" }}>
              {slot ? slot.time : "07:00 AM - 08:00 AM"} ({facility.bookingDuration})
            </Body>
          </View>
        </View>

        <View style={styles.row}>
          <User size={18} color={theme.colors.primary} />
          <View style={styles.textCol}>
            <Caption style={{ color: theme.colors.outline }}>Host Resident</Caption>
            <Body style={{ color: theme.colors.onSurface, fontWeight: "600" }}>
              Shubham Bhardwaj (Tower A • Flat 504)
            </Body>
          </View>
        </View>
      </View>
    </AppCard>
  );
});

const styles = StyleSheet.create({
  card: {
    marginVertical: spacing.sm,
  },
  detailsGrid: {
    gap: spacing.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  textCol: {
    flex: 1,
  },
});
