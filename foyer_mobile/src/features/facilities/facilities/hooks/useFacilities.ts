import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { amenityRepository } from "@/repositories/amenity.repository";
import { FacilityCategory, FacilityItem } from "../../shared/types/facility.types";

export function useFacilities() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<FacilityCategory>("All");

  const {
    data: amenities,
    isLoading,
    isRefetching,
    refetch,
    isError,
    error,
  } = useQuery({
    queryKey: queryKeys.amenities.list(),
    queryFn: () => amenityRepository.fetchAmenitiesList(),
  });

  const categories: FacilityCategory[] = [
    "All",
    "Sports",
    "Indoor",
    "Outdoor",
    "Club",
    "Fitness",
    "Kids",
    "Events",
  ];

  const facilities = useMemo<FacilityItem[]>(() => {
    const list = amenities || [];
    return list
      .map((item) => ({
        id: item._id,
        _id: item._id,
        name: item.name,
        description: item.description,
        image: item.images && item.images[0] ? item.images[0] : "https://images.unsplash.com/photo-1574629810360-7efbbe195018",
        category: (item.category || "All") as FacilityCategory,
        status: item.isActive ? ("Available" as const) : ("Maintenance" as const),
        operatingHours: `${item.openingTime || "06:00 AM"} - ${item.closingTime || "10:00 PM"}`,
        capacity: `${item.capacity || 20} Persons`,
        bookingDuration: `${item.slotDurationMinutes || 60} mins`,
        bookingLimit: "Max 1 slot / day",
        rules: item.rules || ["Follow rules"],
        amenities: [item.category || "General"],
        gallery: item.images || [],
        nextAvailableSlot: "Available today",
      }))
      .filter((item) => {
        const matchesSearch =
          searchQuery.trim() === "" ||
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCat =
          selectedCategory === "All" ||
          item.category.toLowerCase() === selectedCategory.toLowerCase();

        return matchesSearch && matchesCat;
      });
  }, [amenities, searchQuery, selectedCategory]);

  return {
    facilities,
    categories,
    rawCount: (amenities || []).length,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    isLoading,
    isRefetching,
    isError,
    error,
    refetch,
  };
}
