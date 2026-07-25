import { useState, useCallback } from "react";
import { initialNotificationPreferences } from "../../shared/data/profileDummyData";
import { NotificationPreferences } from "../../shared/types/profile.types";

export function useNotificationSettings() {
  const [preferences, setPreferences] = useState<NotificationPreferences>(
    initialNotificationPreferences
  );

  const handleToggle = useCallback((key: keyof NotificationPreferences) => {
    // TODO: Call POST /api/v1/profile/notifications API endpoint
    setPreferences((prev: NotificationPreferences) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  return {
    preferences,
    handleToggle,
  };
}
