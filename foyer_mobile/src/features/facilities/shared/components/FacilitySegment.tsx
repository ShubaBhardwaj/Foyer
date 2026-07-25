import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Label } from "@/components/ui";
import { useAppTheme, spacing, radius } from "@/theme";

interface FacilitySegmentProps {
  selectedIndex: number; // 0 = Facilities, 1 = My Bookings
  onSegmentChange: (index: number) => void;
}

export const FacilitySegment = React.memo(function FacilitySegment({
  selectedIndex,
  onSegmentChange,
}: FacilitySegmentProps) {
  const theme = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.surfaceVariant ?? "#F5F0E8" },
      ]}
    >
      <Pressable
        onPress={() => onSegmentChange(0)}
        style={[
          styles.segmentBtn,
          selectedIndex === 0 && {
            backgroundColor: theme.colors.surface,
            elevation: 2,
          },
        ]}
        accessibilityRole="tab"
        accessibilityState={{ selected: selectedIndex === 0 }}
      >
        <Label
          style={{
            color:
              selectedIndex === 0
                ? theme.colors.primary
                : theme.colors.onSurfaceVariant,
            fontWeight: selectedIndex === 0 ? "700" : "500",
          }}
        >
          Explore Facilities
        </Label>
      </Pressable>

      <Pressable
        onPress={() => onSegmentChange(1)}
        style={[
          styles.segmentBtn,
          selectedIndex === 1 && {
            backgroundColor: theme.colors.surface,
            elevation: 2,
          },
        ]}
        accessibilityRole="tab"
        accessibilityState={{ selected: selectedIndex === 1 }}
      >
        <Label
          style={{
            color:
              selectedIndex === 1
                ? theme.colors.primary
                : theme.colors.onSurfaceVariant,
            fontWeight: selectedIndex === 1 ? "700" : "500",
          }}
        >
          My Bookings
        </Label>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: radius.full,
    padding: 4,
    marginVertical: spacing.sm,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
  },
});
