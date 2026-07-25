import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { profileRepository } from "@/repositories/profile.repository";
import { AddHouseholdMemberRequestDto } from "@/types/api/profile";
import { HouseholdMember } from "../../shared/types/profile.types";

export function useHousehold() {
  const queryClient = useQueryClient();

  const {
    data: rawMembers,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: queryKeys.profile.household(),
    queryFn: () => profileRepository.fetchHouseholdMembers(),
  });

  const members = useMemo<HouseholdMember[]>(() => {
    const list = rawMembers || [];
    return list.map((m) => ({
      id: m._id,
      name: m.name,
      role: m.relation === "SPOUSE" || m.relation === "CHILD" || m.relation === "PARENT" ? "Family Member" : m.relation === "TENANT" ? "Tenant" : "Resident",
      relationship: m.relation,
      phone: m.phone,
      isVerified: true,
      initials: m.name.slice(0, 2).toUpperCase(),
    }));
  }, [rawMembers]);

  const addMemberMutation = useMutation({
    mutationFn: (dto: AddHouseholdMemberRequestDto) => profileRepository.createHouseholdMember(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.household() });
    },
  });

  return {
    members,
    isLoading,
    isRefetching,
    refetch,
    addMember: (dto: AddHouseholdMemberRequestDto) => addMemberMutation.mutateAsync(dto),
    handleRemoveMember: (_id: string) => {},
    handleVerifyMember: (_id: string) => {},
    isAdding: addMemberMutation.isPending,
  };
}
