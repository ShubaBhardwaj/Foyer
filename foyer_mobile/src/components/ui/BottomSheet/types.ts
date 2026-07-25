import React from "react";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";

export interface AppBottomSheetProps {
  /** Title shown in sheet header */
  title?: string;
  /** Sheet content */
  children: React.ReactNode;
  /** Snap points array (e.g. ["25%", "50%", "90%"]) */
  snapPoints?: (string | number)[];
  /** Index to open at (default: 0) */
  index?: number;
  /** Enable dismiss when backdrop is tapped (default: true) */
  dismissOnBackdropTap?: boolean;
  /** Callback fired when sheet is dismissed/closed */
  onDismiss?: () => void;
  /** Custom header component (overrides default title + close button header) */
  customHeader?: React.ReactNode;
  /** Enable scrollable content view (default: true) */
  scrollable?: boolean;
  /** Test ID for testing */
  testID?: string;
}

export type AppBottomSheetRef = BottomSheetModal;
