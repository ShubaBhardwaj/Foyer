import React from "react";
import { View, StyleSheet } from "react-native";
import { AppLoader } from "@/components/ui";
import { PollCard } from "./PollCard";
import { CommunityEmptyState } from "../../shared/components/CommunityEmptyState";
import { CommunityPoll } from "../types/poll.types";

interface PollListProps {
  polls: CommunityPoll[];
  onPollPress: (pollId: string) => void;
  onVoteOption: (pollId: string, optionId: string) => void;
  isLoading?: boolean;
  searchQuery?: string;
  onResetSearch?: () => void;
  onCreatePoll?: () => void;
}

export const PollList = React.memo(function PollList({
  polls,
  onPollPress,
  onVoteOption,
  isLoading = false,
  searchQuery,
  onResetSearch,
  onCreatePoll,
}: PollListProps) {
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        {/* TODO: Replace with backend loading state */}
        <AppLoader mode="skeleton" skeletonVariant="card" />
        <AppLoader mode="skeleton" skeletonVariant="card" />
      </View>
    );
  }

  if (polls.length === 0) {
    return (
      <CommunityEmptyState
        type={searchQuery ? "search" : "polls"}
        query={searchQuery}
        onResetSearch={onResetSearch}
        onActionPress={onCreatePoll}
      />
    );
  }

  return (
    <View style={styles.listContainer}>
      {polls.map((poll) => (
        <PollCard
          key={poll.id}
          poll={poll}
          onPress={onPollPress}
          onVoteOption={onVoteOption}
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
