import React, { useCallback } from "react";
import { StyleSheet } from "react-native";
import { Dialog as PaperDialog, Portal } from "react-native-paper";
import * as Haptics from "expo-haptics";
import { useAppTheme, spacing, radius } from "@/theme";
import { Title, Body } from "../Typography";
import { AppButton } from "../Button";
import type { AppDialogProps } from "./types";

export const AppDialog = React.memo(function AppDialog({
  visible,
  title,
  message,
  children,
  confirmLabel = "Confirm",
  confirmVariant = "filled",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  onDismiss,
  confirmLoading = false,
  dismissable = true,
  testID,
}: AppDialogProps) {
  const theme = useAppTheme();

  const handleDismiss = useCallback(() => {
    if (dismissable && onDismiss) {
      onDismiss();
    }
  }, [dismissable, onDismiss]);

  const handleConfirm = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onConfirm?.();
  }, [onConfirm]);

  const handleCancel = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onCancel) {
      onCancel();
    } else if (onDismiss) {
      onDismiss();
    }
  }, [onCancel, onDismiss]);

  return (
    <Portal>
      <PaperDialog
        visible={visible}
        onDismiss={handleDismiss}
        dismissable={dismissable && !confirmLoading}
        testID={testID}
        style={[
          styles.dialog,
          {
            backgroundColor: theme.colors.surface,
            borderRadius: radius.lg,
          },
        ]}
      >
        <PaperDialog.Title style={styles.titleStyle}>
          <Title>{title}</Title>
        </PaperDialog.Title>

        <PaperDialog.Content style={styles.contentStyle}>
          {message && <Body style={styles.messageText}>{message}</Body>}
          {children}
        </PaperDialog.Content>

        <PaperDialog.Actions style={styles.actionsStyle}>
          {(onCancel || cancelLabel) && (
            <AppButton
              label={cancelLabel}
              variant="text"
              onPress={handleCancel}
              disabled={confirmLoading}
            />
          )}
          {onConfirm && (
            <AppButton
              label={confirmLabel}
              variant={confirmVariant}
              onPress={handleConfirm}
              loading={confirmLoading}
            />
          )}
        </PaperDialog.Actions>
      </PaperDialog>
    </Portal>
  );
});

const styles = StyleSheet.create({
  dialog: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  titleStyle: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  contentStyle: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  messageText: {
    marginBottom: spacing.xs,
  },
  actionsStyle: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    justifyContent: "flex-end",
    gap: spacing.sm,
  },
});
