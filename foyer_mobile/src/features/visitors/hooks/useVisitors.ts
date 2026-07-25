import { useState, useMemo, useCallback } from "react";
import {
  visitorRequests as dummyVisitorRequests,
  visitorStatistics as dummyVisitorStatistics,
  visitorFilters as dummyVisitorFilters,
  preApprovedGuests as dummyPreApprovedGuests,
} from "../data/visitorDummyData";
import { VisitorFilterCategory, VisitorRequest, PreApprovedGuest } from "../types";

export function useVisitors() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<VisitorFilterCategory>("All");
  const [visitors, setVisitors] = useState<VisitorRequest[]>(dummyVisitorRequests);
  const [guests, setGuests] = useState<PreApprovedGuest[]>(dummyPreApprovedGuests);
  const [isLoading, setIsLoading] = useState(false);

  // TODO: Replace dummy data filtering with React Query hook / backend response
  const filteredVisitors = useMemo(() => {
    return visitors.filter((v) => {
      // 1. Search Query Filter
      const matchesSearch =
        searchQuery.trim() === "" ||
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.vehicleNumber && v.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()));

      // 2. Chip Filter Category
      if (!matchesSearch) return false;

      switch (selectedFilter) {
        case "Pending":
          return v.status === "pending";
        case "Approved":
          return v.status === "approved";
        case "Rejected":
          return v.status === "rejected";
        case "Today's":
          return true; // Mocked as today's entries
        case "Pre Approved":
          return false; // Handled separately or filtered
        default:
          return true;
      }
    });
  }, [visitors, searchQuery, selectedFilter]);

  const filteredGuests = useMemo(() => {
    return guests.filter((g) => {
      return (
        searchQuery.trim() === "" ||
        g.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.residentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.unit.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [guests, searchQuery]);

  const handleApproveVisitor = useCallback((visitorId: string) => {
    // TODO: Call approve visitor API endpoint
    setVisitors((prev) =>
      prev.map((v) => (v.id === visitorId ? { ...v, status: "approved" as const } : v))
    );
  }, []);

  const handleRejectVisitor = useCallback((visitorId: string) => {
    // TODO: Call reject visitor API endpoint
    setVisitors((prev) =>
      prev.map((v) => (v.id === visitorId ? { ...v, status: "rejected" as const } : v))
    );
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    selectedFilter,
    setSelectedFilter,
    filters: dummyVisitorFilters,
    statistics: dummyVisitorStatistics,
    visitors: filteredVisitors,
    rawVisitorsCount: visitors.length,
    guests: filteredGuests,
    isLoading,
    setIsLoading,
    handleApproveVisitor,
    handleRejectVisitor,
  };
}
