import type { LucideIcon } from "lucide-react-native";
import { ViewStyle } from "react-native";

export interface AppEmptyStateProps {
  /** Title text */
  title: string;
  /** Description text */
  description?: string;
  /** Lucide icon component */
  icon?: LucideIcon;
  /** Custom illustration component (overrides icon if supplied) */
  illustration?: React.ReactNode;
  /** Action button label */
  actionLabel?: string;
  /** Action button press handler */
  onActionPress?: () => void;
  /** Custom container style */
  style?: ViewStyle | ViewStyle[];
  /** Test ID for testing */
  testID?: string;
}
