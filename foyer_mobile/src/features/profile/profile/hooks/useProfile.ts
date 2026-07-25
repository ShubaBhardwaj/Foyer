import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { profileRepository } from "@/repositories/profile.repository";
import { UpdateProfileRequestDto } from "@/types/api/profile";
import { useAuthStore } from "@/store/use-auth-store";
import { UserProfile } from "../../shared/types/profile.types";

export function useProfile() {
  const queryClient = useQueryClient();
  const setUserSession = useAuthStore((s) => s.setUserSession);
  const currentSociety = useAuthStore((s) => s.society);

  const {
    data: rawUser,
    isLoading,
    isRefetching,
    refetch,
    isError,
    error,
  } = useQuery({
    queryKey: queryKeys.profile.me(),
    queryFn: async () => {
      const user = await profileRepository.fetchUserProfile();
      setUserSession(user, currentSociety);
      return user;
    },
  });

  const profile = useMemo<UserProfile | undefined>(() => {
    if (!rawUser) return undefined;
    return {
      id: rawUser._id,
      name: rawUser.name,
      avatar: undefined,
      initials: rawUser.name.slice(0, 2).toUpperCase(),
      residentId: `RES-${rawUser._id.slice(-4)}`,
      tower: rawUser.tower || "Tower A",
      flat: rawUser.flatNumber || "Flat 101",
      role: rawUser.role === "ADMIN" ? "Society Admin" : rawUser.role === "OWNER" ? "Resident Owner" : "Tenant",
      phone: rawUser.phone || "+91 99999 88888",
      email: rawUser.email,
      occupation: "Resident",
      bio: "Foyer Member",
      societyName: currentSociety?.name || "Foyer Smart Residence",
    };
  }, [rawUser, currentSociety]);

  const updateProfileMutation = useMutation({
    mutationFn: (dto: UpdateProfileRequestDto) => profileRepository.updateUserProfile(dto),
    onSuccess: (updatedUser) => {
      setUserSession(updatedUser, currentSociety);
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.all });
    },
  });

  return {
    profile,
    rawUser,
    isLoading,
    isRefetching,
    isError,
    error,
    refetch,
    handleUpdateProfile: (updates: UpdateProfileRequestDto) =>
      updateProfileMutation.mutateAsync(updates),
    isUpdating: updateProfileMutation.isPending,
  };
}
