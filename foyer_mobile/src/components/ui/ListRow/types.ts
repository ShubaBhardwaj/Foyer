import { ViewStyle } from "react-native";

export interface AppListRowProps {
  /** Main row title */
  title: string;
  /** Subtitle or secondary line */
  subtitle?: string;
  /** Leading element (e.g. AppAvatar, Icon, or image) */
  leading?: React.ReactNode;
  /** Trailing element (e.g. AppStatusPill, ChevronRight, timestamp, or action button) */
  trailing?: React.ReactNode;
  /** Show chevron right icon on the right */
  showChevron?: boolean;
  /** Press handler */
  onPress?: () => void;
  /** Skeleton loading state */
  loading?: boolean;
  /** Bottom divider line */
  divider?: boolean;
  /** Custom container style */
  style?: ViewStyle | ViewStyle[];
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Accessibility hint */
  accessibilityHint?: string;
  /** Test ID for testing */
  testID?: string;
}
