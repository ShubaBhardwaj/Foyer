import React from "react";
import { AppEmptyState } from "@/components/ui";
import { UserX, SearchX } from "lucide-react-native";

interface VisitorEmptyStateProps {
  type?: "empty" | "search";
  query?: string;
  onResetSearch?: () => void;
  onAddVisitor?: () => void;
}

export const VisitorEmptyState = React.memo(function VisitorEmptyState({
  type = "empty",
  query,
  onResetSearch,
  onAddVisitor,
}: VisitorEmptyStateProps) {
  if (type === "search") {
    return (
      <AppEmptyState
        icon={SearchX}
        title="No Visitors Found"
        description={
          query
            ? `No records match "${query}". Try adjusting your search query or filters.`
            : "No records match your selected filters."
        }
        actionLabel={onResetSearch ? "Clear Search Filters" : undefined}
        onActionPress={onResetSearch}
      />
    );
  }

  return (
    <AppEmptyState
      icon={UserX}
      title="No Visitor Activity"
      description="There are no visitor entries recorded for today yet."
      actionLabel={onAddVisitor ? "+ Add New Visitor" : undefined}
      onActionPress={onAddVisitor}
    />
  );
});
