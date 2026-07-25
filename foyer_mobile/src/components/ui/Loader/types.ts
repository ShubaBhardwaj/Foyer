import { ViewStyle } from "react-native";

export type LoaderMode = "inline" | "fullscreen" | "overlay" | "skeleton";
export type SkeletonVariant = "line" | "card" | "list-row" | "avatar";

export interface AppLoaderProps {
  /** Loader mode */
  mode?: LoaderMode;
  /** Skeleton variant when mode is "skeleton" */
  skeletonVariant?: SkeletonVariant;
  /** Custom spinner size */
  size?: "small" | "large" | number;
  /** Message text shown under spinner in fullscreen/overlay */
  message?: string;
  /** Custom container style */
  style?: ViewStyle | ViewStyle[];
  /** Test ID for testing */
  testID?: string;
}
