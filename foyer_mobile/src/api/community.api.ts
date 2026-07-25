import apiClient from "./axios";
import {
  AddReactionRequestDto,
  CommentListResponseDto,
  CreateCommunityCommentRequestDto,
  CreateCommunityPostRequestDto,
  PostDetailResponseDto,
  PostListResponseDto,
} from "@/types/api/community";

export const communityApi = {
  async listPosts(params?: { page?: number; limit?: number; category?: string }): Promise<PostListResponseDto> {
    const res = await apiClient.get<PostListResponseDto>("/community/posts", { params });
    return res.data;
  },

  async getPostById(id: string): Promise<PostDetailResponseDto> {
    const res = await apiClient.get<PostDetailResponseDto>(`/community/posts/${id}`);
    return res.data;
  },

  async createPost(dto: CreateCommunityPostRequestDto): Promise<PostDetailResponseDto> {
    const res = await apiClient.post<PostDetailResponseDto>("/community/posts", dto);
    return res.data;
  },

  async toggleReaction(dto: AddReactionRequestDto): Promise<{ success: boolean; message: string }> {
    const res = await apiClient.post<{ success: boolean; message: string }>("/community/reactions", dto);
    return res.data;
  },

  async listPostComments(postId: string): Promise<CommentListResponseDto> {
    const res = await apiClient.get<CommentListResponseDto>(`/community/posts/${postId}/comments`);
    return res.data;
  },

  async createPostComment(postId: string, dto: CreateCommunityCommentRequestDto): Promise<{ success: boolean; data: any }> {
    const res = await apiClient.post<{ success: boolean; data: any }>(`/community/posts/${postId}/comments`, dto);
    return res.data;
  },
};
