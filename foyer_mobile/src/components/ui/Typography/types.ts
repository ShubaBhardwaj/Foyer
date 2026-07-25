import { TextStyle, TextProps as RNTextProps } from "react-native";

export interface TypographyProps extends RNTextProps {
  /** Text content */
  children: React.ReactNode;
  /** Override text color */
  color?: string;
  /** Center text */
  center?: boolean;
  /** Additional style overrides */
  style?: TextStyle | TextStyle[];
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Test ID for testing */
  testID?: string;
}
