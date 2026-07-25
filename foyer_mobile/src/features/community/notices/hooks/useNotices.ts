import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { noticeRepository } from "@/repositories/notice.repository";
import { CommunityNotice } from "../types/notice.types";

export function useNotices() {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data,
    isLoading,
    isRefetching,
    refetch,
    isError,
    error,
  } = useQuery({
    queryKey: queryKeys.notices.list(),
    queryFn: () => noticeRepository.fetchNoticesList(),
  });

  const notices = useMemo<CommunityNotice[]>(() => {
    const list = data?.notices || [];
    return list.map((n) => ({
      id: n._id,
      _id: n._id,
      title: n.title,
      description: n.content,
      date: n.createdAt ? new Date(n.createdAt).toLocaleDateString() : "Recent",
      priority: n.category === "EMERGENCY" ? "Emergency" : n.category === "MAINTENANCE" ? "Maintenance" : n.isPinned ? "Important" : "General",
      isPinned: n.isPinned,
      category: "Notice" as const,
    }));
  }, [data?.notices]);

  const filteredNotices = useMemo(() => {
    if (!searchQuery.trim()) return notices;
    const lower = searchQuery.toLowerCase();
    return notices.filter(
      (n) =>
        n.title.toLowerCase().includes(lower) ||
        n.description.toLowerCase().includes(lower)
    );
  }, [notices, searchQuery]);

  return {
    notices: filteredNotices,
    rawNoticesCount: notices.length,
    searchQuery,
    setSearchQuery,
    isLoading,
    isRefetching,
    isError,
    error,
    refetch,
  };
}
