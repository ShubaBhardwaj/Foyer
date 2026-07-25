import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Body, Caption } from "@/components/ui";
import { useAppTheme, spacing, radius } from "@/theme";
import { TimeSlotItem } from "../../shared/types/facility.types";

interface TimeSlotProps {
  slot: TimeSlotItem;
  isSelected: boolean;
  onSelect: (slotId: string) => void;
}

export const TimeSlot = React.memo(function TimeSlot({
  slot,
  isSelected,
  onSelect,
}: TimeSlotProps) {
  const theme = useAppTheme();

  const isBooked = Boolean(slot.isBooked);
  const isDisabled = Boolean(slot.isDisabled);
  const isAvailable = !isBooked && !isDisabled;

  let bg = theme.colors.surface;
  let borderColor = theme.colors.outline;
  let textColor = theme.colors.onSurface;
  let statusText = "Available";

  if (isSelected) {
    bg = theme.colors.primaryContainer;
    borderColor = theme.colors.primary;
    textColor = theme.colors.onPrimaryContainer;
    statusText = "Selected";
  } else if (isBooked) {
    bg = theme.colors.surfaceVariant ?? "#F5F0E8";
    borderColor = theme.colors.outline;
    textColor = theme.colors.outline;
    statusText = "Booked";
  } else if (isDisabled) {
    bg = theme.colors.surfaceVariant ?? "#F5F0E8";
    borderColor = "transparent";
    textColor = theme.colors.outline;
    statusText = "Closed";
  }

  return (
    <Pressable
      onPress={() => (isAvailable ? onSelect(slot.id) : undefined)}
      disabled={!isAvailable}
      style={[
        styles.slotBox,
        {
          backgroundColor: bg,
          borderColor,
          opacity: isDisabled ? 0.5 : 1,
        },
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected, disabled: !isAvailable }}
      accessibilityLabel={`Slot ${slot.time}: ${statusText}`}
    >
      <Body style={{ color: textColor, fontWeight: isSelected ? "700" : "500", fontSize: 13 }}>
        {slot.time}
      </Body>
      <Caption style={{ color: textColor, fontSize: 11, marginTop: 2 }}>
        {statusText}
      </Caption>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  slotBox: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
});
