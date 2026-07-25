import React from "react";
import { View, StyleSheet } from "react-native";
import {
  AppListRow,
  AppAvatar,
  AppStatusPill,
} from "@/components/ui";
import { spacing } from "@/theme";
import { HouseholdMember } from "../../shared/types/profile.types";

interface HouseholdMemberCardProps {
  member: HouseholdMember;
  onPress?: (member: HouseholdMember) => void;
  divider?: boolean;
}

export const HouseholdMemberCard = React.memo(function HouseholdMemberCard({
  member,
  onPress,
  divider = true,
}: HouseholdMemberCardProps) {
  return (
    <AppListRow
      title={member.name}
      subtitle={`${member.role} • ${member.relationship}${member.phone ? ` • ${member.phone}` : ""}`}
      leading={<AppAvatar mode="initials" initials={member.initials} size="md" />}
      trailing={
        <View style={styles.trailingRow}>
          <AppStatusPill
            status={member.isVerified ? "approved" : "pending"}
            label={member.isVerified ? "Verified" : "Pending Verification"}
          />
        </View>
      }
      divider={divider}
      onPress={onPress ? () => onPress(member) : undefined}
    />
  );
});

const styles = StyleSheet.create({
  trailingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
});
