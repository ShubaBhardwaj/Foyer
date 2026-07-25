import React from "react";
import { View, StyleSheet } from "react-native";
import {
  AppCard,
  Subtitle,
  Body,
  Caption,
  AppStatusPill,
} from "@/components/ui";
import { useAppTheme, spacing, radius } from "@/theme";
import { Car, Zap, Bike } from "lucide-react-native";
import { Vehicle } from "../../shared/types/profile.types";

interface VehicleCardProps {
  vehicle: Vehicle;
  onPress?: (vehicle: Vehicle) => void;
}

export const VehicleCard = React.memo(function VehicleCard({
  vehicle,
  onPress,
}: VehicleCardProps) {
  const theme = useAppTheme();
  const IconComponent = getVehicleIcon(vehicle.type);

  return (
    <AppCard
      variant="elevated"
      onPress={onPress ? () => onPress(vehicle) : undefined}
      style={styles.card}
      accessibilityLabel={`Vehicle ${vehicle.vehicleNumber}`}
    >
      <View style={styles.header}>
        <View style={[styles.typeIcon, { backgroundColor: theme.colors.primaryContainer }]}>
          <IconComponent size={22} color={theme.colors.onPrimaryContainer} />
        </View>

        <View style={styles.textCol}>
          <Subtitle style={{ color: theme.colors.onSurface, fontSize: 16, fontWeight: "700" }}>
            {vehicle.vehicleNumber}
          </Subtitle>
          <Caption style={{ color: theme.colors.onSurfaceVariant }}>
            {vehicle.type} • {vehicle.parkingSlot}
          </Caption>
        </View>

        <AppStatusPill
          status={vehicle.status === "Verified" ? "approved" : "pending"}
          label={vehicle.status}
        />
      </View>
    </AppCard>
  );
});

function getVehicleIcon(type: Vehicle["type"]) {
  switch (type) {
    case "EV":
      return Zap;
    case "Bike":
      return Bike;
    case "Car":
    case "SUV":
    default:
      return Car;
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
  typeIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  textCol: {
    flex: 1,
  },
});
