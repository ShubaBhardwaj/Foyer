import React from "react";
import { View, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  AppScreen,
  AppCard,
  AppSectionHeader,
  AppButton,
  AppStatusPill,
  Title,
  Body,
  Caption,
  AppLoader,
} from "@/components/ui";
import { useAppTheme, spacing, radius } from "@/theme";
import {
  useEventDetails,
  CommunityHeader,
} from "@/features/community";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react-native";

export default function EventDetailsScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const { eventId } = useLocalSearchParams<{ eventId: string }>();

  const { event, isLoading, handleToggleRsvp } = useEventDetails(eventId);

  if (isLoading || !event) {
    return (
      <AppScreen scrollable={false}>
        {/* TODO: Replace with backend loading state */}
        <AppLoader mode="fullscreen" message="Loading event details..." />
      </AppScreen>
    );
  }

  return (
    <AppScreen scrollable={true} statusBarStyle="auto">
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <CommunityHeader
        title="Event Details"
        showBack={true}
        onBackPress={() => router.back()}
      />

      {/* ─── Event Banner Placeholder ───────────────────────────────────── */}
      <View style={[styles.bannerPlaceholder, { backgroundColor: theme.colors.primaryContainer }]}>
        <ImageIcon size={36} color={theme.colors.onPrimaryContainer} />
        <Caption style={{ color: theme.colors.onPrimaryContainer, marginTop: spacing.xs }}>
          High-Resolution Event Banner Placeholder
        </Caption>
      </View>

      {/* ─── Event Overview Card ────────────────────────────────────────── */}
      <AppCard variant="elevated" style={styles.card}>
        <View style={styles.titleRow}>
          <Title style={{ color: theme.colors.onSurface, flex: 1, fontSize: 20 }}>
            {event.title}
          </Title>
          {event.isUserRsvped && (
            <AppStatusPill status="approved" label="Attending" />
          )}
        </View>

        <Body style={{ color: theme.colors.onSurfaceVariant, marginTop: spacing.xs, lineHeight: 22 }}>
          {event.description}
        </Body>

        <AppSectionHeader title="Event Schedule & Location" />
        <View style={styles.infoGrid}>
          <View style={styles.infoRow}>
            <Calendar size={18} color={theme.colors.primary} />
            <View>
              <Caption style={{ color: theme.colors.outline }}>Event Date</Caption>
              <Body style={{ color: theme.colors.onSurface }}>{event.date}</Body>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Clock size={18} color={theme.colors.primary} />
            <View>
              <Caption style={{ color: theme.colors.outline }}>Timing Window</Caption>
              <Body style={{ color: theme.colors.onSurface }}>{event.time}</Body>
            </View>
          </View>

          <View style={styles.infoRow}>
            <MapPin size={18} color={theme.colors.primary} />
            <View>
              <Caption style={{ color: theme.colors.outline }}>Venue Location</Caption>
              <Body style={{ color: theme.colors.onSurface }}>{event.venue}</Body>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Users size={18} color={theme.colors.primary} />
            <View>
              <Caption style={{ color: theme.colors.outline }}>Attendance</Caption>
              <Body style={{ color: theme.colors.onSurface }}>
                {event.rsvpCount} Residents Attending {event.capacity ? `(Max Capacity: ${event.capacity})` : ""}
              </Body>
            </View>
          </View>
        </View>

        {/* ─── RSVP Action Button ────────────────────────────────────────── */}
        <View style={styles.rsvpContainer}>
          <AppButton
            label={event.isUserRsvped ? "Cancel My RSVP" : "Confirm RSVP — Attend Event"}
            variant={event.isUserRsvped ? "outlined" : "filled"}
            size="lg"
            leftIcon={CheckCircle2}
            onPress={handleToggleRsvp}
            fullWidth
          />
        </View>
      </AppCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  bannerPlaceholder: {
    height: 140,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: spacing.sm,
  },
  card: {
    marginVertical: spacing.xs,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  infoGrid: {
    gap: spacing.md,
    marginVertical: spacing.xs,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  rsvpContainer: {
    marginTop: spacing.lg,
  },
});
