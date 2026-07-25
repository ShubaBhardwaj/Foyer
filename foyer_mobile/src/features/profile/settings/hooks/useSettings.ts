import { useState, useCallback } from "react";
import { initialAppSettings } from "../../shared/data/profileDummyData";
import { AppSettings } from "../../shared/types/profile.types";

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(initialAppSettings);

  const handleToggleDarkMode = useCallback(() => {
    setSettings((prev: AppSettings) => ({ ...prev, darkMode: !prev.darkMode }));
  }, []);

  const handleToggleExperimental = useCallback(() => {
    setSettings((prev: AppSettings) => ({ ...prev, experimentalFeatures: !prev.experimentalFeatures }));
  }, []);

  const handleToggleDeveloper = useCallback(() => {
    setSettings((prev: AppSettings) => ({ ...prev, developerOptions: !prev.developerOptions }));
  }, []);

  return {
    settings,
    handleToggleDarkMode,
    handleToggleExperimental,
    handleToggleDeveloper,
  };
}
