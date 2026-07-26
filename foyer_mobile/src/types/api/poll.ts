export interface PollOptionDto {
  _id: string;
  text: string;
  votesCount: number;
  votedUserIds?: string[];
}

export interface PollDto {
  _id: string;
  question: string;
  description?: string;
  category: "GENERAL" | "MAINTENANCE" | "FINANCE" | "RULE_CHANGE" | "EVENT";
  options: PollOptionDto[];
  status: "DRAFT" | "ACTIVE" | "CLOSED";
  visibility: "ALL" | "RESIDENTS" | "OWNERS";
  startDate?: string;
  endDate?: string;
  totalVotes: number;
  userVotedOptionId?: string;
  createdBy: { _id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

export interface CreatePollRequestDto {
  question: string;
  description?: string;
  category?: string;
  options: string[];
  endDate?: string;
}

export interface VotePollRequestDto {
  optionId: string;
}

export interface PollListResponseDto {
  success: boolean;
  data: PollDto[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface PollDetailResponseDto {
  success: boolean;
  data: PollDto;
}

