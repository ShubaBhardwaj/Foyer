import { create } from "zustand";

type ThemeMode = "light" | "dark" | "system";

interface UIState {
  themeMode: ThemeMode;
  isBottomSheetOpen: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  setBottomSheetOpen: (isOpen: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  themeMode: "light",
  isBottomSheetOpen: false,
  setThemeMode: (mode) => set({ themeMode: mode }),
  setBottomSheetOpen: (isOpen) => set({ isBottomSheetOpen: isOpen }),
}));
