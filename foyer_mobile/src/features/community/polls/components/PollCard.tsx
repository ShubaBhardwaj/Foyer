import React from "react";
import { View, StyleSheet } from "react-native";
import {
  AppCard,
  AppAvatar,
  Title,
  Body,
  Caption,
  AppStatusPill,
} from "@/components/ui";
import { useAppTheme, spacing } from "@/theme";
import { Clock, Vote } from "lucide-react-native";
import { PollOptions } from "./PollOptions";
import { CommunityPoll } from "../types/poll.types";

interface PollCardProps {
  poll: CommunityPoll;
  onPress: (pollId: string) => void;
  onVoteOption: (pollId: string, optionId: string) => void;
}

export const PollCard = React.memo(function PollCard({
  poll,
  onPress,
  onVoteOption,
}: PollCardProps) {
  const theme = useAppTheme();

  return (
    <AppCard
      variant="elevated"
      onPress={() => onPress(poll.id)}
      style={styles.card}
      accessibilityLabel={`Poll: ${poll.question}`}
    >
      {/* 1. Header */}
      <View style={styles.header}>
        <AppAvatar mode="initials" initials={poll.creatorInitials} size="md" />
        <View style={styles.headerText}>
          <Body style={{ color: theme.colors.onSurface, fontWeight: "600" }}>
            {poll.creatorName}
          </Body>
          <Caption style={{ color: theme.colors.onSurfaceVariant }}>
            Created Poll • {poll.endsIn}
          </Caption>
        </View>
        <AppStatusPill
          status={poll.isClosed ? "neutral" : "approved"}
          label={poll.isClosed ? "Closed" : "Active Poll"}
        />
      </View>

      {/* 2. Question */}
      <Title style={{ color: theme.colors.onSurface, marginTop: spacing.sm, fontSize: 17 }}>
        {poll.question}
      </Title>
      {poll.description && (
        <Body style={{ color: theme.colors.onSurfaceVariant, marginTop: spacing.xs }}>
          {poll.description}
        </Body>
      )}

      {/* 3. Options Progress Bars */}
      <PollOptions
        options={poll.options}
        userVotedOptionId={poll.userVotedOptionId}
        isClosed={poll.isClosed}
        onVoteOption={(optionId) => onVoteOption(poll.id, optionId)}
      />

      {/* 4. Footer */}
      <View style={[styles.footer, { borderTopColor: theme.colors.outline }]}>
        <View style={styles.footerInfo}>
          <Vote size={16} color={theme.colors.onSurfaceVariant} />
          <Caption style={{ color: theme.colors.onSurfaceVariant }}>
            {poll.totalVotes} Total Votes
          </Caption>
        </View>

        <View style={styles.footerInfo}>
          <Clock size={16} color={theme.colors.onSurfaceVariant} />
          <Caption style={{ color: theme.colors.onSurfaceVariant }}>
            {poll.endDate}
          </Caption>
        </View>
      </View>
    </AppCard>
  );
});

const styles = StyleSheet.create({
  card: {
    marginVertical: spacing.xs,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  headerText: {
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  footerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
});
