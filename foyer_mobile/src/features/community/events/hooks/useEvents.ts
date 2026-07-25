import { useState } from "react";
import { CommunityEvent } from "../types/event.types";

export function useEvents() {
  const [events] = useState<CommunityEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading] = useState(false);

  return {
    events,
    searchQuery,
    setSearchQuery,
    isLoading,
    handleToggleRsvp: (_eventId: string) => {},
  };
}
