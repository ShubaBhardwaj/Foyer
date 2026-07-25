export interface PostComment {
  id: string;
  authorName: string;
  authorAvatar?: string;
  initials: string;
  timeAgo: string;
  content: string;
  likesCount: number;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorRole?: string;
  authorAvatar?: string;
  initials: string;
  timeAgo: string;
  title: string;
  content: string;
  category: "Discussion" | "Announcement" | "Maintenance" | "General";
  imageUrl?: string;
  isPinned?: boolean;
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  comments?: PostComment[];
}
