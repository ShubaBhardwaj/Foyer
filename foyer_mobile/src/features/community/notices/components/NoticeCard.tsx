import React from "react";
import { View, StyleSheet } from "react-native";
import {
  AppCard,
  Subtitle,
  Body,
  Caption,
  AppStatusPill,
} from "@/components/ui";
import { useAppTheme, spacing, radius } from "@/theme";
import { BellRing, Pin, AlertTriangle, Info, Wrench } from "lucide-react-native";
import { CommunityNotice, NoticePriority } from "../types/notice.types";

interface NoticeCardProps {
  notice: CommunityNotice;
  onPress?: (noticeId: string) => void;
}

export const NoticeCard = React.memo(function NoticeCard({
  notice,
  onPress,
}: NoticeCardProps) {
  const theme = useAppTheme();

  return (
    <AppCard
      variant="outlined"
      onPress={onPress ? () => onPress(notice.id) : undefined}
      style={styles.card}
      accessibilityLabel={`Notice: ${notice.title}`}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Subtitle style={{ color: theme.colors.onSurface, flex: 1, fontSize: 16 }}>
            {notice.title}
          </Subtitle>
          {notice.isPinned && (
            <View style={[styles.pinnedBadge, { backgroundColor: theme.colors.secondaryContainer }]}>
              <Pin size={12} color={theme.colors.secondary} />
              <Caption style={{ color: theme.colors.onSecondaryContainer, fontSize: 10 }}>
                Pinned
              </Caption>
            </View>
          )}
        </View>
        <AppStatusPill
          status={getNoticePillStatus(notice.priority)}
          label={notice.priority}
        />
      </View>

      <Body
        style={{ color: theme.colors.onSurfaceVariant, marginTop: spacing.xs, lineHeight: 20 }}
      >
        {notice.description}
      </Body>

      <View style={styles.footer}>
        <Caption style={{ color: theme.colors.outline }}>
          Issued: {notice.date}
        </Caption>
      </View>
    </AppCard>
  );
});

function getNoticePillStatus(priority: NoticePriority) {
  switch (priority) {
    case "Emergency":
      return "rejected"; // Red
    case "Important":
      return "pending"; // Amber
    case "Maintenance":
      return "approved"; // Sage Green
    case "General":
    default:
      return "neutral";
  }
}

const styles = StyleSheet.create({
  card: {
    marginVertical: spacing.xs,
    padding: spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  titleRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    flexWrap: "wrap",
  },
  pinnedBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.full,
    gap: 2,
  },
  footer: {
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
  },
});
