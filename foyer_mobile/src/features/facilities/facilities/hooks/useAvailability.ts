import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { amenityRepository } from "@/repositories/amenity.repository";
import { TimeSlotItem } from "../../shared/types/facility.types";

export function useAvailability(facilityId: string, initialDate: string = "Today") {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const {
    data: rawSlots,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.amenities.slots(facilityId, selectedDate),
    queryFn: () => amenityRepository.fetchAvailableSlots(facilityId, selectedDate),
    enabled: !!facilityId,
  });

  const slots = useMemo<TimeSlotItem[]>(() => {
    const list = rawSlots || [];
    return list.map((s, idx) => ({
      id: `slot_${idx}_${s.startTime}`,
      time: `${s.startTime} - ${s.endTime}`,
      period: parseInt(s.startTime) < 12 ? "Morning" : parseInt(s.startTime) < 17 ? "Afternoon" : "Evening",
      isBooked: !s.isAvailable,
      isDisabled: !s.isAvailable,
    }));
  }, [rawSlots]);

  const selectedSlot = useMemo(() => {
    return slots.find((s) => s.id === selectedSlotId) || null;
  }, [slots, selectedSlotId]);

  return {
    slots,
    selectedDate,
    setSelectedDate,
    selectedSlotId,
    selectedSlot,
    handleSelectSlot: (slotId: string) => setSelectedSlotId(slotId),
    isLoading,
    isError,
    error,
    refetch,
  };
}
