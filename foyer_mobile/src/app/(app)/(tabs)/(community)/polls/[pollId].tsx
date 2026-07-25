import React from "react";
import { View, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  AppScreen,
  AppCard,
  AppSectionHeader,
  AppStatusPill,
  Title,
  Body,
  Caption,
  AppLoader,
} from "@/components/ui";
import { useAppTheme, spacing } from "@/theme";
import {
  usePollDetails,
  CommunityHeader,
  PollOptions,
} from "@/features/community";
import { Clock, Vote, Award, CheckCircle2 } from "lucide-react-native";

export default function PollDetailsScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const { pollId } = useLocalSearchParams<{ pollId: string }>();

  const { poll, isLoading, handleVoteOption } = usePollDetails(pollId);

  if (isLoading || !poll) {
    return (
      <AppScreen scrollable={false}>
        {/* TODO: Replace with backend loading state */}
        <AppLoader mode="fullscreen" message="Loading poll details..." />
      </AppScreen>
    );
  }

  const winningOption = poll.options.reduce(
    (max, opt) => (opt.votesCount > max.votesCount ? opt : max),
    poll.options[0]
  );

  return (
    <AppScreen scrollable={true} statusBarStyle="auto">
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <CommunityHeader
        title="Poll Details"
        showBack={true}
        onBackPress={() => router.back()}
      />

      {/* ─── Main Poll Question Card ────────────────────────────────────── */}
      <AppCard variant="elevated" style={styles.card}>
        <View style={styles.headerRow}>
          <AppStatusPill
            status={poll.isClosed ? "neutral" : "approved"}
            label={poll.isClosed ? "Voting Closed" : "Active Voting"}
          />
          <Caption style={{ color: theme.colors.onSurfaceVariant }}>
            {poll.endsIn}
          </Caption>
        </View>

        <Title style={{ color: theme.colors.onSurface, marginTop: spacing.sm, fontSize: 18 }}>
          {poll.question}
        </Title>
        {poll.description && (
          <Body style={{ color: theme.colors.onSurfaceVariant, marginTop: spacing.xs }}>
            {poll.description}
          </Body>
        )}

        <View style={styles.metaRow}>
          <Caption style={{ color: theme.colors.outline }}>
            Created by {poll.creatorName} • Deadline: {poll.endDate}
          </Caption>
        </View>

        {/* ─── Options Voting Progress Bars ───────────────────────────────── */}
        <AppSectionHeader title="Cast Your Vote" />
        <PollOptions
          options={poll.options}
          userVotedOptionId={poll.userVotedOptionId}
          isClosed={poll.isClosed}
          onVoteOption={handleVoteOption}
        />

        {poll.userVotedOptionId && (
          <View style={[styles.votedNotice, { backgroundColor: theme.colors.secondaryContainer }]}>
            <CheckCircle2 size={18} color={theme.colors.secondary} />
            <Caption style={{ color: theme.colors.onSecondaryContainer, fontWeight: "600" }}>
              Your vote has been recorded for this poll.
            </Caption>
          </View>
        )}
      </AppCard>

      {/* ─── Leading Winner Placeholder ─────────────────────────────────── */}
      <AppSectionHeader title="Current Leading Option" />
      <AppCard variant="outlined" style={styles.winnerCard}>
        <View style={styles.winnerHeader}>
          <Award size={24} color={theme.colors.tertiary} />
          <View style={styles.winnerText}>
            <Caption style={{ color: theme.colors.outline }}>Leading Option</Caption>
            <Title style={{ color: theme.colors.onSurface, fontSize: 16 }}>
              {winningOption?.text}
            </Title>
          </View>
          <AppStatusPill status="pending" label={`${winningOption?.percentage}%`} />
        </View>
      </AppCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: spacing.sm,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  metaRow: {
    marginVertical: spacing.xs,
  },
  votedNotice: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderRadius: spacing.sm,
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  winnerCard: {
    marginVertical: spacing.xs,
  },
  winnerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  winnerText: {
    flex: 1,
  },
});
