import React from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { AppScreen, AppSectionHeader } from "@/components/ui";
import { spacing } from "@/theme";
import {
  useNotificationSettings,
  ProfileSection,
  ToggleRow,
} from "@/features/profile";

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const { preferences, handleToggle } = useNotificationSettings();

  return (
    <AppScreen scrollable={true} statusBarStyle="auto">
      {/* ─── Header Section ─────────────────────────────────────────────── */}
      <ProfileSection title="Notification Preferences">
        <ToggleRow
          label="Visitor Entry & Gate Alerts"
          description="Instant push notifications for visitor check-in requests at security kiosk"
          value={preferences.visitorAlerts}
          onValueChange={() => handleToggle("visitorAlerts")}
        />
        <ToggleRow
          label="Amenity Booking Updates"
          description="Confirmations, reminder alerts, and slot availability updates"
          value={preferences.bookingUpdates}
          onValueChange={() => handleToggle("bookingUpdates")}
        />
        <ToggleRow
          label="Community Discussion Posts"
          description="New posts, replies, and reactions on society threads"
          value={preferences.communityPosts}
          onValueChange={() => handleToggle("communityPosts")}
        />
        <ToggleRow
          label="Resident Polls & Voting"
          description="Notifications for new polls and voting deadline reminders"
          value={preferences.polls}
          onValueChange={() => handleToggle("polls")}
        />
        <ToggleRow
          label="Society Events & RSVPs"
          description="Event announcements, schedule changes, and RSVP alerts"
          value={preferences.events}
          onValueChange={() => handleToggle("events")}
        />
        <ToggleRow
          label="Maintenance & Elevator Alerts"
          description="Important breakdown, cleaning, and water supply shutdown notices"
          value={preferences.maintenance}
          onValueChange={() => handleToggle("maintenance")}
        />
        <ToggleRow
          label="Official Announcements"
          description="Managing Committee emergency broadcasts"
          value={preferences.announcements}
          onValueChange={() => handleToggle("announcements")}
        />
        <ToggleRow
          label="Marketing & Promotional Offerings"
          description="Nearby partner offers and local vendor updates"
          value={preferences.marketing}
          divider={false}
          onValueChange={() => handleToggle("marketing")}
        />
      </ProfileSection>
    </AppScreen>
  );
}

const styles = StyleSheet.create({});
