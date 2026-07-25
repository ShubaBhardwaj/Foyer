import React from "react";
import { View, StyleSheet } from "react-native";
import {
  AppCard,
  Subtitle,
  Caption,
  AppStatusPill,
} from "@/components/ui";
import { useAppTheme, spacing, radius } from "@/theme";
import { Clock, Image as ImageIcon, Sparkles } from "lucide-react-native";
import { FacilityItem } from "../../shared/types/facility.types";

interface FacilityCardProps {
  facility: FacilityItem;
  onPress: (facilityId: string) => void;
}

export const FacilityCard = React.memo(function FacilityCard({
  facility,
  onPress,
}: FacilityCardProps) {
  const theme = useAppTheme();

  return (
    <AppCard
      variant="elevated"
      onPress={() => onPress(facility.id)}
      style={styles.card}
      accessibilityLabel={`Facility: ${facility.name}`}
    >
      {/* 1. Large Image Header Placeholder */}
      <View style={[styles.imageHeader, { backgroundColor: theme.colors.primaryContainer }]}>
        <ImageIcon size={32} color={theme.colors.onPrimaryContainer} />
        <View style={[styles.categoryBadge, { backgroundColor: theme.colors.surface }]}>
          <Caption style={{ color: theme.colors.primary, fontWeight: "700" }}>
            {facility.category}
          </Caption>
        </View>
      </View>

      {/* 2. Content Details */}
      <View style={styles.content}>
        <View style={styles.statusRow}>
          <AppStatusPill
            status={getFacilityPillStatus(facility.status)}
            label={facility.status}
          />
        </View>

        <Subtitle
          style={{ color: theme.colors.onSurface, marginTop: spacing.xs, fontSize: 16 }}
          numberOfLines={1}
        >
          {facility.name}
        </Subtitle>

        <View style={styles.infoRow}>
          <Clock size={14} color={theme.colors.onSurfaceVariant} />
          <Caption
            style={{ color: theme.colors.onSurfaceVariant, flex: 1 }}
            numberOfLines={1}
          >
            {facility.operatingHours}
          </Caption>
        </View>

        {facility.nextAvailableSlot && (
          <View style={styles.slotRow}>
            <Sparkles size={12} color={theme.colors.secondary} />
            <Caption style={{ color: theme.colors.secondary, fontWeight: "600" }}>
              {facility.nextAvailableSlot}
            </Caption>
          </View>
        )}
      </View>
    </AppCard>
  );
});

function getFacilityPillStatus(status: FacilityItem["status"]) {
  switch (status) {
    case "Available":
      return "approved"; // Green
    case "Booked":
      return "pending"; // Amber
    case "Maintenance":
    default:
      return "rejected"; // Red
  }
}

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: "hidden",
    marginBottom: spacing.md,
  },
  imageHeader: {
    height: 120,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  categoryBadge: {
    position: "absolute",
    top: spacing.xs,
    left: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  content: {
    padding: spacing.sm,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  slotRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 6,
  },
});
