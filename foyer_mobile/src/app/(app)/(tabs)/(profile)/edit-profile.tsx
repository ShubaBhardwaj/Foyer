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
import { spacing } from "@/theme";
import { useProfile, ProfileHeader } from "@/features/profile";
import { User, Phone, Save } from "lucide-react-native";

export default function EditProfileScreen() {
  const router = useRouter();
  const { profile, handleUpdateProfile } = useProfile();

  const [name, setName] = useState(profile?.name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await handleUpdateProfile({
        name,
        phone,
      });
      router.back();
    } catch (err) {
      console.warn("Failed to update profile:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!profile) return null;

  return (
    <AppScreen scrollable={true} statusBarStyle="auto">
      <ProfileHeader profile={profile} onEditPress={() => {}} />

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
      </AppCard>

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
