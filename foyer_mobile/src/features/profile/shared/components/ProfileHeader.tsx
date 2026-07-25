import React from "react";
import { View, StyleSheet } from "react-native";
import {
  AppAvatar,
  H2,
  Title,
  Subtitle,
  Body,
  Caption,
  AppStatusPill,
  AppButton,
} from "@/components/ui";
import { useAppTheme, spacing, radius } from "@/theme";
import { Edit3, ShieldCheck, Home } from "lucide-react-native";
import { UserProfile } from "../types/profile.types";

interface ProfileHeaderProps {
  profile: UserProfile;
  onEditPress: () => void;
}

export const ProfileHeader = React.memo(function ProfileHeader({
  profile,
  onEditPress,
}: ProfileHeaderProps) {
  const theme = useAppTheme();

  return (
    <View style={styles.container}>
      {/* Avatar & Edit Trigger */}
      <View style={styles.avatarWrapper}>
        <AppAvatar mode="initials" initials={profile.initials} size="xl" />
        <View
          style={[
            styles.roleBadgeIcon,
            { backgroundColor: theme.colors.primary, borderColor: theme.colors.background },
          ]}
        >
          <ShieldCheck size={14} color={theme.colors.onPrimary} />
        </View>
      </View>

      {/* Profile Text */}
      <H2 style={{ color: theme.colors.onSurface, marginTop: spacing.sm }}>
        {profile.name}
      </H2>
      <Caption style={{ color: theme.colors.outline, marginTop: 2 }}>
        ID: {profile.residentId}
      </Caption>

      {/* Flat Location & Role Pills */}
      <View style={styles.badgeRow}>
        <View style={[styles.unitChip, { backgroundColor: theme.colors.secondaryContainer }]}>
          <Home size={14} color={theme.colors.secondary} />
          <Caption style={{ color: theme.colors.onSecondaryContainer, fontWeight: "700" }}>
            {profile.tower} • {profile.flat}
          </Caption>
        </View>
        <AppStatusPill status="approved" label={profile.role} />
      </View>

      {/* Edit Profile Button */}
      <View style={styles.editBtnWrapper}>
        <AppButton
          label="Edit Profile"
          variant="outlined"
          size="sm"
          leftIcon={Edit3}
          onPress={onEditPress}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  avatarWrapper: {
    position: "relative",
  },
  roleBadgeIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: radius.full,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  unitChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
    gap: 4,
  },
  editBtnWrapper: {
    marginTop: spacing.md,
  },
});
