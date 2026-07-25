import { useState, useCallback } from "react";
import { profileData } from "../../shared/data/profileDummyData";
import { UserProfile } from "../../shared/types/profile.types";

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile>(profileData);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateProfile = useCallback((updates: Partial<UserProfile>) => {
    // TODO: Call PATCH /api/v1/profile API endpoint
    setProfile((prev: UserProfile) => ({ ...prev, ...updates }));
  }, []);

  return {
    profile,
    isLoading,
    setIsLoading,
    handleUpdateProfile,
  };
}
