import React, { useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import {
  AppScreen,
  AppButton,
  AppSectionHeader,
  AppBottomSheet,
  AppBottomSheetRef,
  Body,
  Subtitle,
} from "@/components/ui";
import { useAppTheme, spacing } from "@/theme";
import {
  usePosts,
  usePolls,
  useEvents,
  useNotices,
  CommunityHeader,
  CommunityStatistics,
  QuickActions,
  CommunitySearch,
  CommunityFilters,
  PostList,
  PollList,
  EventList,
  NoticeList,
  CommunityPost,
  communityCategoryFilters,
  communityStatistics,
} from "@/features/community";
import { MessageSquarePlus, Pin, Share2, Trash2, Edit } from "lucide-react-native";

export default function CommunityHomeScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const bottomSheetRef = useRef<AppBottomSheetRef>(null);
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);

  const {
    posts,
    searchQuery,
    setSearchQuery,
    selectedFilter,
    setSelectedFilter,
    isLoading,
    handleToggleLike,
  } = usePosts();

  const { polls, handleVote } = usePolls();
  const { events, handleToggleRsvp } = useEvents();
  const { notices } = useNotices();

  const handlePostPress = (postId: string) => {
    router.push(`/(app)/(tabs)/(community)/${postId}` as any);
  };

  const handleMorePress = (post: CommunityPost) => {
    setSelectedPost(post);
    bottomSheetRef.current?.expand();
  };

  return (
    <AppScreen scrollable={true} statusBarStyle="auto">
      {/* ─── 1. Community Header ────────────────────────────────────────── */}
      <CommunityHeader title="Community" />

      {/* ─── 2. Quick Actions Grid ──────────────────────────────────────── */}
      <QuickActions
        onCreatePost={() => router.push("/(app)/(tabs)/(community)/create-post" as any)}
        onCreatePoll={() => router.push("/(app)/(tabs)/(community)/polls/create" as any)}
        onCreateEvent={() => router.push("/(app)/(tabs)/(community)/events/create" as any)}
        onViewNotices={() => router.push("/(app)/(tabs)/(community)/notices" as any)}
      />

      {/* ─── 3. Search Bar & Filter Chips ──────────────────────────────── */}
      <CommunitySearch value={searchQuery} onChangeText={setSearchQuery} />
      <CommunityFilters
        filters={communityCategoryFilters}
        selectedFilter={selectedFilter as any}
        onSelectFilter={(f) => setSelectedFilter(f)}
      />

      {/* ─── 4. Community Statistics ───────────────────────────────────── */}
      <CommunityStatistics statistics={communityStatistics} />

      {/* ─── 5. Active Polls Preview ───────────────────────────────────── */}
      {polls.length > 0 && selectedFilter === "All" && (
        <>
          <AppSectionHeader
            title="Active Polls"
            action={
              <AppButton
                variant="text"
                size="sm"
                label="View All"
                onPress={() => router.push("/(app)/(tabs)/(community)/polls" as any)}
              />
            }
          />
          <PollList
            polls={polls.slice(0, 1)}
            onPollPress={(pollId) => router.push(`/(app)/(tabs)/(community)/polls/${pollId}` as any)}
            onVoteOption={handleVote}
          />
        </>
      )}

      {/* ─── 6. Upcoming Events Preview ────────────────────────────────── */}
      {events.length > 0 && selectedFilter === "All" && (
        <>
          <AppSectionHeader
            title="Upcoming Events"
            action={
              <AppButton
                variant="text"
                size="sm"
                label="View All"
                onPress={() => router.push("/(app)/(tabs)/(community)/events" as any)}
              />
            }
          />
          <EventList
            events={events.slice(0, 1)}
            onEventPress={(eventId) => router.push(`/(app)/(tabs)/(community)/events/${eventId}` as any)}
            onRsvpEvent={handleToggleRsvp}
          />
        </>
      )}

      {/* ─── 7. Main Community Feed (Posts & Discussions) ─────────────── */}
      <AppSectionHeader title="Discussions & Feed" />
      <PostList
        posts={posts}
        onPostPress={handlePostPress}
        onLikePost={handleToggleLike}
        onMorePress={handleMorePress}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onResetSearch={() => setSearchQuery("")}
        onCreatePost={() => router.push("/(app)/(tabs)/(community)/create-post" as any)}
      />

      {/* ─── Floating Action Button ─────────────────────────────────────── */}
      <View style={styles.fabContainer}>
        <AppButton
          label="+ Create Post"
          variant="filled"
          size="md"
          leftIcon={MessageSquarePlus}
          onPress={() => router.push("/(app)/(tabs)/(community)/create-post" as any)}
          fullWidth
        />
      </View>

      {/* ─── Contextual Action Bottom Sheet ─────────────────────────────── */}
      <AppBottomSheet
        ref={bottomSheetRef}
        title={selectedPost ? selectedPost.title : "Post Actions"}
      >
        {selectedPost && (
          <View style={styles.sheetContent}>
            <Subtitle style={{ color: theme.colors.onSurface }}>
              By {selectedPost.authorName}
            </Subtitle>
            <Body style={{ color: theme.colors.onSurfaceVariant, marginBottom: spacing.md }}>
              {selectedPost.category} • {selectedPost.timeAgo}
            </Body>

            <View style={styles.sheetButtons}>
              <AppButton
                label="Edit Discussion Post"
                variant="tonal"
                leftIcon={Edit}
                onPress={() => {
                  bottomSheetRef.current?.close();
                  router.push(`/(app)/(tabs)/(community)/${selectedPost.id}/edit` as any);
                }}
                fullWidth
              />
              <AppButton
                label={selectedPost.isPinned ? "Unpin Announcement" : "Pin Announcement"}
                variant="outlined"
                leftIcon={Pin}
                onPress={() => {
                  // TODO: Toggle Pin state via API
                  bottomSheetRef.current?.close();
                }}
                fullWidth
              />
              <AppButton
                label="Share Post Link"
                variant="outlined"
                leftIcon={Share2}
                onPress={() => {
                  // TODO: Trigger share sheet
                  bottomSheetRef.current?.close();
                }}
                fullWidth
              />
              <AppButton
                label="Delete Post"
                variant="danger"
                leftIcon={Trash2}
                onPress={() => {
                  // TODO: Delete post via API
                  bottomSheetRef.current?.close();
                }}
                fullWidth
              />
            </View>
          </View>
        )}
      </AppBottomSheet>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    marginVertical: spacing.md,
  },
  sheetContent: {
    paddingVertical: spacing.sm,
  },
  sheetButtons: {
    gap: spacing.sm,
  },
});
