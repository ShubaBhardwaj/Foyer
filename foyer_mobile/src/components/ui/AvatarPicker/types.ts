import type { ImageSource } from "expo-image";

export interface AppAvatarPickerProps {
  /** Current image URI or ImageSource */
  source?: string | ImageSource;
  /** Callback when a new image is selected (returns local uri) */
  onImagePicked?: (uri: string) => void;
  /** Initials fallback when no image source is provided */
  initials?: string;
  /** Size of the circular preview in dp (default: 96) */
  size?: number;
  /** Loading/uploading state */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Test ID for testing */
  testID?: string;
}
