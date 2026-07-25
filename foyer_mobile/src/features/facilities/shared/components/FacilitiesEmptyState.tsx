import React from "react";
import { AppEmptyState } from "@/components/ui";
import { Building2, SearchX, CalendarX, History } from "lucide-react-native";

interface FacilitiesEmptyStateProps {
  type?: "facilities" | "bookings" | "history" | "search";
  query?: string;
  onResetSearch?: () => void;
  onActionPress?: () => void;
}

export const FacilitiesEmptyState = React.memo(function FacilitiesEmptyState({
  type = "facilities",
  query,
  onResetSearch,
  onActionPress,
}: FacilitiesEmptyStateProps) {
  if (type === "search") {
    return (
      <AppEmptyState
        icon={SearchX}
        title="No Facilities Found"
        description={
          query
            ? `No amenities match "${query}". Try adjusting your search query or selected category.`
            : "No amenities match your selected category filter."
        }
        actionLabel={onResetSearch ? "Clear Search Filters" : undefined}
        onActionPress={onResetSearch}
      />
    );
  }

  if (type === "bookings") {
    return (
      <AppEmptyState
        icon={CalendarX}
        title="No Active Bookings"
        description="You have no upcoming or active amenity reservations."
        actionLabel={onActionPress ? "Explore Facilities to Book" : undefined}
        onActionPress={onActionPress}
      />
    );
  }

  if (type === "history") {
    return (
      <AppEmptyState
        icon={History}
        title="No Booking History"
        description="Past facility reservation history will appear here."
      />
    );
  }

  return (
    <AppEmptyState
      icon={Building2}
      title="No Society Facilities Available"
      description="Facility amenities list is currently empty."
    />
  );
});
