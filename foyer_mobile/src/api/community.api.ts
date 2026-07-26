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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = (res.data as any)?.data !== undefined ? (res.data as any).data : res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const metaData = (res.data as any)?.meta || (res.data as any)?.pagination;
    const list = Array.isArray(responseData) ? responseData : [];
    return {
      success: true,
      data: list,
      pagination: metaData || { page: 1, limit: 10, total: list.length, pages: 1 },
    };
  },

  async getPostById(id: string): Promise<PostDetailResponseDto> {
    const res = await apiClient.get<PostDetailResponseDto>(`/community/posts/${id}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = (res.data as any)?.data !== undefined ? (res.data as any).data : res.data;
    return {
      success: true,
      data: responseData,
    };
  },

  async createPost(dto: CreateCommunityPostRequestDto): Promise<PostDetailResponseDto> {
    const res = await apiClient.post<PostDetailResponseDto>("/community/posts", dto);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = (res.data as any)?.data !== undefined ? (res.data as any).data : res.data;
    return {
      success: true,
      data: responseData,
    };
  },

  async toggleReaction(dto: AddReactionRequestDto): Promise<{ success: boolean; message: string }> {
    const res = await apiClient.post<{ success: boolean; message: string }>("/community/reactions", dto);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return {
      success: true,
      message: (res.data as any)?.message || "Reaction updated",
    };
  },

  async listPostComments(postId: string): Promise<CommentListResponseDto> {
    const res = await apiClient.get<CommentListResponseDto>(`/community/posts/${postId}/comments`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = (res.data as any)?.data !== undefined ? (res.data as any).data : res.data;
    const list = Array.isArray(responseData) ? responseData : [];
    return {
      success: true,
      data: list,
    };
  },

  async createPostComment(postId: string, dto: CreateCommunityCommentRequestDto): Promise<{ success: boolean; data: any }> {
    const res = await apiClient.post<{ success: boolean; data: any }>(`/community/posts/${postId}/comments`, dto);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = (res.data as any)?.data !== undefined ? (res.data as any).data : res.data;
    return {
      success: true,
      data: responseData,
    };
  },
};

