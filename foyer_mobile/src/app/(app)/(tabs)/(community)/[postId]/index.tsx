import React from "react";
import { View, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  AppScreen,
  AppCard,
  AppSectionHeader,
  AppAvatar,
  AppTextField,
  AppButton,
  Title,
  Body,
  Caption,
  AppDivider,
  AppLoader,
} from "@/components/ui";
import { useAppTheme, spacing } from "@/theme";
import {
  usePostDetails,
  CommunityHeader,
  PostCard,
} from "@/features/community";
import { Send, Edit } from "lucide-react-native";

export default function PostDetailsScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const { postId } = useLocalSearchParams<{ postId: string }>();

  const {
    post,
    isLoading,
    commentInput,
    setCommentInput,
    handleToggleLike,
    handleAddComment,
  } = usePostDetails(postId);

  if (isLoading || !post) {
    return (
      <AppScreen scrollable={false}>
        {/* TODO: Replace with backend loading state */}
        <AppLoader mode="fullscreen" message="Loading post details..." />
      </AppScreen>
    );
  }

  return (
    <AppScreen scrollable={true} statusBarStyle="auto">
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <CommunityHeader
        title="Post Details"
        showBack={true}
        onBackPress={() => router.back()}
        rightActionIcon={Edit}
        onRightActionPress={() => router.push(`/(app)/(tabs)/(community)/${post.id}/edit` as any)}
      />

      {/* ─── Main Post Card ────────────────────────────────────────────── */}
      <PostCard
        post={post}
        onPress={() => {}}
        onLike={() => handleToggleLike()}
      />

      {/* ─── Comments Section ──────────────────────────────────────────── */}
      <AppSectionHeader title={`Comments (${post.commentsCount})`} />

      {/* Comment Input Box */}
      <AppCard variant="outlined" style={styles.commentInputCard}>
        <AppTextField
          label="Write a comment..."
          value={commentInput}
          onChangeText={setCommentInput}
          placeholder="Share your opinion politely with neighbors..."
          multiline={true}
        />
        <View style={styles.submitCommentBtn}>
          <AppButton
            label="Post Comment"
            variant="filled"
            size="sm"
            leftIcon={Send}
            onPress={handleAddComment}
          />
        </View>
      </AppCard>

      {/* Comments List */}
      <View style={styles.commentsList}>
        {(post.comments ?? []).map((comment) => (
          <AppCard key={comment.id} variant="elevated" style={styles.commentCard}>
            <View style={styles.commentHeader}>
              <AppAvatar mode="initials" initials={comment.initials} size="sm" />
              <View style={styles.commentAuthor}>
                <Body style={{ color: theme.colors.onSurface, fontWeight: "600" }}>
                  {comment.authorName}
                </Body>
                <Caption style={{ color: theme.colors.onSurfaceVariant }}>
                  {comment.timeAgo}
                </Caption>
              </View>
            </View>
            <Body style={{ color: theme.colors.onSurface, marginTop: spacing.xs }}>
              {comment.content}
            </Body>
          </AppCard>
        ))}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  commentInputCard: {
    marginBottom: spacing.md,
  },
  submitCommentBtn: {
    alignItems: "flex-end",
    marginTop: spacing.xs,
  },
  commentsList: {
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  commentCard: {
    padding: spacing.md,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  commentAuthor: {
    flex: 1,
  },
});
