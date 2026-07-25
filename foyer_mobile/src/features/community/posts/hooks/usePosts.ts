import { useState, useMemo, useCallback } from "react";
import { communityPosts } from "../../shared/data/communityDummyData";
import { CommunityPost } from "../types/post.types";

export function usePosts() {
  const [posts, setPosts] = useState<CommunityPost[]>(communityPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(false);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.authorName.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      switch (selectedFilter) {
        case "Pinned":
          return Boolean(post.isPinned);
        case "Discussions":
          return post.category === "Discussion" || post.category === "General";
        case "Notices":
          return post.category === "Announcement" || post.category === "Maintenance";
        default:
          return true;
      }
    });
  }, [posts, searchQuery, selectedFilter]);

  const handleToggleLike = useCallback((postId: string) => {
    // TODO: Call API endpoint POST /api/v1/community/posts/:id/like
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              isLiked: !p.isLiked,
              likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1,
            }
          : p
      )
    );
  }, []);

  return {
    posts: filteredPosts,
    rawPostsCount: posts.length,
    searchQuery,
    setSearchQuery,
    selectedFilter,
    setSelectedFilter,
    isLoading,
    setIsLoading,
    handleToggleLike,
  };
}
