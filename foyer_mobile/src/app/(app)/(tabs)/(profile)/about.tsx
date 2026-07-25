import React from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { AppScreen } from "@/components/ui";
import { spacing } from "@/theme";
import {
  useSettings,
  ProfileSection,
  ProfileMenuItem,
  AboutCard,
} from "@/features/profile";
import { ShieldCheck, FileText, Heart } from "lucide-react-native";

export default function AboutScreen() {
  const router = useRouter();
  const { settings } = useSettings();

  return (
    <AppScreen scrollable={true} statusBarStyle="auto">
      {/* ─── About Card Branding ───────────────────────────────────────── */}
      <AboutCard settings={settings} />

      {/* ─── Legal & Acknowledgements ──────────────────────────────────── */}
      <ProfileSection title="Legal & Compliance">
        <ProfileMenuItem
          title="Privacy Policy"
          subtitle="Data collection and resident privacy rights"
          icon={ShieldCheck}
          onPress={() => {}}
        />
        <ProfileMenuItem
          title="Terms of Service"
          subtitle="Society management software usage terms"
          icon={FileText}
          onPress={() => {}}
        />
        <ProfileMenuItem
          title="Open Source Acknowledgements"
          subtitle="Third-party software components"
          icon={Heart}
          divider={false}
          onPress={() => {}}
        />
      </ProfileSection>
    </AppScreen>
  );
}

const styles = StyleSheet.create({});
