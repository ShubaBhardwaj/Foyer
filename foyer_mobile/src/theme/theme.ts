import {
  MD3LightTheme,
  MD3DarkTheme,
  configureFonts,
  useTheme as usePaperTheme,
  type MD3Theme,
} from "react-native-paper";

/**
 * Custom color palette extending Material 3 default colors.
 */
const customLightColors = {
  ...MD3LightTheme.colors,
  primary: "#0066FF",
  onPrimary: "#FFFFFF",
  primaryContainer: "#D9E2FF",
  onPrimaryContainer: "#001945",
  secondary: "#575E71",
  onSecondary: "#FFFFFF",
  secondaryContainer: "#DBE2F9",
  onSecondaryContainer: "#141B2C",
  background: "#F8FAFC",
  surface: "#FFFFFF",
  onSurface: "#0F172A",
  outline: "#CBD5E1",
};

const customDarkColors = {
  ...MD3DarkTheme.colors,
  primary: "#4D94FF",
  onPrimary: "#002B75",
  primaryContainer: "#0047B3",
  onPrimaryContainer: "#D9E2FF",
  secondary: "#C0C6DD",
  onSecondary: "#293042",
  secondaryContainer: "#3F4759",
  onSecondaryContainer: "#DBE2F9",
  background: "#0F172A",
  surface: "#1E293B",
  onSurface: "#F8FAFC",
  outline: "#475569",
};

/**
 * Reusable Material 3 Light Theme configuration.
 */
export const AppLightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: customLightColors,
  fonts: configureFonts({ config: {} }),
};

/**
 * Reusable Material 3 Dark Theme configuration.
 */
export const AppDarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: customDarkColors,
  fonts: configureFonts({ config: {} }),
};

export const colors = AppLightTheme.colors;

export const useAppTheme = () => usePaperTheme<MD3Theme>();

export type AppTheme = typeof AppLightTheme;
