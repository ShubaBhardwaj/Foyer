import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import {
  AppScreen,
  AppTextField,
  AppButton,
  AppCard,
  AppSectionHeader,
} from "@/components/ui";
import { useAppTheme, spacing } from "@/theme";
import { CommunityHeader } from "@/features/community";
import {
  FileText,
  MessageSquare,
  MapPin,
  Calendar,
  Clock,
  Users,
  CalendarPlus,
} from "lucide-react-native";

export default function CreateEventScreen() {
  const theme = useAppTheme();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("Saturday, 02 Aug 2026");
  const [time, setTime] = useState("09:00 AM - 01:00 PM");
  const [capacity, setCapacity] = useState("100");
  const [organizer, setOrganizer] = useState("Managing Committee");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // TODO: Replace dummy event creation with POST /api/v1/community/events API call
    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsSubmitting(false);

    router.back();
  };

  return (
    <AppScreen scrollable={true} statusBarStyle="auto">
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <CommunityHeader
        title="Create Event"
        showBack={true}
        onBackPress={() => router.back()}
      />

      {/* ─── Event Details ──────────────────────────────────────────────── */}
      <AppSectionHeader title="Event Information" />
      <AppCard variant="outlined" style={styles.cardSection}>
        <AppTextField
          label="Event Title"
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Monsoon Tree Plantation Drive"
          leftIcon={FileText}
        />
        <AppTextField
          label="Event Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Describe event schedule, activities, and requirements..."
          multiline={true}
          leftIcon={MessageSquare}
        />
        <AppTextField
          label="Organizer Name"
          value={organizer}
          onChangeText={setOrganizer}
          leftIcon={Users}
        />
      </AppCard>

      {/* ─── Venue & Schedule ────────────────────────────────────────────── */}
      <AppSectionHeader title="Venue & Schedule" />
      <AppCard variant="outlined" style={styles.cardSection}>
        <AppTextField
          label="Venue / Location"
          value={venue}
          onChangeText={setVenue}
          placeholder="e.g. Clubhouse Auditorium (1st Floor)"
          leftIcon={MapPin}
        />
        <AppTextField
          label="Event Date"
          value={date}
          onChangeText={setDate}
          leftIcon={Calendar}
        />
        <AppTextField
          label="Event Time Window"
          value={time}
          onChangeText={setTime}
          leftIcon={Clock}
        />
        <AppTextField
          label="Maximum Capacity / Seats (Optional)"
          value={capacity}
          onChangeText={setCapacity}
          keyboardType="number-pad"
          leftIcon={Users}
        />
      </AppCard>

      {/* ─── Submit Action Button ──────────────────────────────────────── */}
      <View style={styles.submitContainer}>
        <AppButton
          label="Publish Event"
          variant="filled"
          size="lg"
          loading={isSubmitting}
          leftIcon={CalendarPlus}
          onPress={handleSubmit}
          fullWidth
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  cardSection: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  submitContainer: {
    marginVertical: spacing.lg,
  },
});
