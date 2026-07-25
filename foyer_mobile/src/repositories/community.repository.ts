import { communityApi } from "@/api/community.api";
import {
  CommunityCommentDto,
  CommunityPostDto,
  CreateCommunityPostRequestDto,
} from "@/types/api/community";

export const communityRepository = {
  async fetchPosts(filters?: { page?: number; limit?: number; category?: string }) {
    const res = await communityApi.listPosts(filters);
    return {
      posts: res.data || [],
      pagination: res.pagination,
    };
  },

  async fetchPostById(id: string): Promise<CommunityPostDto> {
    const res = await communityApi.getPostById(id);
    return res.data;
  },

  async createPost(dto: CreateCommunityPostRequestDto): Promise<CommunityPostDto> {
    const res = await communityApi.createPost(dto);
    return res.data;
  },

  async togglePostReaction(postId: string, reactionType: "LIKE" | "HEART" | "CELEBRATE" = "LIKE") {
    return await communityApi.toggleReaction({
      targetId: postId,
      targetType: "POST",
      reactionType,
    });
  },

  async fetchComments(postId: string): Promise<CommunityCommentDto[]> {
    const res = await communityApi.listPostComments(postId);
    return res.data || [];
  },

  async addComment(postId: string, content: string, parentCommentId?: string) {
    return await communityApi.createPostComment(postId, { content, parentCommentId });
  },
};
