import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { amenityRepository } from "@/repositories/amenity.repository";
import { FacilityCategory, FacilityItem } from "../../shared/types/facility.types";

export function useFacilityDetails(facilityId: string) {
  const {
    data: rawFacility,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.amenities.detail(facilityId),
    queryFn: () => amenityRepository.fetchAmenityById(facilityId),
    enabled: !!facilityId,
  });

  const facility = useMemo<FacilityItem | undefined>(() => {
    if (!rawFacility) return undefined;
    return {
      id: rawFacility._id,
      _id: rawFacility._id,
      name: rawFacility.name,
      description: rawFacility.description,
      image: rawFacility.images && rawFacility.images[0] ? rawFacility.images[0] : "https://images.unsplash.com/photo-1574629810360-7efbbe195018",
      category: (rawFacility.category || "All") as FacilityCategory,
      status: rawFacility.isActive ? ("Available" as const) : ("Maintenance" as const),
      operatingHours: `${rawFacility.openingTime || "06:00 AM"} - ${rawFacility.closingTime || "10:00 PM"}`,
      capacity: `${rawFacility.capacity || 20} Persons`,
      bookingDuration: `${rawFacility.slotDurationMinutes || 60} mins`,
      bookingLimit: "Max 1 slot / day",
      rules: rawFacility.rules || ["Follow rules"],
      amenities: [rawFacility.category || "General"],
      gallery: rawFacility.images || [],
      nextAvailableSlot: "Available today",
    };
  }, [rawFacility]);

  return {
    facility,
    isLoading,
    isError,
    error,
    refetch,
  };
}
