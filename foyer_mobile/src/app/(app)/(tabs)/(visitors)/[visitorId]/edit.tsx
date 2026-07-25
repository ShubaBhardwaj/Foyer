import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  AppScreen,
  AppTextField,
  AppButton,
  AppCard,
  AppSectionHeader,
} from "@/components/ui";
import { useAppTheme, spacing } from "@/theme";
import {
  useVisitorDetails,
  VisitorHeader,
} from "@/features/visitors";
import {
  User,
  Phone,
  FileText,
  Car,
  Calendar,
  Clock,
  Building2,
  Home,
  Save,
} from "lucide-react-native";

export default function EditVisitorScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const { visitorId } = useLocalSearchParams<{ visitorId: string }>();

  const { detail } = useVisitorDetails(visitorId);

  // Pre-fill form state from detail record
  const [name, setName] = useState(detail?.name ?? "John Doe");
  const [phone, setPhone] = useState(detail?.phone ?? "+91 98765 43210");
  const [purpose, setPurpose] = useState(
    detail?.purpose ?? "Plumbing Repair & Inspection"
  );
  const [vehicleNumber, setVehicleNumber] = useState(
    detail?.vehicleNumber ?? "MH 12 AB 3456"
  );
  const [expectedDate, setExpectedDate] = useState(
    detail?.expectedDate ?? "25 Jul 2026"
  );
  const [expectedTime, setExpectedTime] = useState(
    detail?.expectedTime ?? "02:30 PM"
  );
  const [resident, setResident] = useState(
    detail?.resident?.name ?? "Suresh Gupta"
  );
  const [tower, setTower] = useState(detail?.resident?.tower ?? "Tower A");
  const [flat, setFlat] = useState(detail?.resident?.flat ?? "Flat 302");
  const [notes, setNotes] = useState(detail?.notes ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    setIsSubmitting(true);
    // TODO: Replace dummy save with PATCH /api/v1/visitors/:visitorId API call
    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsSubmitting(false);

    router.back();
  };

  return (
    <AppScreen scrollable={true} statusBarStyle="auto">
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <VisitorHeader
        title="Edit Visitor"
        showBack={true}
        onBackPress={() => router.back()}
      />

      {/* ─── Visitor Details Section ───────────────────────────────────── */}
      <AppSectionHeader title="Visitor Information" />
      <AppCard variant="outlined" style={styles.cardSection}>
        <AppTextField
          label="Visitor Full Name"
          value={name}
          onChangeText={setName}
          leftIcon={User}
        />
        <AppTextField
          label="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          leftIcon={Phone}
        />
        <AppTextField
          label="Purpose of Visit"
          value={purpose}
          onChangeText={setPurpose}
          leftIcon={FileText}
        />
        <AppTextField
          label="Vehicle Number"
          value={vehicleNumber}
          onChangeText={setVehicleNumber}
          leftIcon={Car}
        />
      </AppCard>

      {/* ─── Arrival Schedule Section ──────────────────────────────────── */}
      <AppSectionHeader title="Expected Arrival" />
      <AppCard variant="outlined" style={styles.cardSection}>
        <AppTextField
          label="Expected Date"
          value={expectedDate}
          onChangeText={setExpectedDate}
          leftIcon={Calendar}
        />
        <AppTextField
          label="Expected Time"
          value={expectedTime}
          onChangeText={setExpectedTime}
          leftIcon={Clock}
        />
      </AppCard>

      {/* ─── Host Resident Destination ─────────────────────────────────── */}
      <AppSectionHeader title="Destination Resident" />
      <AppCard variant="outlined" style={styles.cardSection}>
        <AppTextField
          label="Host Resident Name"
          value={resident}
          onChangeText={setResident}
          leftIcon={User}
        />
        <AppTextField
          label="Tower / Wing"
          value={tower}
          onChangeText={setTower}
          leftIcon={Building2}
        />
        <AppTextField
          label="Flat / Apartment Number"
          value={flat}
          onChangeText={setFlat}
          leftIcon={Home}
        />
        <AppTextField
          label="Additional Security Notes"
          value={notes}
          onChangeText={setNotes}
          multiline={true}
        />
      </AppCard>

      {/* ─── Save Action Button ────────────────────────────────────────── */}
      <View style={styles.submitContainer}>
        <AppButton
          label="Save Changes"
          variant="filled"
          size="lg"
          loading={isSubmitting}
          leftIcon={Save}
          onPress={handleSave}
          fullWidth
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  cardSection: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  submitContainer: {
    marginVertical: spacing.lg,
  },
});
