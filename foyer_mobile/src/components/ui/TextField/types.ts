import type { TextInputProps as PaperTextInputProps } from "react-native-paper";
import type { LucideIcon } from "lucide-react-native";

export interface AppTextFieldProps
  extends Omit<PaperTextInputProps, "theme" | "left" | "right" | "error"> {
  /** Field label */
  label?: string;
  /** Helper text displayed under input when no error */
  helperText?: string;
  /** Error message displayed under input when validation fails */
  errorMessage?: string;
  /** Left icon component */
  leftIcon?: LucideIcon;
  /** Right icon component */
  rightIcon?: LucideIcon;
  /** Right icon press handler */
  onRightIconPress?: () => void;
  /** Enable password eye toggle button (overrides rightIcon when true) */
  isPassword?: boolean;
  /** Test ID for testing */
  testID?: string;
}
