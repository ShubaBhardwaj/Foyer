import React from "react";
import { View, StyleSheet } from "react-native";
import {
  AppListRow,
  AppAvatar,
  AppStatusPill,
  AppButton,
} from "@/components/ui";
import { spacing } from "@/theme";
import { CheckCircle2 } from "lucide-react-native";
import { VisitorRequest } from "../types";

interface VisitorCardProps {
  visitor: VisitorRequest;
  onPress: (visitorId: string) => void;
  onApprove?: (visitorId: string) => void;
  onLongPress?: (visitorId: string) => void;
  divider?: boolean;
}

export const VisitorCard = React.memo(function VisitorCard({
  visitor,
  onPress,
  onApprove,
  divider = true,
}: VisitorCardProps) {
  return (
    <AppListRow
      title={visitor.name}
      subtitle={`${visitor.unit} • ${visitor.timeAgo}`}
      leading={
        <AppAvatar
          mode="initials"
          initials={visitor.initials}
          size="md"
        />
      }
      trailing={
        <View style={styles.trailingContainer}>
          <AppStatusPill status={visitor.status} />
          {visitor.status === "pending" && onApprove && (
            <AppButton
              label="Approve"
              variant="tonal"
              size="sm"
              leftIcon={CheckCircle2}
              onPress={() => onApprove(visitor.id)}
              accessibilityLabel={`Approve entry for ${visitor.name}`}
            />
          )}
        </View>
      }
      divider={divider}
      onPress={() => onPress(visitor.id)}
    />
  );
});

const styles = StyleSheet.create({
  trailingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
});
