import { useState, useMemo } from "react";
import { communityNotices } from "../../shared/data/communityDummyData";
import { CommunityNotice } from "../types/notice.types";

export function useNotices() {
  const [notices, setNotices] = useState<CommunityNotice[]>(communityNotices);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const filteredNotices = useMemo(() => {
    return notices.filter(
      (notice) =>
        searchQuery.trim() === "" ||
        notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notice.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notice.priority.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [notices, searchQuery]);

  return {
    notices: filteredNotices,
    rawNoticesCount: notices.length,
    searchQuery,
    setSearchQuery,
    isLoading,
    setIsLoading,
  };
}
