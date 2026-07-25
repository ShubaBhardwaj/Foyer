import { ViewStyle } from "react-native";

export interface SegmentItem<T extends string = string> {
  /** Segment key / value */
  value: T;
  /** Segment display label */
  label: string;
  /** Optional icon component */
  icon?: React.ComponentType<{ size: number; color: string }>;
}

export interface AppSegmentedControlProps<T extends string = string> {
  /** List of 2 to 4 segments */
  segments: SegmentItem<T>[];
  /** Currently selected segment value */
  value: T;
  /** Callback fired when a segment is selected */
  onChange: (value: T) => void;
  /** Full width stretching (default: true) */
  fullWidth?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Custom container style */
  style?: ViewStyle | ViewStyle[];
  /** Test ID for testing */
  testID?: string;
}
