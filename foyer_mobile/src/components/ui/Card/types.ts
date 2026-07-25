import { ViewStyle } from "react-native";

export type CardVariant = "elevated" | "outlined" | "filled";

export interface AppCardProps {
  /** Card content */
  children: React.ReactNode;
  /** Visual variant */
  variant?: CardVariant;
  /** Press handler — enables press animation when provided */
  onPress?: () => void;
  /** Additional style overrides */
  style?: ViewStyle | ViewStyle[];
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Accessibility hint */
  accessibilityHint?: string;
  /** Test ID for testing */
  testID?: string;
}
