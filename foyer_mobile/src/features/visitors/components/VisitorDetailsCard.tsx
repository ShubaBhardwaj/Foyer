import React from "react";
import { View, StyleSheet } from "react-native";
import {
  AppCard,
  AppAvatar,
  AppStatusPill,
  Subtitle,
  Body,
  Caption,
  AppDivider,
} from "@/components/ui";
import { useAppTheme, spacing } from "@/theme";
import {
  Phone,
  Calendar,
  Clock,
  Car,
  FileText,
  ShieldCheck,
  Hash,
} from "lucide-react-native";
import { VisitorDetailRecord } from "../types";

interface VisitorDetailsCardProps {
  detail: VisitorDetailRecord;
}

export const VisitorDetailsCard = React.memo(function VisitorDetailsCard({
  detail,
}: VisitorDetailsCardProps) {
  const theme = useAppTheme();

  return (
    <AppCard variant="elevated" style={styles.cardContainer}>
      {/* 1. Header Profile */}
      <View style={styles.avatarHeader}>
        <AppAvatar mode="initials" initials={detail.initials} size="xl" />
        <Subtitle style={{ marginTop: spacing.sm, fontSize: 18, color: theme.colors.onSurface }}>
          {detail.name}
        </Subtitle>
        <View style={{ marginTop: spacing.xs }}>
          <AppStatusPill status={detail.status} />
        </View>
      </View>

      <AppDivider style={{ marginVertical: spacing.md }} />

      {/* 2. Information Fields */}
      <View style={styles.fieldsGrid}>
        <View style={styles.fieldRow}>
          <Phone size={18} color={theme.colors.primary} />
          <View style={styles.fieldTextContainer}>
            <Caption style={{ color: theme.colors.outline }}>Phone Number</Caption>
            <Body style={{ color: theme.colors.onSurface }}>{detail.phone}</Body>
          </View>
        </View>

        <View style={styles.fieldRow}>
          <FileText size={18} color={theme.colors.primary} />
          <View style={styles.fieldTextContainer}>
            <Caption style={{ color: theme.colors.outline }}>Purpose of Visit</Caption>
            <Body style={{ color: theme.colors.onSurface }}>{detail.purpose}</Body>
          </View>
        </View>

        <View style={styles.fieldRow}>
          <Car size={18} color={theme.colors.primary} />
          <View style={styles.fieldTextContainer}>
            <Caption style={{ color: theme.colors.outline }}>Vehicle Number</Caption>
            <Body style={{ color: theme.colors.onSurface }}>{detail.vehicleNumber}</Body>
          </View>
        </View>

        <View style={styles.fieldRow}>
          <Calendar size={18} color={theme.colors.primary} />
          <View style={styles.fieldTextContainer}>
            <Caption style={{ color: theme.colors.outline }}>Expected Date & Time</Caption>
            <Body style={{ color: theme.colors.onSurface }}>
              {detail.expectedDate} • {detail.expectedTime}
            </Body>
          </View>
        </View>

        {detail.checkIn && (
          <View style={styles.fieldRow}>
            <Clock size={18} color={theme.colors.secondary} />
            <View style={styles.fieldTextContainer}>
              <Caption style={{ color: theme.colors.outline }}>Check-In Time</Caption>
              <Body style={{ color: theme.colors.onSurface }}>{detail.checkIn}</Body>
            </View>
          </View>
        )}

        {detail.checkOut && (
          <View style={styles.fieldRow}>
            <Clock size={18} color={theme.colors.outline} />
            <View style={styles.fieldTextContainer}>
              <Caption style={{ color: theme.colors.outline }}>Check-Out Time</Caption>
              <Body style={{ color: theme.colors.onSurface }}>{detail.checkOut}</Body>
            </View>
          </View>
        )}

        <View style={styles.fieldRow}>
          <Hash size={18} color={theme.colors.primary} />
          <View style={styles.fieldTextContainer}>
            <Caption style={{ color: theme.colors.outline }}>Visitor Pass ID</Caption>
            <Body style={{ color: theme.colors.onSurface, fontWeight: "600" }}>
              {detail.visitorIdCode}
            </Body>
          </View>
        </View>

        {detail.notes && (
          <View style={styles.fieldRow}>
            <ShieldCheck size={18} color={theme.colors.onSurfaceVariant} />
            <View style={styles.fieldTextContainer}>
              <Caption style={{ color: theme.colors.outline }}>Visitor Notes</Caption>
              <Body style={{ color: theme.colors.onSurfaceVariant }}>{detail.notes}</Body>
            </View>
          </View>
        )}

        {detail.rejectionReason && (
          <View style={[styles.fieldRow, styles.rejectionBox, { backgroundColor: theme.colors.errorContainer }]}>
            <View style={styles.fieldTextContainer}>
              <Caption style={{ color: theme.colors.onErrorContainer }}>Denial Reason</Caption>
              <Body style={{ color: theme.colors.onErrorContainer }}>{detail.rejectionReason}</Body>
            </View>
          </View>
        )}
      </View>
    </AppCard>
  );
});

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: spacing.sm,
  },
  avatarHeader: {
    alignItems: "center",
    paddingVertical: spacing.xs,
  },
  fieldsGrid: {
    gap: spacing.md,
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  fieldTextContainer: {
    flex: 1,
  },
  rejectionBox: {
    padding: spacing.md,
    borderRadius: spacing.sm,
    marginTop: spacing.xs,
  },
});
