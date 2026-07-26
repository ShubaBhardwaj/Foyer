import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { visitorRepository } from "@/repositories/visitor.repository";

export function useVisitorDetails(visitorId: string) {
  const queryClient = useQueryClient();

  const {
    data: rawDetail,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.visitors.detail(visitorId),
    queryFn: () => visitorRepository.fetchVisitorById(visitorId),
    enabled: !!visitorId,
  });

  const detail = useMemo(() => {
    if (!rawDetail) return undefined;

    const host = typeof rawDetail.hostUser === "object" && rawDetail.hostUser !== null
      ? rawDetail.hostUser
      : typeof rawDetail.resident === "object" && rawDetail.resident !== null
      ? rawDetail.resident
      : { _id: "", name: "Resident Host", flatNumber: "101", tower: "Tower A" };

    const name = rawDetail.fullName || rawDetail.name || "Visitor";
    const phone = rawDetail.phoneNumber || rawDetail.phone || "";

    return {
      id: rawDetail._id,
      _id: rawDetail._id,
      name,
      phone,
      purpose: rawDetail.purpose || "Visit",
      vehicleNumber: rawDetail.vehicleNumber || "N/A",
      expectedDate: rawDetail.expectedArrival || rawDetail.expectedDate || "Today",
      expectedTime: rawDetail.expectedTime || "Now",
      checkIn: rawDetail.checkInTime || "Not yet",
      checkOut: rawDetail.checkOutTime || "Not yet",
      visitorIdCode: rawDetail.entryCode || rawDetail.passCode || `FYR-VIS-${rawDetail._id.slice(-4)}`,
      status: rawDetail.status.toLowerCase() as any,
      initials: name.slice(0, 2).toUpperCase(),
      rejectionReason: rawDetail.statusRemark,
      notes: undefined,
      resident: {
        name: host.name || "Resident Host",
        tower: host.tower || "Tower A",
        flat: host.flatNumber || "Flat 101",
        phone: "+91 99999 88888",
      },
    };
  }, [rawDetail]);

  const approveMutation = useMutation({
    mutationFn: (statusRemark?: string) =>
      visitorRepository.approveVisitor(visitorId, statusRemark),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.visitors.detail(visitorId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.visitors.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (statusRemark: string) =>
      visitorRepository.rejectVisitor(visitorId, statusRemark),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.visitors.detail(visitorId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.visitors.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (statusRemark?: string) =>
      visitorRepository.cancelVisitor(visitorId, statusRemark),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.visitors.detail(visitorId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.visitors.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },
  });

  const checkInMutation = useMutation({
    mutationFn: (entryCode?: string) =>
      visitorRepository.checkInVisitor(visitorId, entryCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.visitors.detail(visitorId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.visitors.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },
  });

  const checkOutMutation = useMutation({
    mutationFn: () => visitorRepository.checkOutVisitor(visitorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.visitors.detail(visitorId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.visitors.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },
  });

  return {
    detail,
    isLoading,
    isError,
    error,
    refetch,
    handleApprove: (statusRemark?: string) => approveMutation.mutate(statusRemark),
    handleReject: (statusRemark: string = "Request rejected by resident") => rejectMutation.mutate(statusRemark),
    handleCancel: (statusRemark?: string) => cancelMutation.mutate(statusRemark),
    handleCheckIn: (entryCode?: string) => checkInMutation.mutate(entryCode),
    handleCheckOut: () => checkOutMutation.mutate(),
    handleMarkEntry: (entryCode?: string) => checkInMutation.mutate(entryCode),
    isUpdating:
      approveMutation.isPending ||
      rejectMutation.isPending ||
      cancelMutation.isPending ||
      checkInMutation.isPending ||
      checkOutMutation.isPending,
  };
}
