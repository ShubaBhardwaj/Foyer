import apiClient from "./axios";
import {
  CreatePollRequestDto,
  PollDetailResponseDto,
  PollListResponseDto,
  VotePollRequestDto,
} from "@/types/api/poll";

export const pollApi = {
  async listPolls(): Promise<PollListResponseDto> {
    const res = await apiClient.get<PollListResponseDto>("/polls");
    return res.data;
  },

  async getPollById(id: string): Promise<PollDetailResponseDto> {
    const res = await apiClient.get<PollDetailResponseDto>(`/polls/${id}`);
    return res.data;
  },

  async createPoll(dto: CreatePollRequestDto): Promise<PollDetailResponseDto> {
    const res = await apiClient.post<PollDetailResponseDto>("/polls", dto);
    return res.data;
  },

  async voteInPoll(id: string, dto: VotePollRequestDto): Promise<PollDetailResponseDto> {
    const res = await apiClient.post<PollDetailResponseDto>(`/polls/${id}/vote`, dto);
    return res.data;
  },
};
