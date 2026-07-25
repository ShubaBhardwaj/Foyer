import React from "react";
import { View, StyleSheet } from "react-native";
import { AppLoader } from "@/components/ui";
import { NoticeCard } from "./NoticeCard";
import { CommunityEmptyState } from "../../shared/components/CommunityEmptyState";
import { CommunityNotice } from "../types/notice.types";

interface NoticeListProps {
  notices: CommunityNotice[];
  onNoticePress?: (noticeId: string) => void;
  isLoading?: boolean;
  searchQuery?: string;
  onResetSearch?: () => void;
}

export const NoticeList = React.memo(function NoticeList({
  notices,
  onNoticePress,
  isLoading = false,
  searchQuery,
  onResetSearch,
}: NoticeListProps) {
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        {/* TODO: Replace with backend loading state */}
        <AppLoader mode="skeleton" skeletonVariant="card" />
        <AppLoader mode="skeleton" skeletonVariant="card" />
      </View>
    );
  }

  if (notices.length === 0) {
    return (
      <CommunityEmptyState
        type={searchQuery ? "search" : "notices"}
        query={searchQuery}
        onResetSearch={onResetSearch}
      />
    );
  }

  return (
    <View style={styles.listContainer}>
      {notices.map((notice) => (
        <NoticeCard key={notice.id} notice={notice} onPress={onNoticePress} />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  loadingContainer: {
    marginVertical: 12,
    gap: 12,
  },
  listContainer: {
    marginVertical: 4,
    gap: 8,
  },
});
