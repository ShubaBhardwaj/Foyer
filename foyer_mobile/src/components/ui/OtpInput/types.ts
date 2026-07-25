import { ViewStyle } from "react-native";

export interface AppOtpInputProps {
  /** Configurable OTP code length (default: 6) */
  length?: number;
  /** Current value string */
  value?: string;
  /** Callback fired when value changes */
  onChange?: (code: string) => void;
  /** Callback fired when code entry is complete */
  onComplete?: (code: string) => void;
  /** Mask characters (for PIN entry, e.g. guard login) */
  masked?: boolean;
  /** Error state flag or error message string */
  error?: boolean | string;
  /** Disabled state */
  disabled?: boolean;
  /** Custom container style */
  style?: ViewStyle | ViewStyle[];
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Test ID for testing */
  testID?: string;
}
