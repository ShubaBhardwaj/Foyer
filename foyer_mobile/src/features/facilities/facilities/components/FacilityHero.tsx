import React from "react";
import { View, StyleSheet } from "react-native";
import { Title, Body, Caption, AppStatusPill } from "@/components/ui";
import { useAppTheme, spacing, radius } from "@/theme";
import { Clock, Users, Timer, ShieldAlert, Image as ImageIcon } from "lucide-react-native";
import { FacilityItem } from "../../shared/types/facility.types";

interface FacilityHeroProps {
  facility: FacilityItem;
}

export const FacilityHero = React.memo(function FacilityHero({
  facility,
}: FacilityHeroProps) {
  const theme = useAppTheme();

  return (
    <View style={styles.container}>
      {/* 1. Large Hero Image Banner */}
      <View style={[styles.heroBanner, { backgroundColor: theme.colors.primaryContainer }]}>
        <ImageIcon size={48} color={theme.colors.onPrimaryContainer} />
        <Caption style={{ color: theme.colors.onPrimaryContainer, marginTop: spacing.xs }}>
          High Resolution Facility Image Banner
        </Caption>
      </View>

      {/* 2. Title & Status Header */}
      <View style={styles.headerRow}>
        <Title style={{ color: theme.colors.onSurface, flex: 1, fontSize: 22 }}>
          {facility.name}
        </Title>
        <AppStatusPill
          status={getFacilityPillStatus(facility.status)}
          label={facility.status}
        />
      </View>

      <Body style={{ color: theme.colors.onSurfaceVariant, marginTop: spacing.xs, lineHeight: 22 }}>
        {facility.description}
      </Body>

      {/* 3. Quick Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Clock size={18} color={theme.colors.primary} />
          <Caption style={{ color: theme.colors.outline }}>Hours</Caption>
          <Body style={{ color: theme.colors.onSurface, fontWeight: "600", fontSize: 13 }}>
            {facility.operatingHours}
          </Body>
        </View>

        <View style={styles.statBox}>
          <Users size={18} color={theme.colors.primary} />
          <Caption style={{ color: theme.colors.outline }}>Capacity</Caption>
          <Body style={{ color: theme.colors.onSurface, fontWeight: "600", fontSize: 13 }}>
            {facility.capacity}
          </Body>
        </View>

        <View style={styles.statBox}>
          <Timer size={18} color={theme.colors.primary} />
          <Caption style={{ color: theme.colors.outline }}>Duration</Caption>
          <Body style={{ color: theme.colors.onSurface, fontWeight: "600", fontSize: 13 }}>
            {facility.bookingDuration}
          </Body>
        </View>
      </View>
    </View>
  );
});

function getFacilityPillStatus(status: FacilityItem["status"]) {
  switch (status) {
    case "Available":
      return "approved";
    case "Booked":
      return "pending";
    case "Maintenance":
    default:
      return "rejected";
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  heroBanner: {
    height: 180,
    width: "100%",
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
    padding: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
  },
});
