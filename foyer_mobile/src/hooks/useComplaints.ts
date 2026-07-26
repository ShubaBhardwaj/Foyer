import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { complaintRepository } from "@/repositories/complaint.repository";
import { CreateComplaintRequestDto } from "@/types/api/complaint";

export function useComplaints() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const queryClient = useQueryClient();

  const queryParams = useMemo(() => {
    const params: { status?: string; search?: string } = {};
    if (searchQuery.trim()) params.search = searchQuery.trim();
    if (statusFilter !== "All") params.status = statusFilter.toUpperCase();
    return params;
  }, [searchQuery, statusFilter]);

  const {
    data,
    isLoading,
    isRefetching,
    refetch,
    isError,
    error,
  } = useQuery({
    queryKey: queryKeys.complaints.list(queryParams),
    queryFn: () => complaintRepository.fetchComplaintsList(queryParams),
  });

  const createComplaintMutation = useMutation({
    mutationFn: (dto: CreateComplaintRequestDto) => complaintRepository.submitComplaint(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.complaints.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },
  });

  const resolveComplaintMutation = useMutation({
    mutationFn: ({ id, resolutionNotes }: { id: string; resolutionNotes?: string }) =>
      complaintRepository.resolveComplaint(id, resolutionNotes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.complaints.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },
  });

  return {
    complaints: data?.complaints || [],
    pagination: data?.pagination,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    isLoading,
    isRefetching,
    isError,
    error,
    refetch,
    createComplaint: (dto: CreateComplaintRequestDto) => createComplaintMutation.mutateAsync(dto),
    isSubmitting: createComplaintMutation.isPending,
    resolveComplaint: (id: string, resolutionNotes?: string) =>
      resolveComplaintMutation.mutateAsync({ id, resolutionNotes }),
    isResolving: resolveComplaintMutation.isPending,
  };
}

export function useComplaintDetails(complaintId: string) {
  const queryClient = useQueryClient();

  const {
    data: complaint,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.complaints.detail(complaintId),
    queryFn: () => complaintRepository.fetchComplaintById(complaintId),
    enabled: !!complaintId,
  });

  const resolveComplaintMutation = useMutation({
    mutationFn: (resolutionNotes?: string) => complaintRepository.resolveComplaint(complaintId, resolutionNotes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.complaints.detail(complaintId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.complaints.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },
  });

  return {
    complaint,
    isLoading,
    isError,
    error,
    refetch,
    resolveComplaint: (resolutionNotes?: string) => resolveComplaintMutation.mutateAsync(resolutionNotes),
    isResolving: resolveComplaintMutation.isPending,
  };
}

