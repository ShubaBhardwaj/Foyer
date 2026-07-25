import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import {
  AppScreen,
  AppTextField,
  AppButton,
  AppCard,
  AppSectionHeader,
  AppAvatar,
} from "@/components/ui";
import { useAppTheme, spacing } from "@/theme";
import { useProfile, ProfileHeader } from "@/features/profile";
import { User, Phone, Mail, Briefcase, FileText, Save, Camera } from "lucide-react-native";

export default function EditProfileScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const { profile, handleUpdateProfile } = useProfile();

  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [email, setEmail] = useState(profile.email);
  const [occupation, setOccupation] = useState(profile.occupation);
  const [bio, setBio] = useState(profile.bio ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    setIsSubmitting(true);
    // TODO: Replace dummy update with PATCH /api/v1/profile API call
    handleUpdateProfile({
      name,
      phone,
      email,
      occupation,
      bio,
    });
    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsSubmitting(false);

    router.back();
  };

  return (
    <AppScreen scrollable={true} statusBarStyle="auto">
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <ProfileHeader
        profile={profile}
        onEditPress={() => {}}
      />

      {/* ─── Personal Details Form ─────────────────────────────────────── */}
      <AppSectionHeader title="Personal Details" />
      <AppCard variant="outlined" style={styles.cardSection}>
        <AppTextField
          label="Full Name"
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
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          leftIcon={Mail}
        />
        <AppTextField
          label="Occupation / Profession"
          value={occupation}
          onChangeText={setOccupation}
          leftIcon={Briefcase}
        />
        <AppTextField
          label="Resident Bio / Notes"
          value={bio}
          onChangeText={setBio}
          placeholder="Brief description for society members..."
          multiline={true}
          leftIcon={FileText}
        />
      </AppCard>

      {/* ─── Save Action Button ────────────────────────────────────────── */}
      <View style={styles.submitContainer}>
        <AppButton
          label="Save Profile Changes"
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
