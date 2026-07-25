import type { ViewStyle } from "react-native";
import type { LucideIcon } from "lucide-react-native";

export type ButtonVariant = "filled" | "tonal" | "outlined" | "text" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface AppButtonProps {
  /** Button label text */
  label: string;
  /** Visual variant */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Loading state — shows spinner and disables press */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Left icon (Lucide icon component) */
  leftIcon?: LucideIcon;
  /** Right icon (Lucide icon component) */
  rightIcon?: LucideIcon;
  /** Press handler */
  onPress?: () => void;
  /** Full width */
  fullWidth?: boolean;
  /** Additional style overrides */
  style?: ViewStyle | ViewStyle[];
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Accessibility hint */
  accessibilityHint?: string;
  /** Test ID for testing */
  testID?: string;
}
