import { communityRepository } from "@/repositories/community.repository";
import { noticeRepository } from "@/repositories/notice.repository";
import { pollRepository } from "@/repositories/poll.repository";
import { CreateCommunityPostRequestDto } from "@/types/api/community";
import { CreateNoticeRequestDto } from "@/types/api/notice";
import { CreatePollRequestDto } from "@/types/api/poll";

export async function getPosts(filters?: { page?: number; category?: string }) {
  return communityRepository.fetchPosts(filters);
}

export async function getPostById(postId: string) {
  return communityRepository.fetchPostById(postId);
}

export async function createPost(dto: CreateCommunityPostRequestDto) {
  return communityRepository.createPost(dto);
}

export async function toggleLikePost(postId: string) {
  return communityRepository.togglePostReaction(postId);
}

export async function getPolls() {
  return pollRepository.fetchPollsList();
}

export async function votePoll(pollId: string, optionId: string) {
  return pollRepository.castVote(pollId, optionId);
}

export async function createPoll(dto: CreatePollRequestDto) {
  return pollRepository.createPoll(dto);
}

export async function getNotices(filters?: { category?: string; pinned?: boolean }) {
  return noticeRepository.fetchNoticesList(filters);
}

export async function createNotice(dto: CreateNoticeRequestDto) {
  return noticeRepository.createNotice(dto);
}
