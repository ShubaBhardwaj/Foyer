import React from "react";
import { View, StyleSheet } from "react-native";
import { AppSectionHeader } from "@/components/ui";
import { spacing } from "@/theme";
import { TimeSlot } from "./TimeSlot";
import { TimeSlotItem } from "../../shared/types/facility.types";

interface AvailabilityGridProps {
  slots: TimeSlotItem[];
  selectedSlotId: string | null;
  onSelectSlot: (slotId: string) => void;
}

export const AvailabilityGrid = React.memo(function AvailabilityGrid({
  slots,
  selectedSlotId,
  onSelectSlot,
}: AvailabilityGridProps) {
  const morningSlots = slots.filter((s) => s.period === "Morning");
  const afternoonSlots = slots.filter((s) => s.period === "Afternoon");
  const eveningSlots = slots.filter((s) => s.period === "Evening");

  return (
    <View style={styles.container}>
      {morningSlots.length > 0 && (
        <>
          <AppSectionHeader title="Morning Slots (06:00 AM - 12:00 PM)" />
          <View style={styles.grid}>
            {morningSlots.map((s) => (
              <View key={s.id} style={styles.col}>
                <TimeSlot
                  slot={s}
                  isSelected={selectedSlotId === s.id}
                  onSelect={onSelectSlot}
                />
              </View>
            ))}
          </View>
        </>
      )}

      {afternoonSlots.length > 0 && (
        <>
          <AppSectionHeader title="Afternoon Slots (12:00 PM - 05:00 PM)" />
          <View style={styles.grid}>
            {afternoonSlots.map((s) => (
              <View key={s.id} style={styles.col}>
                <TimeSlot
                  slot={s}
                  isSelected={selectedSlotId === s.id}
                  onSelect={onSelectSlot}
                />
              </View>
            ))}
          </View>
        </>
      )}

      {eveningSlots.length > 0 && (
        <>
          <AppSectionHeader title="Evening Slots (05:00 PM - 10:00 PM)" />
          <View style={styles.grid}>
            {eveningSlots.map((s) => (
              <View key={s.id} style={styles.col}>
                <TimeSlot
                  slot={s}
                  isSelected={selectedSlotId === s.id}
                  onSelect={onSelectSlot}
                />
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  col: {
    width: "48.5%",
  },
});
