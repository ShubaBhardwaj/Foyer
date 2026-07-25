import { useState, useMemo, useCallback } from "react";
import { communityEvents } from "../../shared/data/communityDummyData";
import { CommunityEvent } from "../types/event.types";

export function useEventDetails(eventId?: string) {
  const targetId = eventId ?? "event_001";

  const initialEvent = useMemo(() => {
    return communityEvents.find((e) => e.id === targetId) ?? communityEvents[0];
  }, [targetId]);

  const [event, setEvent] = useState<CommunityEvent>(initialEvent);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleRsvp = useCallback(() => {
    // TODO: Call RSVP API endpoint
    setEvent((prev) => ({
      ...prev,
      isUserRsvped: !prev.isUserRsvped,
      rsvpCount: prev.isUserRsvped ? prev.rsvpCount - 1 : prev.rsvpCount + 1,
    }));
  }, []);

  return {
    event,
    isLoading,
    setIsLoading,
    handleToggleRsvp,
  };
}
