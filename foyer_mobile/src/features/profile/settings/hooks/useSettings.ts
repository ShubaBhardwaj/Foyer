import { useState } from "react";
import { AppSettings } from "../../shared/types/profile.types";

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>({
    darkMode: false,
    language: "English",
    appVersion: "1.0.0",
    buildNumber: "100",
    cacheSize: "12.4 MB",
    developerOptions: false,
    experimentalFeatures: false,
  });

  const handleToggleDarkMode = () => setSettings((prev: AppSettings) => ({ ...prev, darkMode: !prev.darkMode }));
  const handleToggleExperimental = () => setSettings((prev: AppSettings) => ({ ...prev, experimentalFeatures: !prev.experimentalFeatures }));
  const handleToggleDeveloper = () => setSettings((prev: AppSettings) => ({ ...prev, developerOptions: !prev.developerOptions }));

  return {
    settings,
    setSettings,
    handleToggleDarkMode,
    handleToggleExperimental,
    handleToggleDeveloper,
  };
}
