import { ViewStyle } from "react-native";
import type { StatusBarStyle } from "expo-status-bar";

export interface AppScreenProps {
  /** Children content */
  children: React.ReactNode;
  /** Whether the screen content should scroll (default: true) */
  scrollable?: boolean;
  /** Background color override (defaults to theme.colors.background) */
  backgroundColor?: string;
  /** Status bar style ("auto" | "light" | "dark") */
  statusBarStyle?: StatusBarStyle;
  /** Safe area edge handling (default: all edges enabled) */
  safeAreaEdges?: ("top" | "bottom" | "left" | "right")[];
  /** Enable KeyboardAvoidingView (default: true) */
  keyboardAvoiding?: boolean;
  /** Keyboard vertical offset for KeyboardAvoidingView */
  keyboardOffset?: number;
  /** Content padding */
  padding?: number;
  /** Custom container style */
  style?: ViewStyle | ViewStyle[];
  /** Custom content container style (for ScrollView) */
  contentContainerStyle?: ViewStyle | ViewStyle[];
  /** Test ID for testing */
  testID?: string;
}
