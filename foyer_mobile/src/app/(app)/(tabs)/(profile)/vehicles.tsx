import React, { useRef } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import {
  AppScreen,
  AppButton,
  AppSectionHeader,
  AppBottomSheet,
  AppBottomSheetRef,
  Body,
} from "@/components/ui";
import { spacing } from "@/theme";
import {
  useVehicles,
  VehicleCard,
  ProfileEmptyState,
  Vehicle,
} from "@/features/profile";
import { Plus, Trash2, Car } from "lucide-react-native";

export default function VehiclesScreen() {
  const router = useRouter();
  const bottomSheetRef = useRef<AppBottomSheetRef>(null);

  const { vehicles, handleRemoveVehicle } = useVehicles();

  return (
    <AppScreen scrollable={true} statusBarStyle="auto">
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <AppSectionHeader title="Registered Vehicles" />
      <Body style={{ color: "gray", marginBottom: spacing.md }}>
        Manage registered vehicles and assigned parking slots under Tower A • Flat 504.
      </Body>

      {/* ─── Vehicles List / Empty State ───────────────────────────────── */}
      {vehicles.length === 0 ? (
        <ProfileEmptyState
          type="vehicles"
          onActionPress={() => bottomSheetRef.current?.expand()}
        />
      ) : (
        <View style={styles.listContainer}>
          {vehicles.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </View>
      )}

      {/* ─── Floating Action Button ─────────────────────────────────────── */}
      <View style={styles.fabRow}>
        <AppButton
          label="+ Register New Vehicle"
          variant="filled"
          size="md"
          leftIcon={Car}
          onPress={() => bottomSheetRef.current?.expand()}
          fullWidth
        />
      </View>

      {/* ─── Register Vehicle Bottom Sheet ─────────────────────────────── */}
      <AppBottomSheet ref={bottomSheetRef} title="Register Vehicle">
        <View style={styles.sheetContent}>
          <Body style={{ marginBottom: spacing.md }}>
            Vehicle registration requests require Security Gate verification. Please submit vehicle RC copy to society office.
          </Body>
          <AppButton
            label="Close"
            variant="outlined"
            onPress={() => bottomSheetRef.current?.close()}
            fullWidth
          />
        </View>
      </AppBottomSheet>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    marginVertical: spacing.xs,
    gap: spacing.xs,
  },
  fabRow: {
    marginVertical: spacing.md,
  },
  sheetContent: {
    paddingVertical: spacing.md,
  },
});
