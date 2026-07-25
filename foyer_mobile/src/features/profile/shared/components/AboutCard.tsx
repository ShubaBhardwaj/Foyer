import React from "react";
import { View, StyleSheet } from "react-native";
import { ProfileCard } from "./ProfileCard";
import { Title, Subtitle, Body, Caption, AppDivider } from "@/components/ui";
import { useAppTheme, spacing, radius } from "@/theme";
import { Building2, ShieldCheck, ExternalLink } from "lucide-react-native";
import { AppSettings } from "../types/profile.types";

interface AboutCardProps {
  settings: AppSettings;
}

export const AboutCard = React.memo(function AboutCard({ settings }: AboutCardProps) {
  const theme = useAppTheme();

  return (
    <ProfileCard variant="elevated">
      <View style={styles.content}>
        <View style={[styles.logoBox, { backgroundColor: theme.colors.primaryContainer }]}>
          <Building2 size={40} color={theme.colors.onPrimaryContainer} />
        </View>

        <Title center style={{ color: theme.colors.onSurface, marginTop: spacing.md, fontSize: 22 }}>
          Foyer Mobile
        </Title>
        <Subtitle center style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}>
          Smart Living & Society Management
        </Subtitle>

        <AppDivider style={{ marginVertical: spacing.md }} />

        <View style={styles.infoRow}>
          <Caption style={{ color: theme.colors.outline }}>App Version</Caption>
          <Body style={{ color: theme.colors.onSurface, fontWeight: "600" }}>
            {settings.appVersion} (Build {settings.buildNumber})
          </Body>
        </View>

        <View style={styles.infoRow}>
          <Caption style={{ color: theme.colors.outline }}>Developed By</Caption>
          <Body style={{ color: theme.colors.onSurface, fontWeight: "600" }}>
            Foyer Engineering Team
          </Body>
        </View>

        <View style={styles.infoRow}>
          <Caption style={{ color: theme.colors.outline }}>Official Website</Caption>
          <Body style={{ color: theme.colors.primary, fontWeight: "600" }}>
            https://foyer.app
          </Body>
        </View>

        <View style={styles.infoRow}>
          <Caption style={{ color: theme.colors.outline }}>Open Source Licenses</Caption>
          <Body style={{ color: theme.colors.onSurface, fontWeight: "600" }}>
            React Native, Expo SDK 55, Lucide
          </Body>
        </View>
      </View>
    </ProfileCard>
  );
});

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
    padding: spacing.xl,
  },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: radius.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  infoRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: spacing.xs,
  },
});
