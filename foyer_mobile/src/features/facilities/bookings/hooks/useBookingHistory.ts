import { useState } from "react";
import { bookingHistoryData } from "../../shared/data/facilityDummyData";
import { GroupedBookingHistory } from "../../shared/types/facility.types";

export function useBookingHistory() {
  const [groupedHistory] = useState<GroupedBookingHistory[]>(bookingHistoryData);
  const [isLoading, setIsLoading] = useState(false);

  return {
    groupedHistory,
    isLoading,
    setIsLoading,
  };
}
