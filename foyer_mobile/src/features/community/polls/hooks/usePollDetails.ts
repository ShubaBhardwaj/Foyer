import { useState, useMemo, useCallback } from "react";
import { communityPolls } from "../../shared/data/communityDummyData";
import { CommunityPoll } from "../types/poll.types";

export function usePollDetails(pollId?: string) {
  const targetId = pollId ?? "poll_001";

  const initialPoll = useMemo(() => {
    return communityPolls.find((p) => p.id === targetId) ?? communityPolls[0];
  }, [targetId]);

  const [poll, setPoll] = useState<CommunityPoll>(initialPoll);
  const [isLoading, setIsLoading] = useState(false);

  const handleVoteOption = useCallback(
    (optionId: string) => {
      // TODO: Call vote API endpoint
      if (poll.userVotedOptionId) return;

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

      setPoll((prev) => ({
        ...prev,
        totalVotes: newTotalVotes,
        userVotedOptionId: optionId,
        options: updatedOptions,
      }));
    },
    [poll]
  );

  return {
    poll,
    isLoading,
    setIsLoading,
    handleVoteOption,
  };
}
