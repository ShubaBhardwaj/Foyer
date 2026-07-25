export interface AppDialogProps {
  /** Whether the dialog is visible */
  visible: boolean;
  /** Dialog title */
  title: string;
  /** Dialog message / body text */
  message?: string;
  /** Custom body node (replaces or appends under message) */
  children?: React.ReactNode;
  /** Confirm button label (default: "Confirm") */
  confirmLabel?: string;
  /** Confirm button variant */
  confirmVariant?: "filled" | "danger";
  /** Cancel button label (default: "Cancel") */
  cancelLabel?: string;
  /** On confirm callback */
  onConfirm?: () => void;
  /** On cancel callback */
  onCancel?: () => void;
  /** On dismiss callback (backdrop tap / back button) */
  onDismiss?: () => void;
  /** Loading state on confirm button */
  confirmLoading?: boolean;
  /** Dismissable by tapping backdrop (default: true) */
  dismissable?: boolean;
  /** Test ID for testing */
  testID?: string;
}
