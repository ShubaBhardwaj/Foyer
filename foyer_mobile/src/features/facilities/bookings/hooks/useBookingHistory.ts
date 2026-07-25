import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { amenityRepository } from "@/repositories/amenity.repository";
import { BookingItem, GroupedBookingHistory } from "../../shared/types/facility.types";

export function useBookingHistory() {
  const {
    data: rawBookings,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: queryKeys.bookings.list({ history: true }),
    queryFn: () => amenityRepository.fetchUserBookings(),
  });

  const groupedHistory = useMemo<GroupedBookingHistory[]>(() => {
    const list = rawBookings || [];
    const mapped: BookingItem[] = list.map((b) => ({
      id: b._id,
      _id: b._id,
      facilityId: typeof b.amenity === "object" && b.amenity ? b.amenity._id : String(b.amenity || ""),
      facilityName: typeof b.amenity === "object" && b.amenity ? b.amenity.name : "Facility",
      image: typeof b.amenity === "object" && b.amenity?.images?.[0] ? b.amenity.images[0] : "https://images.unsplash.com/photo-1574629810360-7efbbe195018",
      date: b.bookingDate,
      timeSlot: `${b.startTime} - ${b.endTime}`,
      status: (b.status === "CONFIRMED" ? "Upcoming" : b.status === "COMPLETED" ? "Completed" : b.status === "CANCELLED" ? "Cancelled" : "Active") as any,
      bookingCode: `BK-FYR-${b._id.slice(-4)}`,
      createdAt: b.createdAt,
    }));

    if (mapped.length === 0) return [];
    return [{ period: "Earlier", bookings: mapped }];
  }, [rawBookings]);

  return {
    history: rawBookings || [],
    groupedHistory,
    isLoading,
    isRefetching,
    refetch,
  };
}
