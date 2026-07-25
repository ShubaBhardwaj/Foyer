import { useState } from "react";
import { CommunityEvent } from "../types/event.types";

export function useEventDetails(_eventId?: string) {
  const [event] = useState<CommunityEvent | null>(null);
  const [isLoading] = useState(false);

  return {
    event,
    isLoading,
    handleToggleRsvp: (_eventId?: string) => {},
  };
}
