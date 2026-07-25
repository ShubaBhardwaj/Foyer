import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { amenityRepository } from "@/repositories/amenity.repository";
import { CreateBookingRequestDto } from "@/types/api/booking";
import { BookingItem, BookingStatus } from "../../shared/types/facility.types";

export function useBookings() {
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const queryClient = useQueryClient();

  const {
    data: rawBookings,
    isLoading,
    isRefetching,
    refetch,
    isError,
    error,
  } = useQuery({
    queryKey: queryKeys.bookings.list(),
    queryFn: () => amenityRepository.fetchUserBookings(),
  });

  const bookings = useMemo<BookingItem[]>(() => {
    const list = rawBookings || [];
    const mapped = list.map((b) => ({
      id: b._id,
      _id: b._id,
      facilityId: typeof b.amenity === "object" && b.amenity ? b.amenity._id : String(b.amenity || ""),
      facilityName: typeof b.amenity === "object" && b.amenity ? b.amenity.name : "Facility",
      image: typeof b.amenity === "object" && b.amenity?.images?.[0] ? b.amenity.images[0] : "https://images.unsplash.com/photo-1574629810360-7efbbe195018",
      date: b.bookingDate,
      timeSlot: `${b.startTime} - ${b.endTime}`,
      status: (b.status === "CONFIRMED" ? "Upcoming" : b.status === "COMPLETED" ? "Completed" : b.status === "CANCELLED" ? "Cancelled" : "Active") as BookingStatus,
      bookingCode: `BK-FYR-${b._id.slice(-4)}`,
      createdAt: b.createdAt,
    }));

    if (selectedFilter === "All") return mapped;
    return mapped.filter((item) => item.status.toLowerCase() === selectedFilter.toLowerCase());
  }, [rawBookings, selectedFilter]);

  const createBookingMutation = useMutation({
    mutationFn: (dto: CreateBookingRequestDto) => amenityRepository.createBooking(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.amenities.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },
  });

  const cancelBookingMutation = useMutation({
    mutationFn: ({ bookingId, reason }: { bookingId: string; reason?: string }) =>
      amenityRepository.cancelBooking(bookingId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },
  });

  return {
    bookings,
    selectedFilter,
    setSelectedFilter,
    isLoading,
    isRefetching,
    isError,
    error,
    refetch,
    createBooking: (dto: CreateBookingRequestDto) => createBookingMutation.mutateAsync(dto),
    isCreating: createBookingMutation.isPending,
    cancelBooking: (bookingId: string, reason?: string) =>
      cancelBookingMutation.mutateAsync({ bookingId, reason }),
    handleCancelBooking: (bookingId: string, reason?: string) =>
      cancelBookingMutation.mutateAsync({ bookingId, reason }),
    isCancelling: cancelBookingMutation.isPending,
  };
}
