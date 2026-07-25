export interface CommunityCommentDto {
  _id: string;
  post: string;
  author: { _id: string; name: string; avatar?: string };
  content: string;
  parentComment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityPostDto {
  _id: string;
  author: { _id: string; name: string; avatar?: string; flatNumber?: string };
  content: string;
  images?: string[];
  category: "ANNOUNCEMENT" | "DISCUSSION" | "RECOMMENDATION" | "BUY_SELL" | "HELP";
  likesCount: number;
  commentsCount: number;
  isLikedByMe: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommunityPostRequestDto {
  content: string;
  category?: string;
  images?: string[];
}

export interface AddReactionRequestDto {
  targetId: string;
  targetType: "POST" | "COMMENT";
  reactionType: "LIKE" | "HEART" | "CELEBRATE";
}

export interface CreateCommunityCommentRequestDto {
  content: string;
  parentCommentId?: string;
}

export interface PostListResponseDto {
  success: boolean;
  data: CommunityPostDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface PostDetailResponseDto {
  success: boolean;
  data: CommunityPostDto;
}

export interface CommentListResponseDto {
  success: boolean;
  data: CommunityCommentDto[];
}
