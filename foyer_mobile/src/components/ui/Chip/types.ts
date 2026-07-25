import type { LucideIcon } from "lucide-react-native";

export type ChipMode = "filter" | "suggestion" | "input";

export interface AppChipProps {
  /** Chip label */
  label: string;
  /** Chip mode */
  mode?: ChipMode;
  /** Whether the chip is selected */
  selected?: boolean;
  /** Leading icon (Lucide icon component) */
  leadingIcon?: LucideIcon;
  /** Trailing icon (Lucide icon component) — typically X for input chips */
  trailingIcon?: LucideIcon;
  /** Press handler */
  onPress?: () => void;
  /** Trailing icon press handler (e.g. dismiss for input chips) */
  onTrailingIconPress?: () => void;
  /** Disabled state */
  disabled?: boolean;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Accessibility hint */
  accessibilityHint?: string;
  /** Test ID for testing */
  testID?: string;
}
