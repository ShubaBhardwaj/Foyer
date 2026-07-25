import { useState } from "react";
import { NotificationPreferences } from "../../shared/types/profile.types";

export function useNotificationSettings() {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    visitorAlerts: true,
    bookingUpdates: true,
    communityPosts: true,
    polls: true,
    events: true,
    maintenance: true,
    announcements: true,
    marketing: false,
  });

  const handleToggle = (key: keyof NotificationPreferences) => {
    setPreferences((prev: NotificationPreferences) => ({ ...prev, [key]: !prev[key] }));
  };

  return {
    preferences,
    setPreferences,
    handleToggle,
  };
}
