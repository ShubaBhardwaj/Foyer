import React from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import {
  AppScreen,
  AppButton,
  AppSectionHeader,
  AppCard,
  Subtitle,
  Body,
  Caption,
  AppDivider,
} from "@/components/ui";
import { useAppTheme, spacing } from "@/theme";
import {
  useProfile,
  ProfileHeader,
  ProfileSection,
  ProfileMenuItem,
  QuickActionCard,
  logoutUser,
} from "@/features/profile";
import {
  User,
  Bell,
  Lock,
  Eye,
  Building2,
  Home,
  Car,
  CreditCard,
  Moon,
  Globe,
  Settings,
  HelpCircle,
  PhoneCall,
  FileText,
  Info,
  LogOut,
} from "lucide-react-native";

export default function ProfileHomeScreen() {
  const theme = useAppTheme();
  const router = useRouter();

  const { profile } = useProfile();

  const handleLogout = async () => {
    // TODO: Replace dummy logout with Clerk signOut() or auth logout
    await logoutUser();
    // router.replace("/(auth)/login");
  };

  return (
    <AppScreen scrollable={true} statusBarStyle="auto">
      {/* ─── 1. Header Profile ─────────────────────────────────────────── */}
      <ProfileHeader
        profile={profile}
        onEditPress={() => router.push("/(app)/(tabs)/(profile)/edit-profile" as any)}
      />

      {/* ─── 2. Quick Action Cards ─────────────────────────────────────── */}
      <AppSectionHeader title="Quick Management" />
      <QuickActionCard
        onVehiclesPress={() => router.push("/(app)/(tabs)/(profile)/vehicles" as any)}
        onHouseholdPress={() => router.push("/(app)/(tabs)/(profile)/household" as any)}
        onEmergencyPress={() => router.push("/(app)/(tabs)/(profile)/emergency-contacts" as any)}
        onDocumentsPress={() => router.push("/(app)/(tabs)/(profile)/documents" as any)}
      />

      {/* ─── 3. Account Section ────────────────────────────────────────── */}
      <ProfileSection title="Account & Security">
        <ProfileMenuItem
          title="Personal Information"
          subtitle="Name, Phone, Email & Occupation"
          icon={User}
          onPress={() => router.push("/(app)/(tabs)/(profile)/edit-profile" as any)}
        />
        <ProfileMenuItem
          title="Notification Settings"
          subtitle="Alerts, Visitor, Booking & Event Preferences"
          icon={Bell}
          onPress={() => router.push("/(app)/(tabs)/(profile)/notifications" as any)}
        />
        <ProfileMenuItem
          title="Security & Password"
          subtitle="Biometrics, 2FA & Active Sessions"
          icon={Lock}
          onPress={() => router.push("/(app)/(tabs)/(profile)/security" as any)}
        />
      </ProfileSection>

      {/* ─── 4. Society Section ────────────────────────────────────────── */}
      <ProfileSection title="Society & Apartment Details">
        <ProfileMenuItem
          title="Society Details"
          subtitle={profile.societyName}
          icon={Building2}
          onPress={() => {}}
        />
        <ProfileMenuItem
          title="Apartment & Unit Details"
          subtitle={`${profile.tower} • ${profile.flat}`}
          icon={Home}
          onPress={() => router.push("/(app)/(tabs)/(profile)/household" as any)}
        />
        <ProfileMenuItem
          title="Parking Allocation"
          subtitle="Basement 1 • Slot B-12 & EV-04"
          icon={Car}
          onPress={() => router.push("/(app)/(tabs)/(profile)/vehicles" as any)}
        />
        <ProfileMenuItem
          title="Maintenance Ledger"
          subtitle="Dues & Payment Receipts"
          icon={CreditCard}
          divider={false}
          onPress={() => {}}
        />
      </ProfileSection>

      {/* ─── 5. Preferences Section ────────────────────────────────────── */}
      <ProfileSection title="Preferences & App Settings">
        <ProfileMenuItem
          title="Application Settings"
          subtitle="Dark Mode, Languages & Cache"
          icon={Settings}
          onPress={() => router.push("/(app)/(tabs)/(profile)/settings" as any)}
        />
      </ProfileSection>

      {/* ─── 6. Support & Legal Section ────────────────────────────────── */}
      <ProfileSection title="Support & Legal">
        <ProfileMenuItem
          title="Help Center & Support"
          subtitle="FAQs, Society Contact & Kiosk Guide"
          icon={HelpCircle}
          onPress={() => {}}
        />
        <ProfileMenuItem
          title="Emergency Help Line"
          subtitle="Security Control Desk & Police"
          icon={PhoneCall}
          onPress={() => router.push("/(app)/(tabs)/(profile)/emergency-contacts" as any)}
        />
        <ProfileMenuItem
          title="About Foyer Application"
          subtitle="Version v1.4.0, Build & Licenses"
          icon={Info}
          divider={false}
          onPress={() => router.push("/(app)/(tabs)/(profile)/about" as any)}
        />
      </ProfileSection>

      {/* ─── 7. Logout Danger Button ────────────────────────────────────── */}
      <View style={styles.logoutWrapper}>
        <AppButton
          label="Log Out of Foyer"
          variant="danger"
          size="lg"
          leftIcon={LogOut}
          onPress={handleLogout}
          fullWidth
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  logoutWrapper: {
    marginVertical: spacing.xl,
  },
});
