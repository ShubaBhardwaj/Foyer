import React from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { AppScreen } from "@/components/ui";
import { spacing } from "@/theme";
import {
  useSettings,
  ProfileSection,
  ProfileMenuItem,
  ToggleRow,
} from "@/features/profile";
import { Moon, Globe, HardDrive, Code, Sparkles } from "lucide-react-native";

export default function SettingsScreen() {
  const router = useRouter();
  const {
    settings,
    handleToggleDarkMode,
    handleToggleExperimental,
    handleToggleDeveloper,
  } = useSettings();

  return (
    <AppScreen scrollable={true} statusBarStyle="auto">
      {/* ─── Preferences Section ────────────────────────────────────────── */}
      <ProfileSection title="Application Preferences">
        <ToggleRow
          label="Dark Mode Theme"
          description="Switch between light and dark UI theme"
          value={settings.darkMode}
          onValueChange={handleToggleDarkMode}
        />
        <ProfileMenuItem
          title="App Language"
          subtitle={settings.language}
          icon={Globe}
          onPress={() => {}}
        />
        <ProfileMenuItem
          title="Clear App Cache"
          subtitle={`Current cache size: ${settings.cacheSize}`}
          icon={HardDrive}
          onPress={() => {
            // TODO: Clear cache
          }}
        />
      </ProfileSection>

      {/* ─── Advanced Developer Options ────────────────────────────────── */}
      <ProfileSection title="Developer & Experimental">
        <ToggleRow
          label="Experimental Features"
          description="Enable early access previews for upcoming amenities"
          value={settings.experimentalFeatures}
          onValueChange={handleToggleExperimental}
        />
        <ToggleRow
          label="Developer Debug Options"
          description="Enable verbose network logging and UI inspector"
          value={settings.developerOptions}
          divider={false}
          onValueChange={handleToggleDeveloper}
        />
      </ProfileSection>
    </AppScreen>
  );
}

const styles = StyleSheet.create({});
