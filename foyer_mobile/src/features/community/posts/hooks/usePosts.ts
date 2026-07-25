import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { communityRepository } from "@/repositories/community.repository";
import { CreateCommunityPostRequestDto } from "@/types/api/community";
import { CommunityPost } from "../types/post.types";

export function usePosts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const queryClient = useQueryClient();

  const queryParams = useMemo(() => {
    const params: { category?: string } = {};
    if (selectedFilter !== "All") params.category = selectedFilter.toUpperCase();
    return params;
  }, [selectedFilter]);

  const {
    data,
    isLoading,
    isRefetching,
    refetch,
    isError,
    error,
  } = useQuery({
    queryKey: queryKeys.community.posts(queryParams),
    queryFn: () => communityRepository.fetchPosts(queryParams),
  });

  const posts = useMemo<CommunityPost[]>(() => {
    const list = data?.posts || [];
    return list.map((p) => ({
      id: p._id,
      _id: p._id,
      authorName: p.author?.name || "Community Member",
      authorRole: p.author?.flatNumber ? `Flat ${p.author.flatNumber}` : "Resident",
      initials: (p.author?.name || "CM").slice(0, 2).toUpperCase(),
      timeAgo: "Recently",
      title: p.content.slice(0, 40) || "Post",
      content: p.content,
      category: p.category as any,
      likesCount: p.likesCount || 0,
      commentsCount: p.commentsCount || 0,
      isLiked: p.isLikedByMe,
      images: p.images,
    }));
  }, [data?.posts]);

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    const lower = searchQuery.toLowerCase();
    return posts.filter(
      (p) =>
        p.content.toLowerCase().includes(lower) ||
        p.authorName.toLowerCase().includes(lower)
    );
  }, [posts, searchQuery]);

  const toggleReactionMutation = useMutation({
    mutationFn: (postId: string) => communityRepository.togglePostReaction(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.community.all });
    },
  });

  const createPostMutation = useMutation({
    mutationFn: (dto: CreateCommunityPostRequestDto) => communityRepository.createPost(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.community.all });
    },
  });

  return {
    posts: filteredPosts,
    rawPostsCount: posts.length,
    searchQuery,
    setSearchQuery,
    selectedFilter,
    setSelectedFilter,
    selectedCategory: selectedFilter,
    setSelectedCategory: setSelectedFilter,
    isLoading,
    isRefetching,
    isError,
    error,
    refetch,
    handleToggleLike: (postId: string) => toggleReactionMutation.mutate(postId),
    createPost: (dto: CreateCommunityPostRequestDto) => createPostMutation.mutateAsync(dto),
    isCreating: createPostMutation.isPending,
  };
}
