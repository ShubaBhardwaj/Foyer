export interface PollOption {
  id: string;
  text: string;
  votesCount: number;
  percentage: number;
}

export interface CommunityPoll {
  id: string;
  question: string;
  description?: string;
  creatorName: string;
  creatorInitials: string;
  category: "Poll";
  options: PollOption[];
  totalVotes: number;
  userVotedOptionId?: string;
  endsIn: string;
  endDate: string;
  isClosed?: boolean;
  winnerOptionText?: string;
}
