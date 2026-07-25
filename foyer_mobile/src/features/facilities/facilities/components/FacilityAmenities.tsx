import React from "react";
import { View, StyleSheet } from "react-native";
import { AppSectionHeader, AppCard, Body } from "@/components/ui";
import { useAppTheme, spacing, radius } from "@/theme";
import { CheckCircle2 } from "lucide-react-native";

interface FacilityAmenitiesProps {
  amenities: string[];
}

export const FacilityAmenities = React.memo(function FacilityAmenities({
  amenities,
}: FacilityAmenitiesProps) {
  const theme = useAppTheme();

  return (
    <View style={styles.container}>
      <AppSectionHeader title="Key Amenities & Features" />
      <AppCard variant="outlined" style={styles.card}>
        <View style={styles.grid}>
          {amenities.map((item) => (
            <View key={item} style={styles.amenityRow}>
              <CheckCircle2 size={16} color={theme.colors.primary} />
              <Body style={{ color: theme.colors.onSurface }}>{item}</Body>
            </View>
          ))}
        </View>
      </AppCard>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
  },
  card: {
    padding: spacing.md,
  },
  grid: {
    gap: spacing.sm,
  },
  amenityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
});
