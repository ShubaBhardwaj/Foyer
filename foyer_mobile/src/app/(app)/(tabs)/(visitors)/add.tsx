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
  CheckCircle2,
} from "lucide-react-native";

export default function AddVisitorScreen() {
  const theme = useAppTheme();
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [purpose, setPurpose] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [expectedDate, setExpectedDate] = useState("Today");
  const [expectedTime, setExpectedTime] = useState("Now");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await createVisitorRequest({
        name,
        phone,
        purpose,
        vehicleNumber,
        expectedDate,
        expectedTime,
      });
      router.back();
    } catch (err) {
      console.warn("Failed to create visitor pass:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppScreen scrollable={true} statusBarStyle="auto">
      <VisitorHeader
        title="Add Visitor"
        showBack={true}
        onBackPress={() => router.back()}
      />

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
