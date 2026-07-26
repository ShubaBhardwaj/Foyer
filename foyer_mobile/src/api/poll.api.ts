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

  async getPollById(id: string): Promise<PollDetailResponseDto> {
    const res = await apiClient.get<PollDetailResponseDto>(`/polls/${id}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = (res.data as any)?.data !== undefined ? (res.data as any).data : res.data;
    return {
      success: true,
      data: responseData,
    };
  },

  async createPoll(dto: CreatePollRequestDto): Promise<PollDetailResponseDto> {
    const res = await apiClient.post<PollDetailResponseDto>("/polls", dto);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = (res.data as any)?.data !== undefined ? (res.data as any).data : res.data;
    return {
      success: true,
      data: responseData,
    };
  },

  async voteInPoll(id: string, dto: VotePollRequestDto): Promise<PollDetailResponseDto> {
    const res = await apiClient.post<PollDetailResponseDto>(`/polls/${id}/vote`, dto);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData = (res.data as any)?.data !== undefined ? (res.data as any).data : res.data;
    return {
      success: true,
      data: responseData,
    };
  },
};

