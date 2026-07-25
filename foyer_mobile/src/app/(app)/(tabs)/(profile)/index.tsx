import React from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  AppScreen,
  AppButton,
  AppSectionHeader,
} from "@/components/ui";
import { spacing } from "@/theme";
import {
  useProfile,
  ProfileHeader,
  ProfileSection,
  ProfileMenuItem,
  QuickActionCard,
} from "@/features/profile";
import { useAuthStore } from "@/store/use-auth-store";
import { getClerkModule } from "@/lib/clerk";
import {
  User,
  Bell,
  Lock,
  Building2,
  Home,
  Car,
  CreditCard,
  Settings,
  HelpCircle,
  PhoneCall,
  Info,
  LogOut,
} from "lucide-react-native";

export default function ProfileHomeScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const logoutStore = useAuthStore((s) => s.logout);
  const { profile } = useProfile();

  const handleLogout = async () => {
    try {
      const clerk = getClerkModule();
      if (clerk && clerk.useClerk) {
        const { signOut } = clerk.useClerk();
        if (signOut) await signOut();
      }
    } catch {
      // Clerk unavailable or signOut failed
    }

    // Clear React Query cache & Zustand store
    queryClient.clear();
    logoutStore();

    // Redirect to Auth screen
    router.replace("/(app)/(auth)/login");
  };

  if (!profile) return null;

  return (
    <AppScreen scrollable={true} statusBarStyle="auto">
      <ProfileHeader
        profile={profile}
        onEditPress={() => router.push("/(profile)/edit-profile")}
      />

      <AppSectionHeader title="Quick Management" />
      <QuickActionCard
        onVehiclesPress={() => router.push("/(profile)/vehicles")}
        onHouseholdPress={() => router.push("/(profile)/household")}
        onEmergencyPress={() => router.push("/(profile)/emergency-contacts")}
        onDocumentsPress={() => router.push("/(profile)/documents")}
      />

      <ProfileSection title="Account & Security">
        <ProfileMenuItem
          title="Personal Information"
          subtitle="Name, Phone, Email & Details"
          icon={User}
          onPress={() => router.push("/(profile)/edit-profile")}
        />
        <ProfileMenuItem
          title="Notification Settings"
          subtitle="Alerts & Preferences"
          icon={Bell}
          onPress={() => router.push("/(profile)/notifications")}
        />
        <ProfileMenuItem
          title="Security & Password"
          subtitle="Biometrics & Active Sessions"
          icon={Lock}
          onPress={() => router.push("/(profile)/security")}
        />
      </ProfileSection>

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
          onPress={() => router.push("/(profile)/household")}
        />
        <ProfileMenuItem
          title="Parking Allocation"
          subtitle="Vehicles & Slots"
          icon={Car}
          onPress={() => router.push("/(profile)/vehicles")}
        />
        <ProfileMenuItem
          title="Maintenance Ledger"
          subtitle="Dues & Receipts"
          icon={CreditCard}
          divider={false}
          onPress={() => {}}
        />
      </ProfileSection>

      <ProfileSection title="Preferences & App Settings">
        <ProfileMenuItem
          title="Application Settings"
          subtitle="Dark Mode, Languages & Options"
          icon={Settings}
          onPress={() => router.push("/(profile)/settings")}
        />
      </ProfileSection>

      <ProfileSection title="Support & Legal">
        <ProfileMenuItem
          title="Help Center & Support"
          subtitle="FAQs & Society Contacts"
          icon={HelpCircle}
          onPress={() => {}}
        />
        <ProfileMenuItem
          title="Emergency Help Line"
          subtitle="Security Control Desk"
          icon={PhoneCall}
          onPress={() => router.push("/(profile)/emergency-contacts")}
        />
        <ProfileMenuItem
          title="About Foyer Application"
          subtitle="Version v1.4.0, Build & Licenses"
          icon={Info}
          divider={false}
          onPress={() => router.push("/(profile)/about")}
        />
      </ProfileSection>

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
