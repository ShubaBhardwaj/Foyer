import React from "react";
import { View, StyleSheet } from "react-native";
import { AppLoader } from "@/components/ui";
import { PostCard } from "./PostCard";
import { CommunityEmptyState } from "../../shared/components/CommunityEmptyState";
import { CommunityPost } from "../types/post.types";

interface PostListProps {
  posts: CommunityPost[];
  onPostPress: (postId: string) => void;
  onLikePost?: (postId: string) => void;
  onMorePress?: (post: CommunityPost) => void;
  isLoading?: boolean;
  searchQuery?: string;
  onResetSearch?: () => void;
  onCreatePost?: () => void;
}

export const PostList = React.memo(function PostList({
  posts,
  onPostPress,
  onLikePost,
  onMorePress,
  isLoading = false,
  searchQuery,
  onResetSearch,
  onCreatePost,
}: PostListProps) {
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        {/* TODO: Replace with backend loading state */}
        <AppLoader mode="skeleton" skeletonVariant="card" />
        <AppLoader mode="skeleton" skeletonVariant="card" />
      </View>
    );
  }

  if (posts.length === 0) {
    return (
      <CommunityEmptyState
        type={searchQuery ? "search" : "posts"}
        query={searchQuery}
        onResetSearch={onResetSearch}
        onActionPress={onCreatePost}
      />
    );
  }

  return (
    <View style={styles.listContainer}>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onPress={onPostPress}
          onLike={onLikePost}
          onMorePress={onMorePress}
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
