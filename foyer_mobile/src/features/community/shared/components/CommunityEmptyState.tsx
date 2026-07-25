import React from "react";
import { AppEmptyState } from "@/components/ui";
import { MessageSquareOff, SearchX, Vote, CalendarOff, BellOff } from "lucide-react-native";

interface CommunityEmptyStateProps {
  type?: "posts" | "polls" | "events" | "notices" | "search";
  query?: string;
  onResetSearch?: () => void;
  onActionPress?: () => void;
}

export const CommunityEmptyState = React.memo(function CommunityEmptyState({
  type = "posts",
  query,
  onResetSearch,
  onActionPress,
}: CommunityEmptyStateProps) {
  if (type === "search") {
    return (
      <AppEmptyState
        icon={SearchX}
        title="No Results Found"
        description={
          query
            ? `No records match "${query}". Try adjusting your search query or selected filter.`
            : "No items match your active filter."
        }
        actionLabel={onResetSearch ? "Clear Search Filters" : undefined}
        onActionPress={onResetSearch}
      />
    );
  }

  if (type === "polls") {
    return (
      <AppEmptyState
        icon={Vote}
        title="No Active Polls"
        description="There are no active resident polls right now."
        actionLabel={onActionPress ? "+ Create Poll" : undefined}
        onActionPress={onActionPress}
      />
    );
  }

  if (type === "events") {
    return (
      <AppEmptyState
        icon={CalendarOff}
        title="No Upcoming Events"
        description="No society events scheduled for the near future."
        actionLabel={onActionPress ? "+ Create Event" : undefined}
        onActionPress={onActionPress}
      />
    );
  }

  if (type === "notices") {
    return (
      <AppEmptyState
        icon={BellOff}
        title="No Active Notices"
        description="Notice board is currently clean with no active alerts."
      />
    );
  }

  return (
    <AppEmptyState
      icon={MessageSquareOff}
      title="No Community Discussions"
      description="Be the first resident to start a topic or ask a question!"
      actionLabel={onActionPress ? "+ Start Discussion" : undefined}
      onActionPress={onActionPress}
    />
  );
});
