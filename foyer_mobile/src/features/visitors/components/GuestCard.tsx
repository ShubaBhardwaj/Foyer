import React from "react";
import { View, StyleSheet } from "react-native";
import {
  AppListRow,
  AppAvatar,
  AppStatusPill,
  Subtitle,
  Body,
  Caption,
} from "@/components/ui";
import { spacing } from "@/theme";
import { PreApprovedGuest } from "../types";

interface GuestCardProps {
  guest: PreApprovedGuest;
  onPress?: (guestId: string) => void;
  divider?: boolean;
}

export const GuestCard = React.memo(function GuestCard({
  guest,
  onPress,
  divider = true,
}: GuestCardProps) {
  return (
    <AppListRow
      title={guest.guestName}
      subtitle={`Host: ${guest.residentName} (${guest.unit}) • Valid: ${guest.validTime}`}
      leading={
        <AppAvatar mode="initials" initials={guest.initials} size="md" />
      }
      trailing={
        <View style={styles.trailing}>
          <AppStatusPill status={guest.status} />
        </View>
      }
      divider={divider}
      onPress={onPress ? () => onPress(guest.id) : undefined}
    />
  );
});

const styles = StyleSheet.create({
  trailing: {
    flexDirection: "row",
    alignItems: "center",
  },
});
