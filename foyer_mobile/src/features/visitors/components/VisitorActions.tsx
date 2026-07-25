import React from "react";
import { View, StyleSheet } from "react-native";
import { AppButton } from "@/components/ui";
import { spacing } from "@/theme";
import {
  CheckCircle2,
  XCircle,
  QrCode,
  Edit,
  LogIn,
  AlertCircle,
} from "lucide-react-native";
import { VisitorStatus } from "../types";

interface VisitorActionsProps {
  status: VisitorStatus;
  onApprove: () => void;
  onReject: () => void;
  onMarkEntry?: () => void;
  onCancel?: () => void;
  onViewReason?: () => void;
  onEdit: () => void;
  onViewQrPass: () => void;
}

export const VisitorActions = React.memo(function VisitorActions({
  status,
  onApprove,
  onReject,
  onMarkEntry,
  onCancel,
  onViewReason,
  onEdit,
  onViewQrPass,
}: VisitorActionsProps) {
  return (
    <View style={styles.container}>
      {/* Primary Actions based on Status */}
      {status === "pending" && (
        <View style={styles.buttonGroup}>
          <AppButton
            label="Approve Entry"
            variant="filled"
            leftIcon={CheckCircle2}
            onPress={onApprove}
            fullWidth
          />
          <AppButton
            label="Reject Entry"
            variant="danger"
            leftIcon={XCircle}
            onPress={onReject}
            fullWidth
          />
        </View>
      )}

      {status === "approved" && (
        <View style={styles.buttonGroup}>
          <AppButton
            label="Mark Check-In Entry"
            variant="filled"
            leftIcon={LogIn}
            onPress={onMarkEntry}
            fullWidth
          />
          <AppButton
            label="Cancel Approval"
            variant="outlined"
            leftIcon={XCircle}
            onPress={onCancel}
            fullWidth
          />
        </View>
      )}

      {status === "rejected" && (
        <View style={styles.buttonGroup}>
          <AppButton
            label="View Rejection Reason"
            variant="tonal"
            leftIcon={AlertCircle}
            onPress={onViewReason}
            fullWidth
          />
        </View>
      )}

      {/* Secondary Actions */}
      <View style={styles.buttonGroup}>
        <AppButton
          label="View QR Pass"
          variant="tonal"
          leftIcon={QrCode}
          onPress={onViewQrPass}
          fullWidth
        />
        <AppButton
          label="Edit Visitor Info"
          variant="outlined"
          leftIcon={Edit}
          onPress={onEdit}
          fullWidth
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
    gap: spacing.md,
  },
  buttonGroup: {
    gap: spacing.sm,
  },
});
