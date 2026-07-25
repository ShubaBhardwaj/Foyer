import { ViewStyle } from "react-native";

export interface AppSearchBarProps {
  /** Current value */
  value?: string;
  /** Direct change callback */
  onChangeText?: (text: string) => void;
  /** Callback fired after user stops typing (debounced) */
  onDebouncedChange?: (text: string) => void;
  /** Debounce delay in milliseconds (default: 300ms) */
  debounceMs?: number;
  /** Placeholder text */
  placeholder?: string;
  /** Show loading spinner */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Container style overrides */
  style?: ViewStyle | ViewStyle[];
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Test ID for testing */
  testID?: string;
}
