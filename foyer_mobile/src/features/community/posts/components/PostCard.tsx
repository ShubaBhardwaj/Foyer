import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import {
  AppCard,
  AppAvatar,
  Title,
  Body,
  Caption,
  AppStatusPill,
  AppIconButton,
} from "@/components/ui";
import { useAppTheme, spacing, radius } from "@/theme";
import { Heart, MessageSquare, Pin, Share2, Image as ImageIcon } from "lucide-react-native";
import { CommunityPost } from "../types/post.types";

interface PostCardProps {
  post: CommunityPost;
  onPress: (postId: string) => void;
  onLike?: (postId: string) => void;
  onMorePress?: (post: CommunityPost) => void;
}

export const PostCard = React.memo(function PostCard({
  post,
  onPress,
  onLike,
  onMorePress,
}: PostCardProps) {
  const theme = useAppTheme();

  return (
    <AppCard
      variant="elevated"
      onPress={() => onPress(post.id)}
      style={styles.card}
      accessibilityLabel={`Post: ${post.title}`}
    >
      {/* 1. Header with Author Info */}
      <View style={styles.header}>
        <AppAvatar mode="initials" initials={post.initials} size="md" />
        <View style={styles.authorText}>
          <View style={styles.nameRow}>
            <Body style={{ color: theme.colors.onSurface, fontWeight: "600" }}>
              {post.authorName}
            </Body>
            {post.isPinned && (
              <View style={[styles.pinnedBadge, { backgroundColor: theme.colors.secondaryContainer }]}>
                <Pin size={12} color={theme.colors.secondary} />
                <Caption style={{ color: theme.colors.onSecondaryContainer, fontSize: 10 }}>
                  Pinned
                </Caption>
              </View>
            )}
          </View>
          <Caption style={{ color: theme.colors.onSurfaceVariant }}>
            {post.authorRole ? `${post.authorRole} • ` : ""}{post.timeAgo}
          </Caption>
        </View>
        <AppStatusPill status={getCategoryPillStatus(post.category)} label={post.category} />
      </View>

      {/* 2. Content Section */}
      <Title style={{ color: theme.colors.onSurface, marginTop: spacing.sm, fontSize: 17 }}>
        {post.title}
      </Title>
      <Body
        style={{ color: theme.colors.onSurfaceVariant, marginTop: spacing.xs, lineHeight: 20 }}
        numberOfLines={3}
      >
        {post.content}
      </Body>

      {/* Image attachment placeholder */}
      {post.imageUrl && (
        <View style={[styles.imagePlaceholder, { backgroundColor: theme.colors.surfaceVariant ?? "#F5F0E8" }]}>
          <ImageIcon size={24} color={theme.colors.outline} />
          <Caption style={{ color: theme.colors.outline, marginLeft: spacing.xs }}>
            Attachment Image Preview Placeholder
          </Caption>
        </View>
      )}

      {/* 3. Footer Actions (Like, Comment, Share) */}
      <View style={[styles.footer, { borderTopColor: theme.colors.outline }]}>
        <Pressable
          onPress={() => onLike?.(post.id)}
          hitSlop={8}
          style={styles.actionItem}
          accessibilityRole="button"
          accessibilityLabel="Like post"
        >
          <Heart
            size={18}
            color={post.isLiked ? theme.colors.error : theme.colors.onSurfaceVariant}
            fill={post.isLiked ? theme.colors.error : "none"}
          />
          <Caption style={{ color: post.isLiked ? theme.colors.error : theme.colors.onSurfaceVariant }}>
            {post.likesCount}
          </Caption>
        </Pressable>

        <Pressable
          onPress={() => onPress(post.id)}
          hitSlop={8}
          style={styles.actionItem}
          accessibilityRole="button"
          accessibilityLabel="Comments"
        >
          <MessageSquare size={18} color={theme.colors.onSurfaceVariant} />
          <Caption style={{ color: theme.colors.onSurfaceVariant }}>
            {post.commentsCount}
          </Caption>
        </Pressable>

        <Pressable
          onPress={() => onMorePress?.(post)}
          hitSlop={8}
          style={styles.actionItem}
          accessibilityRole="button"
          accessibilityLabel="Share post"
        >
          <Share2 size={18} color={theme.colors.onSurfaceVariant} />
          <Caption style={{ color: theme.colors.onSurfaceVariant }}>Share</Caption>
        </Pressable>
      </View>
    </AppCard>
  );
});

function getCategoryPillStatus(category: CommunityPost["category"]) {
  switch (category) {
    case "Announcement":
      return "pending"; // Amber
    case "Maintenance":
      return "rejected"; // Red warning
    case "Discussion":
    default:
      return "neutral";
  }
}

const styles = StyleSheet.create({
  card: {
    marginVertical: spacing.xs,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  authorText: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  pinnedBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.full,
    gap: 2,
  },
  imagePlaceholder: {
    height: 120,
    borderRadius: radius.md,
    marginVertical: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
});
