import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { visitorRepository } from "@/repositories/visitor.repository";
import { VisitorStatus } from "@/types/api/visitor";

export function useVisitors() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const queryClient = useQueryClient();

  const queryParams = useMemo(() => {
    const params: { status?: string; search?: string } = {};
    if (searchQuery.trim()) params.search = searchQuery.trim();
    if (selectedFilter !== "All" && selectedFilter !== "Today's" && selectedFilter !== "Pre Approved") {
      params.status = selectedFilter.toUpperCase();
    }
    return params;
  }, [searchQuery, selectedFilter]);

  const {
    data,
    isLoading,
    isRefetching,
    refetch,
    isError,
    error,
  } = useQuery({
    queryKey: queryKeys.visitors.list(queryParams),
    queryFn: () => visitorRepository.fetchVisitorsList(queryParams),
  });

  const visitors = useMemo(() => {
    const list = data?.visitors || [];
    return list.map((v) => ({
      id: v._id,
      _id: v._id,
      name: v.name,
      phone: v.phone,
      purpose: v.purpose,
      unit: typeof v.hostUser === "object" && v.hostUser?.flatNumber ? `${v.hostUser.tower || ""} - ${v.hostUser.flatNumber}` : "Unit 101",
      timeAgo: v.expectedTime || "Today",
      status: v.status.toLowerCase() as any,
      initials: v.name.slice(0, 2).toUpperCase(),
      vehicleNumber: v.vehicleNumber,
      expectedTime: v.expectedTime,
    }));
  }, [data?.visitors]);

  const guests = useMemo(() => {
    return visitors.filter((v) => v.status === "approved").map((v) => ({
      id: v.id,
      guestName: v.name,
      phone: v.phone,
      purpose: v.purpose,
      vehicleNumber: v.vehicleNumber,
      residentName: "Resident Host",
      unit: v.unit,
      validUntil: "Midnight",
      validDate: "Today",
      validTime: "23:59",
      status: "approved" as const,
      passCode: `CODE-${v.id.slice(-4)}`,
      initials: v.initials,
    }));
  }, [visitors]);

  const statistics = useMemo(() => [
    { id: "s1", title: "Total Today", value: String(visitors.length), caption: "Expected entries", iconName: "Users" as const },
    { id: "s2", title: "Checked In", value: String(visitors.filter(v => v.status === "checked_in").length), caption: "Currently inside", iconName: "UserCheck" as const },
    { id: "s3", title: "Pending", value: String(visitors.filter(v => v.status === "pending").length), caption: "Awaiting approval", iconName: "Clock" as const },
    { id: "s4", title: "Rejected", value: String(visitors.filter(v => v.status === "rejected").length), caption: "Access denied", iconName: "UserX" as const },
  ], [visitors]);

  const filters = ["All", "Pending", "Approved", "Rejected", "Today's", "Pre Approved"];

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, reason }: { id: string; status: VisitorStatus; reason?: string }) =>
      visitorRepository.updateStatus(id, status, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.visitors.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },
  });

  const createVisitorMutation = useMutation({
    mutationFn: (dto: any) => visitorRepository.createVisitorPass(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.visitors.all });
    },
  });

  return {
    searchQuery,
    setSearchQuery,
    selectedFilter,
    setSelectedFilter,
    filters,
    statistics,
    visitors,
    rawVisitorsCount: visitors.length,
    guests,
    isLoading,
    isRefetching,
    isError,
    error,
    refetch,
    handleApproveVisitor: (id: string) => updateStatusMutation.mutate({ id, status: "APPROVED" }),
    handleRejectVisitor: (id: string, reason?: string) => updateStatusMutation.mutate({ id, status: "REJECTED", reason }),
    handleCheckInVisitor: (id: string) => updateStatusMutation.mutate({ id, status: "CHECKED_IN" }),
    handleCheckOutVisitor: (id: string) => updateStatusMutation.mutate({ id, status: "CHECKED_OUT" }),
    createVisitor: (dto: any) => createVisitorMutation.mutateAsync(dto),
    isUpdating: updateStatusMutation.isPending,
  };
}
