import { pollApi } from "@/api/poll.api";
import { CreatePollRequestDto, PollDto } from "@/types/api/poll";

export const pollRepository = {
  async fetchPollsList(): Promise<PollDto[]> {
    const res = await pollApi.listPolls();
    return res.data || [];
  },

  async fetchPollById(id: string): Promise<PollDto> {
    const res = await pollApi.getPollById(id);
    return res.data;
  },

  async createPoll(dto: CreatePollRequestDto): Promise<PollDto> {
    const res = await pollApi.createPoll(dto);
    return res.data;
  },

  async castVote(pollId: string, optionId: string): Promise<PollDto> {
    const res = await pollApi.voteInPoll(pollId, { optionId });
    return res.data;
  },
};
