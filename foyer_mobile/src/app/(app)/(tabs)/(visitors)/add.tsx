import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import {
  AppScreen,
  AppTextField,
  AppButton,
  AppCard,
  AppSectionHeader,
} from "@/components/ui";
import { useAppTheme, spacing } from "@/theme";
import { VisitorHeader, createVisitorRequest } from "@/features/visitors";
import {
  User,
  Phone,
  FileText,
  Car,
  Calendar,
  Clock,
  Building2,
  Home,
  CheckCircle2,
} from "lucide-react-native";

export default function AddVisitorScreen() {
  const theme = useAppTheme();
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [purpose, setPurpose] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [expectedDate, setExpectedDate] = useState("Today, 25 Jul 2026");
  const [expectedTime, setExpectedTime] = useState("03:30 PM");
  const [resident, setResident] = useState("Shubham Bhardwaj");
  const [tower, setTower] = useState("Tower A");
  const [flat, setFlat] = useState("Flat 504");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // TODO: Replace dummy submission with POST /api/v1/visitors API call
    await createVisitorRequest({
      name,
      phone,
      purpose,
      vehicleNumber,
      expectedDate,
      expectedTime,
      notes,
    });
    setIsSubmitting(false);

    // TODO: Navigate to Visitor List or Details Screen
    router.back();
  };

  return (
    <AppScreen scrollable={true} statusBarStyle="auto">
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <VisitorHeader
        title="Add Visitor"
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
          placeholder="e.g. John Doe"
          leftIcon={User}
        />
        <AppTextField
          label="Phone Number"
          value={phone}
          onChangeText={setPhone}
          placeholder="+91 98765 43210"
          keyboardType="phone-pad"
          leftIcon={Phone}
        />
        <AppTextField
          label="Purpose of Visit"
          value={purpose}
          onChangeText={setPurpose}
          placeholder="e.g. Plumbing Service, Guest Visit"
          leftIcon={FileText}
        />
        <AppTextField
          label="Vehicle Number (Optional)"
          value={vehicleNumber}
          onChangeText={setVehicleNumber}
          placeholder="e.g. MH 12 AB 3456"
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
          label="Additional Security Notes (Optional)"
          value={notes}
          onChangeText={setNotes}
          placeholder="e.g. Carrying tools, delivery box"
          multiline={true}
        />
      </AppCard>

      {/* ─── Submit Action Button ──────────────────────────────────────── */}
      <View style={styles.submitContainer}>
        <AppButton
          label="Create Visitor"
          variant="filled"
          size="lg"
          loading={isSubmitting}
          leftIcon={CheckCircle2}
          onPress={handleSubmit}
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
