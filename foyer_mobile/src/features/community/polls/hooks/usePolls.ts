import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { pollRepository } from "@/repositories/poll.repository";
import { CreatePollRequestDto } from "@/types/api/poll";
import { CommunityPoll } from "../types/poll.types";

export function usePolls() {
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  const {
    data: rawPolls,
    isLoading,
    isRefetching,
    refetch,
    isError,
    error,
  } = useQuery({
    queryKey: queryKeys.polls.list(),
    queryFn: () => pollRepository.fetchPollsList(),
  });

  const polls = useMemo<CommunityPoll[]>(() => {
    const list = rawPolls || [];
    return list.map((p) => {
      const total = p.totalVotes || 0;
      return {
        id: p._id,
        _id: p._id,
        question: p.question,
        description: p.description,
        creatorName: p.createdBy?.name || "Society Admin",
        creatorInitials: (p.createdBy?.name || "SA").slice(0, 2).toUpperCase(),
        endsIn: p.endDate ? `Ends ${p.endDate}` : "Active",
        endDate: p.endDate || "Ongoing",
        category: "Poll" as const,
        totalVotes: total,
        userVotedOptionId: p.userVotedOptionId,
        isClosed: p.status === "CLOSED",
        options: (p.options || []).map((opt) => ({
          id: opt._id,
          _id: opt._id,
          text: opt.text,
          votesCount: opt.votesCount || 0,
          percentage: total > 0 ? Math.round(((opt.votesCount || 0) / total) * 100) : 0,
        })),
      };
    });
  }, [rawPolls]);

  const filteredPolls = useMemo(() => {
    if (!searchQuery.trim()) return polls;
    const lower = searchQuery.toLowerCase();
    return polls.filter(
      (p) =>
        p.question.toLowerCase().includes(lower) ||
        p.creatorName.toLowerCase().includes(lower)
    );
  }, [polls, searchQuery]);

  const voteMutation = useMutation({
    mutationFn: ({ pollId, optionId }: { pollId: string; optionId: string }) =>
      pollRepository.castVote(pollId, optionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.polls.all });
    },
  });

  const createPollMutation = useMutation({
    mutationFn: (dto: CreatePollRequestDto) => pollRepository.createPoll(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.polls.all });
    },
  });

  return {
    polls: filteredPolls,
    rawPollsCount: polls.length,
    searchQuery,
    setSearchQuery,
    isLoading,
    isRefetching,
    isError,
    error,
    refetch,
    handleVote: (pollId: string, optionId: string) => voteMutation.mutate({ pollId, optionId }),
    isVoting: voteMutation.isPending,
    createPoll: (dto: CreatePollRequestDto) => createPollMutation.mutateAsync(dto),
    isCreating: createPollMutation.isPending,
  };
}
