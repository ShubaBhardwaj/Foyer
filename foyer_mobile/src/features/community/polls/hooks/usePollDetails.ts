import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { pollRepository } from "@/repositories/poll.repository";
import { CommunityPoll } from "../types/poll.types";

export function usePollDetails(pollId: string) {
  const queryClient = useQueryClient();

  const {
    data: rawPoll,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.polls.detail(pollId),
    queryFn: () => pollRepository.fetchPollById(pollId),
    enabled: !!pollId,
  });

  const poll = useMemo<CommunityPoll | undefined>(() => {
    if (!rawPoll) return undefined;
    const total = rawPoll.totalVotes || 0;
    return {
      id: rawPoll._id,
      _id: rawPoll._id,
      question: rawPoll.question,
      description: rawPoll.description,
      creatorName: rawPoll.createdBy?.name || "Society Admin",
      creatorInitials: (rawPoll.createdBy?.name || "SA").slice(0, 2).toUpperCase(),
      endsIn: rawPoll.endDate ? `Ends ${rawPoll.endDate}` : "Active",
      endDate: rawPoll.endDate || "Ongoing",
      category: "Poll" as const,
      totalVotes: total,
      userVotedOptionId: rawPoll.userVotedOptionId,
      isClosed: rawPoll.status === "CLOSED",
      options: (rawPoll.options || []).map((opt) => ({
        id: opt._id,
        _id: opt._id,
        text: opt.text,
        votesCount: opt.votesCount || 0,
        percentage: total > 0 ? Math.round(((opt.votesCount || 0) / total) * 100) : 0,
      })),
    };
  }, [rawPoll]);

  const voteMutation = useMutation({
    mutationFn: (optionId: string) => pollRepository.castVote(pollId, optionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.polls.detail(pollId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.polls.all });
    },
  });

  return {
    poll,
    isLoading,
    isError,
    error,
    refetch,
    handleVoteOption: (optionId: string) => voteMutation.mutate(optionId),
    isVoting: voteMutation.isPending,
  };
}
