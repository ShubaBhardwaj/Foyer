import { useState, useMemo } from "react";
import { facilitiesData, facilityCategories } from "../../shared/data/facilityDummyData";
import { FacilityCategory, FacilityItem } from "../../shared/types/facility.types";

export function useFacilities() {
  const [facilities, setFacilities] = useState<FacilityItem[]>(facilitiesData);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<FacilityCategory>("All");
  const [isLoading, setIsLoading] = useState(false);

  const filteredFacilities = useMemo(() => {
    return facilities.filter((fac) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        fac.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fac.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fac.category.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedCategory === "All") return true;
      return fac.category === selectedCategory;
    });
  }, [facilities, searchQuery, selectedCategory]);

  return {
    facilities: filteredFacilities,
    rawCount: facilities.length,
    categories: facilityCategories,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    isLoading,
    setIsLoading,
  };
}
