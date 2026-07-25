import { useState, useMemo, useCallback } from "react";
import { userBookings } from "../../shared/data/facilityDummyData";
import { BookingItem, BookingStatus } from "../../shared/types/facility.types";

export function useBookings() {
  const [bookings, setBookings] = useState<BookingItem[]>(userBookings);
  const [selectedFilter, setSelectedFilter] = useState<"All" | BookingStatus>("All");
  const [isLoading, setIsLoading] = useState(false);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (selectedFilter === "All") return true;
      return b.status === selectedFilter;
    });
  }, [bookings, selectedFilter]);

  const handleCancelBooking = useCallback((bookingId: string) => {
    // TODO: Call API endpoint POST /api/v1/bookings/:id/cancel
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: "Cancelled" as const } : b))
    );
  }, []);

  return {
    bookings: filteredBookings,
    rawCount: bookings.length,
    selectedFilter,
    setSelectedFilter,
    isLoading,
    setIsLoading,
    handleCancelBooking,
  };
}
