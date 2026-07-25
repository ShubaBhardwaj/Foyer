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
import { VisitorHeader } from "@/features/visitors";
import {
  User,
  Phone,
  FileText,
  Car,
  Calendar,
  Clock,
  Building2,
  Home,
  ShieldCheck,
} from "lucide-react-native";

export default function AddPreApprovedGuestScreen() {
  const theme = useAppTheme();
  const router = useRouter();

  const [guestName, setGuestName] = useState("");
  const [phone, setPhone] = useState("");
  const [purpose, setPurpose] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [resident, setResident] = useState("Shubham Bhardwaj");
  const [tower, setTower] = useState("Tower A");
  const [flat, setFlat] = useState("Flat 504");
  const [validDate, setValidDate] = useState("25 Jul - 27 Jul 2026");
  const [validTime, setValidTime] = useState("Full Day Access");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // TODO: Replace dummy guest pass creation with POST /api/v1/guests/pre-approved API call
    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsSubmitting(false);

    router.back();
  };

  return (
    <AppScreen scrollable={true} statusBarStyle="auto">
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <VisitorHeader
        title="Pre Approve Guest"
        showBack={true}
        onBackPress={() => router.back()}
      />

      {/* ─── Guest Info ──────────────────────────────────────────────────── */}
      <AppSectionHeader title="Guest Information" />
      <AppCard variant="outlined" style={styles.cardSection}>
        <AppTextField
          label="Guest Full Name"
          value={guestName}
          onChangeText={setGuestName}
          placeholder="e.g. Kavita Rao"
          leftIcon={User}
        />
        <AppTextField
          label="Phone Number"
          value={phone}
          onChangeText={setPhone}
          placeholder="+91 98123 45678"
          keyboardType="phone-pad"
          leftIcon={Phone}
        />
        <AppTextField
          label="Purpose of Visit"
          value={purpose}
          onChangeText={setPurpose}
          placeholder="e.g. Weekend Guest, Tutor"
          leftIcon={FileText}
        />
        <AppTextField
          label="Vehicle Number (Optional)"
          value={vehicle}
          onChangeText={setVehicle}
          placeholder="e.g. MH 12 QR 1111"
          leftIcon={Car}
        />
      </AppCard>

      {/* ─── Validity Period ────────────────────────────────────────────── */}
      <AppSectionHeader title="Access Validity" />
      <AppCard variant="outlined" style={styles.cardSection}>
        <AppTextField
          label="Valid Date Range"
          value={validDate}
          onChangeText={setValidDate}
          leftIcon={Calendar}
        />
        <AppTextField
          label="Valid Time Window"
          value={validTime}
          onChangeText={setValidTime}
          leftIcon={Clock}
        />
      </AppCard>

      {/* ─── Resident Destination ────────────────────────────────────────── */}
      <AppSectionHeader title="Host Resident" />
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
      </AppCard>

      {/* ─── Submit Action Button ──────────────────────────────────────── */}
      <View style={styles.submitContainer}>
        <AppButton
          label="Generate Guest Pass"
          variant="filled"
          size="lg"
          loading={isSubmitting}
          leftIcon={ShieldCheck}
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
