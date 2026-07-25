import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { AppScreen, AppSectionHeader } from "@/components/ui";
import { spacing } from "@/theme";
import {
  ProfileSection,
  ProfileMenuItem,
  ToggleRow,
} from "@/features/profile";
import { KeyRound, Fingerprint, Smartphone, ShieldCheck, History } from "lucide-react-native";

export default function SecurityScreen() {
  const router = useRouter();
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  return (
    <AppScreen scrollable={true} statusBarStyle="auto">
      {/* ─── Header Section ─────────────────────────────────────────────── */}
      <ProfileSection title="Security & Authentication">
        <ProfileMenuItem
          title="Change Password"
          subtitle="Update account login password"
          icon={KeyRound}
          onPress={() => {}}
        />
        <ToggleRow
          label="Biometric Login (Face ID / Fingerprint)"
          description="Use device biometrics for instant app unlocking"
          value={biometricEnabled}
          onValueChange={setBiometricEnabled}
        />
        <ToggleRow
          label="Two-Factor Authentication (2FA)"
          description="Require SMS/Authenticator code on new sign-ins"
          value={twoFactorEnabled}
          onValueChange={setTwoFactorEnabled}
        />
        <ProfileMenuItem
          title="Registered Devices"
          subtitle="2 Active Mobile Devices"
          icon={Smartphone}
          onPress={() => {}}
        />
        <ProfileMenuItem
          title="Active Sign-In Sessions"
          subtitle="Review active logins & revoke access"
          icon={History}
          divider={false}
          onPress={() => {}}
        />
      </ProfileSection>
    </AppScreen>
  );
}

const styles = StyleSheet.create({});
