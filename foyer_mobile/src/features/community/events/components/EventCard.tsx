import React from "react";
import { View, StyleSheet } from "react-native";
import {
  AppCard,
  Title,
  Body,
  Caption,
  AppButton,
  AppStatusPill,
} from "@/components/ui";
import { useAppTheme, spacing, radius } from "@/theme";
import { Calendar, MapPin, Clock, Users, Image as ImageIcon, CheckCircle2 } from "lucide-react-native";
import { CommunityEvent } from "../types/event.types";

interface EventCardProps {
  event: CommunityEvent;
  onPress: (eventId: string) => void;
  onRsvp?: (eventId: string) => void;
}

export const EventCard = React.memo(function EventCard({
  event,
  onPress,
  onRsvp,
}: EventCardProps) {
  const theme = useAppTheme();

  return (
    <AppCard
      variant="elevated"
      onPress={() => onPress(event.id)}
      style={styles.card}
      accessibilityLabel={`Event: ${event.title}`}
    >
      {/* Banner image placeholder */}
      <View style={[styles.bannerPlaceholder, { backgroundColor: theme.colors.primaryContainer }]}>
        <ImageIcon size={28} color={theme.colors.onPrimaryContainer} />
        <Caption style={{ color: theme.colors.onPrimaryContainer, marginLeft: spacing.xs }}>
          Event Banner Image Placeholder
        </Caption>
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Title style={{ color: theme.colors.onSurface, flex: 1, fontSize: 17 }}>
            {event.title}
          </Title>
          {event.isUserRsvped && (
            <AppStatusPill status="approved" label="Attending" />
          )}
        </View>

        <Body style={{ color: theme.colors.onSurfaceVariant, marginTop: spacing.xs }} numberOfLines={2}>
          {event.description}
        </Body>

        <View style={styles.infoGrid}>
          <View style={styles.infoRow}>
            <Calendar size={16} color={theme.colors.primary} />
            <Caption style={{ color: theme.colors.onSurface }}>{event.date}</Caption>
          </View>

          <View style={styles.infoRow}>
            <Clock size={16} color={theme.colors.primary} />
            <Caption style={{ color: theme.colors.onSurface }}>{event.time}</Caption>
          </View>

          <View style={styles.infoRow}>
            <MapPin size={16} color={theme.colors.primary} />
            <Caption style={{ color: theme.colors.onSurface }}>{event.venue}</Caption>
          </View>

          <View style={styles.infoRow}>
            <Users size={16} color={theme.colors.primary} />
            <Caption style={{ color: theme.colors.onSurface }}>
              {event.rsvpCount} Attending {event.capacity ? `/ ${event.capacity} Capacity` : ""}
            </Caption>
          </View>
        </View>

        <View style={styles.footer}>
          <Caption style={{ color: theme.colors.outline }}>
            By {event.organizer}
          </Caption>
          {onRsvp && (
            <AppButton
              label={event.isUserRsvped ? "Cancel RSVP" : "RSVP Now"}
              variant={event.isUserRsvped ? "outlined" : "filled"}
              size="sm"
              leftIcon={CheckCircle2}
              onPress={() => onRsvp(event.id)}
            />
          )}
        </View>
      </View>
    </AppCard>
  );
});

const styles = StyleSheet.create({
  card: {
    padding: 0,
    marginVertical: spacing.xs,
    overflow: "hidden",
  },
  bannerPlaceholder: {
    height: 110,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  content: {
    padding: spacing.md,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  infoGrid: {
    gap: spacing.xs,
    marginVertical: spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.xs,
  },
});
