import { useState, useMemo, useCallback } from "react";
import { communityEvents } from "../../shared/data/communityDummyData";
import { CommunityEvent } from "../types/event.types";

export function useEvents() {
  const [events, setEvents] = useState<CommunityEvent[]>(communityEvents);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const filteredEvents = useMemo(() => {
    return events.filter(
      (event) =>
        searchQuery.trim() === "" ||
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.organizer.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [events, searchQuery]);

  const handleToggleRsvp = useCallback((eventId: string) => {
    // TODO: Call API endpoint POST /api/v1/community/events/:id/rsvp
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? {
              ...e,
              isUserRsvped: !e.isUserRsvped,
              rsvpCount: e.isUserRsvped ? e.rsvpCount - 1 : e.rsvpCount + 1,
            }
          : e
      )
    );
  }, []);

  return {
    events: filteredEvents,
    rawEventsCount: events.length,
    searchQuery,
    setSearchQuery,
    isLoading,
    setIsLoading,
    handleToggleRsvp,
  };
}
