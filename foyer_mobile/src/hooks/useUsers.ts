import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userRepository } from "@/repositories/user.repository";
import { CreateResidentRequestDto, CreateGuardRequestDto } from "@/api/user.api";
import { queryKeys } from "@/lib/query-keys";

export function useUsers() {
  const queryClient = useQueryClient();

  const usersQuery = useQuery({
    queryKey: ["users", "list"],
    queryFn: () => userRepository.fetchUsersList(),
    staleTime: 30_000,
  });

  const createResidentMutation = useMutation({
    mutationFn: (dto: CreateResidentRequestDto) => userRepository.registerResident(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const createGuardMutation = useMutation({
    mutationFn: (dto: CreateGuardRequestDto) => userRepository.registerGuard(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return {
    users: usersQuery.data || [],
    isLoading: usersQuery.isLoading,
    isRefetching: usersQuery.isRefetching,
    refetch: usersQuery.refetch,
    createResident: createResidentMutation.mutateAsync,
    isCreatingResident: createResidentMutation.isPending,
    createGuard: createGuardMutation.mutateAsync,
    isCreatingGuard: createGuardMutation.isPending,
  };
}
