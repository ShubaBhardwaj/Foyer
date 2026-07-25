import { useState, useCallback } from "react";
import { availabilityTimeSlots } from "../../shared/data/facilityDummyData";
import { TimeSlotItem } from "../../shared/types/facility.types";

export function useAvailability(facilityId?: string) {
  const [selectedDate, setSelectedDate] = useState("Tomorrow, 26 Jul 2026");
  const [slots, setSlots] = useState<TimeSlotItem[]>(availabilityTimeSlots);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>("s02");
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectSlot = useCallback((slotId: string) => {
    setSelectedSlotId(slotId);
  }, []);

  const selectedSlot = slots.find((s) => s.id === selectedSlotId);

  return {
    selectedDate,
    setSelectedDate,
    slots,
    selectedSlotId,
    selectedSlot,
    isLoading,
    setIsLoading,
    handleSelectSlot,
  };
}
