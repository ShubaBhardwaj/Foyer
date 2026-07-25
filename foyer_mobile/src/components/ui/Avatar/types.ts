import type { LucideIcon } from "lucide-react-native";
import type { ImageSource } from "expo-image";

export type AvatarMode = "image" | "initials" | "icon";
export type AvatarSize = "sm" | "md" | "lg" | "xl";

export interface AppAvatarProps {
  /** Display mode */
  mode: AvatarMode;
  /** Image source (when mode is "image") */
  source?: ImageSource;
  /** Initials string, typically 1–2 chars (when mode is "initials") */
  initials?: string;
  /** Lucide icon component (when mode is "icon") */
  icon?: LucideIcon;
  /** Avatar size */
  size?: AvatarSize;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Test ID for testing */
  testID?: string;
}
