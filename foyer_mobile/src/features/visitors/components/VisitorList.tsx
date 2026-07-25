import React from "react";
import { View, StyleSheet } from "react-native";
import { AppCard, AppLoader } from "@/components/ui";
import { VisitorCard } from "./VisitorCard";
import { VisitorEmptyState } from "./VisitorEmptyState";
import { VisitorRequest } from "../types";

interface VisitorListProps {
  visitors: VisitorRequest[];
  onVisitorPress: (visitorId: string) => void;
  onApproveVisitor?: (visitorId: string) => void;
  isLoading?: boolean;
  searchQuery?: string;
  onResetSearch?: () => void;
  onAddVisitor?: () => void;
}

export const VisitorList = React.memo(function VisitorList({
  visitors,
  onVisitorPress,
  onApproveVisitor,
  isLoading = false,
  searchQuery,
  onResetSearch,
  onAddVisitor,
}: VisitorListProps) {
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        {/* TODO: Replace with backend loading state */}
        <AppLoader mode="skeleton" skeletonVariant="list-row" />
        <AppLoader mode="skeleton" skeletonVariant="list-row" />
        <AppLoader mode="skeleton" skeletonVariant="list-row" />
      </View>
    );
  }

  if (visitors.length === 0) {
    return (
      <VisitorEmptyState
        type={searchQuery ? "search" : "empty"}
        query={searchQuery}
        onResetSearch={onResetSearch}
        onAddVisitor={onAddVisitor}
      />
    );
  }

  return (
    <AppCard variant="elevated" style={styles.listCard}>
      {visitors.map((visitor, index) => (
        <VisitorCard
          key={visitor.id}
          visitor={visitor}
          onPress={onVisitorPress}
          onApprove={onApproveVisitor}
          divider={index < visitors.length - 1}
        />
      ))}
    </AppCard>
  );
});

const styles = StyleSheet.create({
  loadingContainer: {
    marginVertical: 12,
  },
  listCard: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    marginVertical: 8,
    overflow: "hidden",
  },
});
