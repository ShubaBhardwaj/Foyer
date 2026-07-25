import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { visitorRepository } from "@/repositories/visitor.repository";
import { VisitorStatus } from "@/types/api/visitor";

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
      : { _id: "", name: "Resident Host", flatNumber: "101", tower: "Tower A" };

    return {
      id: rawDetail._id,
      _id: rawDetail._id,
      name: rawDetail.name,
      phone: rawDetail.phone,
      purpose: rawDetail.purpose,
      vehicleNumber: rawDetail.vehicleNumber || "N/A",
      expectedDate: rawDetail.expectedDate || "Today",
      expectedTime: rawDetail.expectedTime || "Now",
      checkIn: rawDetail.checkInTime || "Not yet",
      checkOut: rawDetail.checkOutTime || "Not yet",
      visitorIdCode: rawDetail.passCode || `FYR-VIS-${rawDetail._id.slice(-4)}`,
      status: rawDetail.status.toLowerCase() as any,
      initials: rawDetail.name.slice(0, 2).toUpperCase(),
      rejectionReason: undefined,
      notes: undefined,
      resident: {
        name: host.name || "Resident Host",
        tower: host.tower || "Tower A",
        flat: host.flatNumber || "Flat 101",
        phone: "+91 99999 88888",
      },
    };
  }, [rawDetail]);

  const updateStatusMutation = useMutation({
    mutationFn: ({ status, reason }: { status: VisitorStatus; reason?: string }) =>
      visitorRepository.updateStatus(visitorId, status, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.visitors.detail(visitorId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.visitors.all });
    },
  });

  const handleApprove = () => updateStatusMutation.mutate({ status: "APPROVED" });
  const handleReject = (reason?: string) => updateStatusMutation.mutate({ status: "REJECTED", reason });
  const handleCheckIn = () => updateStatusMutation.mutate({ status: "CHECKED_IN" });
  const handleCheckOut = () => updateStatusMutation.mutate({ status: "CHECKED_OUT" });
  const handleMarkEntry = () => updateStatusMutation.mutate({ status: "CHECKED_IN" });

  return {
    detail,
    isLoading,
    isError,
    error,
    refetch,
    handleApprove,
    handleReject,
    handleCheckIn,
    handleCheckOut,
    handleMarkEntry,
    isUpdating: updateStatusMutation.isPending,
  };
}
