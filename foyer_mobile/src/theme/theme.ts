import {
  MD3LightTheme,
  MD3DarkTheme,
  configureFonts,
  useTheme as usePaperTheme,
  type MD3Theme,
} from "react-native-paper";

// ─── Font Family Constants ─────────────────────────────────────────────────────
export const fontFamily = {
  regular: "PlusJakartaSans-Regular",
  medium: "PlusJakartaSans-Medium",
  semiBold: "PlusJakartaSans-SemiBold",
  bold: "PlusJakartaSans-Bold",
} as const;

// ─── Spacing Tokens ────────────────────────────────────────────────────────────
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

// ─── Border Radius Tokens ──────────────────────────────────────────────────────
export const radius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

// ─── Elevation Levels ──────────────────────────────────────────────────────────
export const elevation = {
  none: 0,
  sm: 1,
  md: 2,
  lg: 4,
  xl: 8,
} as const;

// ─── Opacity Tokens ────────────────────────────────────────────────────────────
export const opacity = {
  disabled: 0.38,
  hover: 0.08,
  pressed: 0.12,
  overlay: 0.5,
} as const;

// ─── Animation Duration Tokens (ms) ───────────────────────────────────────────
export const animation = {
  fast: 150,
  normal: 250,
  slow: 350,
} as const;

// ─── Typography Scale ──────────────────────────────────────────────────────────
export const typographyScale = {
  h1: {
    fontFamily: fontFamily.bold,
    fontSize: 28,
    lineHeight: 36,
  },
  h2: {
    fontFamily: fontFamily.bold,
    fontSize: 24,
    lineHeight: 32,
  },
  title: {
    fontFamily: fontFamily.semiBold,
    fontSize: 20,
    lineHeight: 28,
  },
  subtitle: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    lineHeight: 24,
  },
  body: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 22,
  },
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    lineHeight: 18,
  },
  label: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    lineHeight: 16,
  },
} as const;

// ─── Semantic Status Colors ────────────────────────────────────────────────────
export const semanticColors = {
  light: {
    success: "#3A7D44",
    successContainer: "#D4EDDA",
    onSuccess: "#FFFFFF",
    warning: "#B8823C",
    warningContainer: "#F5E3C6",
    onWarning: "#FFFFFF",
    info: "#2D6A9F",
    infoContainer: "#D1E8FF",
    onInfo: "#FFFFFF",
    neutral: "#6B7280",
    neutralContainer: "#F3F4F6",
    onNeutral: "#FFFFFF",
  },
  dark: {
    success: "#6FCF7C",
    successContainer: "#1E3A24",
    onSuccess: "#0B1F10",
    warning: "#D9A968",
    warningContainer: "#5C3D14",
    onWarning: "#3D2506",
    info: "#7CB8E4",
    infoContainer: "#1A3A5C",
    onInfo: "#0A1F33",
    neutral: "#9CA3AF",
    neutralContainer: "#374151",
    onNeutral: "#111827",
  },
} as const;

// ─── Navigation Tint (validated for tab bar contrast) ──────────────────────────
export const navigationTint = {
  light: "#4A7A5E",
  dark: "#B9E0B0",
} as const;

// ─── Material 3 Color Palettes ─────────────────────────────────────────────────

/**
 * Custom color palette extending Material 3 default colors.
 */
const customLightColors = {
  ...MD3LightTheme.colors,
  primary: "#1B3A2E",
  onPrimary: "#F5F0E8",
  primaryContainer: "#C8DED0",
  onPrimaryContainer: "#0B1F16",
  secondary: "#8FBC8F",
  onSecondary: "#1B3A2E",
  secondaryContainer: "#E1EFDD",
  onSecondaryContainer: "#2C4A2E",
  tertiary: "#B8823C",
  onTertiary: "#FFFFFF",
  tertiaryContainer: "#F5E3C6",
  onTertiaryContainer: "#4A2F0B",
  error: "#B3413A",
  onError: "#FFFFFF",
  errorContainer: "#F6D8D5",
  onErrorContainer: "#4A0F0B",
  background: "#F5F0E8",
  surface: "#FFFFFF",
  onSurface: "#1B2A22",
  outline: "#B8C4BA",
};

const customDarkColors = {
  ...MD3DarkTheme.colors,
  primary: "#8FBC8F",
  onPrimary: "#123321",
  primaryContainer: "#2C4A38",
  onPrimaryContainer: "#D7E9D5",
  secondary: "#A9CBA0",
  onSecondary: "#1E3324",
  secondaryContainer: "#33503A",
  onSecondaryContainer: "#DCEBD8",
  tertiary: "#D9A968",
  onTertiary: "#3D2506",
  tertiaryContainer: "#5C3D14",
  onTertiaryContainer: "#F5E3C6",
  error: "#E0736C",
  onError: "#3D0B08",
  errorContainer: "#6B231E",
  onErrorContainer: "#F6D8D5",
  background: "#10201A",
  surface: "#1B2E24",
  onSurface: "#F0EDE3",
  outline: "#4A5C4E",
};

// ─── Paper Font Config (wired to Plus Jakarta Sans) ────────────────────────────
const fontConfig = {
  displayLarge: { fontFamily: fontFamily.bold },
  displayMedium: { fontFamily: fontFamily.bold },
  displaySmall: { fontFamily: fontFamily.bold },
  headlineLarge: { fontFamily: fontFamily.bold },
  headlineMedium: { fontFamily: fontFamily.semiBold },
  headlineSmall: { fontFamily: fontFamily.semiBold },
  titleLarge: { fontFamily: fontFamily.semiBold },
  titleMedium: { fontFamily: fontFamily.medium },
  titleSmall: { fontFamily: fontFamily.medium },
  bodyLarge: { fontFamily: fontFamily.regular },
  bodyMedium: { fontFamily: fontFamily.regular },
  bodySmall: { fontFamily: fontFamily.regular },
  labelLarge: { fontFamily: fontFamily.medium },
  labelMedium: { fontFamily: fontFamily.medium },
  labelSmall: { fontFamily: fontFamily.medium },
} as const;

// ─── Theme Objects ─────────────────────────────────────────────────────────────

/**
 * Reusable Material 3 Light Theme configuration.
 */
export const AppLightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: customLightColors,
  fonts: configureFonts({ config: fontConfig }),
};

/**
 * Reusable Material 3 Dark Theme configuration.
 */
export const AppDarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: customDarkColors,
  fonts: configureFonts({ config: fontConfig }),
};

// ─── Convenience Exports ───────────────────────────────────────────────────────

export const colors = AppLightTheme.colors;

export const useAppTheme = () => usePaperTheme<MD3Theme>();

export type AppTheme = typeof AppLightTheme;
