import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { communityRepository } from "@/repositories/community.repository";
import { CommunityPost, PostComment } from "../types/post.types";

export function usePostDetails(postId: string) {
  const [commentInput, setCommentInput] = useState("");
  const queryClient = useQueryClient();

  const {
    data: rawPost,
    isLoading: isPostLoading,
    isError,
    error,
    refetch: refetchPost,
  } = useQuery({
    queryKey: queryKeys.community.post(postId),
    queryFn: () => communityRepository.fetchPostById(postId),
    enabled: !!postId,
  });

  const {
    data: rawComments,
    isLoading: isCommentsLoading,
    refetch: refetchComments,
  } = useQuery({
    queryKey: queryKeys.community.comments(postId),
    queryFn: () => communityRepository.fetchComments(postId),
    enabled: !!postId,
  });

  const comments = useMemo<PostComment[]>(() => {
    const list = rawComments || [];
    return list.map((c) => ({
      id: c._id,
      authorName: c.author?.name || "Resident",
      initials: (c.author?.name || "R").slice(0, 2).toUpperCase(),
      timeAgo: "Recently",
      content: c.content,
      likesCount: 0,
    }));
  }, [rawComments]);

  const post = useMemo<CommunityPost | undefined>(() => {
    if (!rawPost) return undefined;
    return {
      id: rawPost._id,
      authorName: rawPost.author?.name || "Community Member",
      authorRole: rawPost.author?.flatNumber ? `Flat ${rawPost.author.flatNumber}` : "Resident",
      initials: (rawPost.author?.name || "CM").slice(0, 2).toUpperCase(),
      timeAgo: "Recently",
      title: rawPost.content.slice(0, 40) || "Post",
      content: rawPost.content,
      category: rawPost.category as any,
      likesCount: rawPost.likesCount || 0,
      commentsCount: rawPost.commentsCount || 0,
      isLiked: rawPost.isLikedByMe,
      images: rawPost.images,
      comments,
    };
  }, [rawPost, comments]);

  const toggleReactionMutation = useMutation({
    mutationFn: () => communityRepository.togglePostReaction(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.community.post(postId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.community.all });
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: (content: string) => communityRepository.addComment(postId, content),
    onSuccess: () => {
      setCommentInput("");
      queryClient.invalidateQueries({ queryKey: queryKeys.community.comments(postId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.community.post(postId) });
    },
  });

  const handleAddComment = () => {
    if (!commentInput.trim()) return;
    addCommentMutation.mutate(commentInput.trim());
  };

  return {
    post,
    comments,
    isLoading: isPostLoading || isCommentsLoading,
    isError,
    error,
    commentInput,
    setCommentInput,
    handleToggleLike: () => toggleReactionMutation.mutate(),
    handleAddComment,
    isSubmittingComment: addCommentMutation.isPending,
  };
}
