import { ViewStyle } from "react-native";

export interface AppSectionHeaderProps {
  /** Section title */
  title: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Trailing action component (e.g. text button or icon button) */
  action?: React.ReactNode;
  /** Custom container style */
  style?: ViewStyle | ViewStyle[];
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Test ID for testing */
  testID?: string;
}
