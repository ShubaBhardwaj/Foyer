import { useState, useMemo, useCallback } from "react";
import { visitorDetailsMap } from "../data/visitorDummyData";
import { VisitorDetailRecord } from "../types";

export function useVisitorDetails(visitorId?: string) {
  const targetId = visitorId ?? "v001";

  // TODO: Replace with React Query fetch from GET /api/v1/visitors/:id
  const initialDetail = useMemo(() => {
    return visitorDetailsMap[targetId] ?? visitorDetailsMap["v001"];
  }, [targetId]);

  const [detail, setDetail] = useState<VisitorDetailRecord>(initialDetail);
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = useCallback(() => {
    // TODO: Call approve API endpoint
    setDetail((prev) => ({ ...prev, status: "approved" as const, checkIn: "Just now" }));
  }, []);

  const handleReject = useCallback((reason?: string) => {
    // TODO: Call reject API endpoint
    setDetail((prev) => ({
      ...prev,
      status: "rejected" as const,
      rejectionReason: reason ?? "Access denied by resident/admin.",
    }));
  }, []);

  const handleMarkEntry = useCallback(() => {
    // TODO: Call mark entry API endpoint
    setDetail((prev) => ({ ...prev, checkIn: "Just now" }));
  }, []);

  return {
    detail,
    isLoading,
    setIsLoading,
    handleApprove,
    handleReject,
    handleMarkEntry,
  };
}
