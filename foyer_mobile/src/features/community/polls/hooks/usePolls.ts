import { useState, useMemo, useCallback } from "react";
import { communityPolls } from "../../shared/data/communityDummyData";
import { CommunityPoll } from "../types/poll.types";

export function usePolls() {
  const [polls, setPolls] = useState<CommunityPoll[]>(communityPolls);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const filteredPolls = useMemo(() => {
    return polls.filter(
      (poll) =>
        searchQuery.trim() === "" ||
        poll.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        poll.creatorName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [polls, searchQuery]);

  const handleVote = useCallback((pollId: string, optionId: string) => {
    // TODO: Call API endpoint POST /api/v1/community/polls/:id/vote
    setPolls((prev) =>
      prev.map((poll) => {
        if (poll.id !== pollId) return poll;
        const newTotalVotes = poll.totalVotes + 1;
        const updatedOptions = poll.options.map((opt) => {
          const isTarget = opt.id === optionId;
          const newCount = isTarget ? opt.votesCount + 1 : opt.votesCount;
          return {
            ...opt,
            votesCount: newCount,
            percentage: Math.round((newCount / newTotalVotes) * 100),
          };
        });
        return {
          ...poll,
          totalVotes: newTotalVotes,
          userVotedOptionId: optionId,
          options: updatedOptions,
        };
      })
    );
  }, []);

  return {
    polls: filteredPolls,
    rawPollsCount: polls.length,
    searchQuery,
    setSearchQuery,
    isLoading,
    setIsLoading,
    handleVote,
  };
}
