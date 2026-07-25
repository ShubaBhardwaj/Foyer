import React from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { AppScreen, AppButton } from "@/components/ui";
import { spacing } from "@/theme";
import {
  usePolls,
  CommunityHeader,
  CommunitySearch,
  PollList,
} from "@/features/community";
import { Vote } from "lucide-react-native";

export default function PollsListScreen() {
  const router = useRouter();
  const { polls, searchQuery, setSearchQuery, isLoading, handleVote } = usePolls();

  return (
    <AppScreen scrollable={true} statusBarStyle="auto">
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <CommunityHeader
        title="Resident Polls"
        showBack={true}
        onBackPress={() => router.back()}
      />

      {/* ─── Search Bar ─────────────────────────────────────────────────── */}
      <CommunitySearch
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search polls by question or topic..."
      />

      {/* ─── Polls List ─────────────────────────────────────────────────── */}
      <PollList
        polls={polls}
        onPollPress={(pollId) => router.push(`/(app)/(tabs)/(community)/polls/${pollId}` as any)}
        onVoteOption={handleVote}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onResetSearch={() => setSearchQuery("")}
        onCreatePoll={() => router.push("/(app)/(tabs)/(community)/polls/create" as any)}
      />

      {/* ─── Floating Action Button ─────────────────────────────────────── */}
      <View style={styles.fabRow}>
        <AppButton
          label="+ Create Poll"
          variant="filled"
          size="md"
          leftIcon={Vote}
          onPress={() => router.push("/(app)/(tabs)/(community)/polls/create" as any)}
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
