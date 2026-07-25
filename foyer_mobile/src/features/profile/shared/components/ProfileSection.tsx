import React from "react";
import { View, StyleSheet } from "react-native";
import { AppSectionHeader } from "@/components/ui";
import { ProfileCard } from "./ProfileCard";
import { spacing } from "@/theme";

interface ProfileSectionProps {
  title: string;
  children: React.ReactNode;
}

export const ProfileSection = React.memo(function ProfileSection({
  title,
  children,
}: ProfileSectionProps) {
  return (
    <View style={styles.container}>
      <AppSectionHeader title={title} />
      <ProfileCard variant="elevated">{children}</ProfileCard>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
  },
});
