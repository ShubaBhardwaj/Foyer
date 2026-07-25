import type { LucideIcon } from "lucide-react-native";

export type IconButtonVariant = "filled" | "outlined" | "tonal";
export type IconButtonSize = 32 | 40 | 48 | 56;

export interface AppIconButtonProps {
  /** Lucide icon component */
  icon: LucideIcon;
  /** Visual variant */
  variant?: IconButtonVariant;
  /** Button size in dp */
  size?: IconButtonSize;
  /** Disabled state */
  disabled?: boolean;
  /** Press handler */
  onPress?: () => void;
  /** Accessibility label (required for icon-only buttons) */
  accessibilityLabel: string;
  /** Accessibility hint */
  accessibilityHint?: string;
  /** Test ID for testing */
  testID?: string;
}
