import { useState, useMemo } from "react";
import { facilitiesData } from "../../shared/data/facilityDummyData";
import { FacilityItem } from "../../shared/types/facility.types";

export function useFacilityDetails(facilityId?: string) {
  const targetId = facilityId ?? "fac_001";

  const initialFacility = useMemo(() => {
    return facilitiesData.find((f) => f.id === targetId) ?? facilitiesData[0];
  }, [targetId]);

  const [facility, setFacility] = useState<FacilityItem>(initialFacility);
  const [isLoading, setIsLoading] = useState(false);

  return {
    facility,
    isLoading,
    setIsLoading,
  };
}
