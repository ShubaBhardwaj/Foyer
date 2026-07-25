import React from "react";
import { View, StyleSheet } from "react-native";
import { AppLoader } from "@/components/ui";
import { EventCard } from "./EventCard";
import { CommunityEmptyState } from "../../shared/components/CommunityEmptyState";
import { CommunityEvent } from "../types/event.types";

interface EventListProps {
  events: CommunityEvent[];
  onEventPress: (eventId: string) => void;
  onRsvpEvent?: (eventId: string) => void;
  isLoading?: boolean;
  searchQuery?: string;
  onResetSearch?: () => void;
  onCreateEvent?: () => void;
}

export const EventList = React.memo(function EventList({
  events,
  onEventPress,
  onRsvpEvent,
  isLoading = false,
  searchQuery,
  onResetSearch,
  onCreateEvent,
}: EventListProps) {
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        {/* TODO: Replace with backend loading state */}
        <AppLoader mode="skeleton" skeletonVariant="card" />
        <AppLoader mode="skeleton" skeletonVariant="card" />
      </View>
    );
  }

  if (events.length === 0) {
    return (
      <CommunityEmptyState
        type={searchQuery ? "search" : "events"}
        query={searchQuery}
        onResetSearch={onResetSearch}
        onActionPress={onCreateEvent}
      />
    );
  }

  return (
    <View style={styles.listContainer}>
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onPress={onEventPress}
          onRsvp={onRsvpEvent}
        />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  loadingContainer: {
    marginVertical: 12,
    gap: 12,
  },
  listContainer: {
    marginVertical: 4,
    gap: 8,
  },
});
