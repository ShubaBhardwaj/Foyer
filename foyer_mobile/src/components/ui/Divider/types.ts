import { ViewStyle } from "react-native";

export type DividerOrientation = "horizontal" | "vertical";

export interface AppDividerProps {
  /** Orientation of the divider */
  orientation?: DividerOrientation;
  /** Thickness in dp (default: 1) */
  thickness?: number;
  /** Custom divider color (defaults to theme.colors.outline) */
  color?: string;
  /** Margin around divider (vertical margin for horizontal, horizontal margin for vertical) */
  spacing?: number;
  /** Custom style overrides */
  style?: ViewStyle | ViewStyle[];
  /** Test ID for testing */
  testID?: string;
}
