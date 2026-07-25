import React from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { AppScreen, AppButton } from "@/components/ui";
import { spacing } from "@/theme";
import {
  useEvents,
  CommunityHeader,
  CommunitySearch,
  EventList,
} from "@/features/community";
import { CalendarPlus } from "lucide-react-native";

export default function EventsListScreen() {
  const router = useRouter();
  const { events, searchQuery, setSearchQuery, isLoading, handleToggleRsvp } = useEvents();

  return (
    <AppScreen scrollable={true} statusBarStyle="auto">
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <CommunityHeader
        title="Upcoming Events"
        showBack={true}
        onBackPress={() => router.back()}
      />

      {/* ─── Search Bar ─────────────────────────────────────────────────── */}
      <CommunitySearch
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search events by title, venue, or date..."
      />

      {/* ─── Events List ────────────────────────────────────────────────── */}
      <EventList
        events={events}
        onEventPress={(eventId) => router.push(`/(app)/(tabs)/(community)/events/${eventId}` as any)}
        onRsvpEvent={handleToggleRsvp}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onResetSearch={() => setSearchQuery("")}
        onCreateEvent={() => router.push("/(app)/(tabs)/(community)/events/create" as any)}
      />

      {/* ─── Floating Action Button ─────────────────────────────────────── */}
      <View style={styles.fabRow}>
        <AppButton
          label="+ Create Event"
          variant="filled"
          size="md"
          leftIcon={CalendarPlus}
          onPress={() => router.push("/(app)/(tabs)/(community)/events/create" as any)}
          fullWidth
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  fabRow: {
    marginVertical: spacing.md,
  },
});
