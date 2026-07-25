import {
  communityPosts,
  communityPolls,
  communityEvents,
  communityNotices,
} from "../data/communityDummyData";
import { CommunityPost } from "../../posts/types/post.types";
import { CommunityPoll } from "../../polls/types/poll.types";
import { CommunityEvent } from "../../events/types/event.types";
import { CommunityNotice } from "../../notices/types/notice.types";

/**
 * Dummy API service layer for Community Module.
 * Future backend integration will replace these methods with API calls.
 */

// TODO: Replace with GET /api/v1/community/posts
export async function getPosts(): Promise<CommunityPost[]> {
  return Promise.resolve(communityPosts);
}

// TODO: Replace with GET /api/v1/community/posts/:id
export async function getPostById(postId: string): Promise<CommunityPost | undefined> {
  const record = communityPosts.find((p) => p.id === postId) ?? communityPosts[0];
  return Promise.resolve(record);
}

// TODO: Replace with POST /api/v1/community/posts
export async function createPost(data: Partial<CommunityPost>): Promise<CommunityPost> {
  const newPost: CommunityPost = {
    id: `post_${Date.now()}`,
    authorName: data.authorName ?? "Shubham Bhardwaj",
    authorRole: data.authorRole ?? "Society Admin",
    initials: "SB",
    timeAgo: "Just now",
    title: data.title ?? "New Discussion",
    content: data.content ?? "",
    category: data.category ?? "Discussion",
    likesCount: 0,
    commentsCount: 0,
    isLiked: false,
    comments: [],
  };
  return Promise.resolve(newPost);
}

// TODO: Replace with POST /api/v1/community/posts/:id/like
export async function toggleLikePost(postId: string): Promise<boolean> {
  return Promise.resolve(true);
}

// TODO: Replace with GET /api/v1/community/polls
export async function getPolls(): Promise<CommunityPoll[]> {
  return Promise.resolve(communityPolls);
}

// TODO: Replace with POST /api/v1/community/polls/:id/vote
export async function votePoll(pollId: string, optionId: string): Promise<boolean> {
  return Promise.resolve(true);
}

// TODO: Replace with GET /api/v1/community/events
export async function getEvents(): Promise<CommunityEvent[]> {
  return Promise.resolve(communityEvents);
}

// TODO: Replace with POST /api/v1/community/events/:id/rsvp
export async function toggleRsvpEvent(eventId: string): Promise<boolean> {
  return Promise.resolve(true);
}

// TODO: Replace with GET /api/v1/community/notices
export async function getNotices(): Promise<CommunityNotice[]> {
  return Promise.resolve(communityNotices);
}
