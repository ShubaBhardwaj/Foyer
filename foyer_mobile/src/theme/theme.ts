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
