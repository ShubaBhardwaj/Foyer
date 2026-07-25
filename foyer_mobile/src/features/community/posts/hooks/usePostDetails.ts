import { useState, useMemo, useCallback } from "react";
import { communityPosts } from "../../shared/data/communityDummyData";
import { CommunityPost, PostComment } from "../types/post.types";

export function usePostDetails(postId?: string) {
  const targetId = postId ?? "post_001";

  const initialPost = useMemo(() => {
    return communityPosts.find((p) => p.id === targetId) ?? communityPosts[0];
  }, [targetId]);

  const [post, setPost] = useState<CommunityPost>(initialPost);
  const [isLoading, setIsLoading] = useState(false);
  const [commentInput, setCommentInput] = useState("");

  const handleToggleLike = useCallback(() => {
    // TODO: Call API endpoint
    setPost((prev) => ({
      ...prev,
      isLiked: !prev.isLiked,
      likesCount: prev.isLiked ? prev.likesCount - 1 : prev.likesCount + 1,
    }));
  }, []);

  const handleAddComment = useCallback(() => {
    if (!commentInput.trim()) return;
    // TODO: Call API endpoint POST /api/v1/community/posts/:id/comments
    const newComment: PostComment = {
      id: `c_${Date.now()}`,
      authorName: "Shubham Bhardwaj",
      initials: "SB",
      timeAgo: "Just now",
      content: commentInput.trim(),
      likesCount: 0,
    };
    setPost((prev) => ({
      ...prev,
      commentsCount: prev.commentsCount + 1,
      comments: [newComment, ...(prev.comments ?? [])],
    }));
    setCommentInput("");
  }, [commentInput]);

  return {
    post,
    isLoading,
    setIsLoading,
    commentInput,
    setCommentInput,
    handleToggleLike,
    handleAddComment,
  };
}
