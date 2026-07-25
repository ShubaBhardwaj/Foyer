import React from "react";
import { View, StyleSheet } from "react-native";
import { AppCard, Subtitle } from "@/components/ui";
import { useAppTheme, spacing, radius } from "@/theme";
import { MessageSquarePlus, Vote, CalendarPlus, BellRing } from "lucide-react-native";

interface QuickActionsProps {
  onCreatePost: () => void;
  onCreatePoll: () => void;
  onCreateEvent: () => void;
  onViewNotices: () => void;
}

export const QuickActions = React.memo(function QuickActions({
  onCreatePost,
  onCreatePoll,
  onCreateEvent,
  onViewNotices,
}: QuickActionsProps) {
  const theme = useAppTheme();

  const actions = [
    {
      id: "post",
      label: "+ Post",
      icon: MessageSquarePlus,
      onPress: onCreatePost,
    },
    {
      id: "poll",
      label: "+ Poll",
      icon: Vote,
      onPress: onCreatePoll,
    },
    {
      id: "event",
      label: "+ Event",
      icon: CalendarPlus,
      onPress: onCreateEvent,
    },
    {
      id: "notices",
      label: "Notices",
      icon: BellRing,
      onPress: onViewNotices,
    },
  ];

  return (
    <View style={styles.gridContainer}>
      {actions.map((action) => {
        const IconComponent = action.icon;
        return (
          <AppCard
            key={action.id}
            variant="elevated"
            onPress={action.onPress}
            style={styles.card}
            accessibilityLabel={action.label}
          >
            <View
              style={[
                styles.iconBg,
                { backgroundColor: theme.colors.primaryContainer },
              ]}
            >
              <IconComponent size={22} color={theme.colors.onPrimaryContainer} />
            </View>
            <Subtitle
              style={{
                color: theme.colors.onSurface,
                marginTop: spacing.sm,
                textAlign: "center",
              }}
            >
              {action.label}
            </Subtitle>
          </AppCard>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginVertical: spacing.sm,
  },
  card: {
    width: "47.5%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.lg,
  },
  iconBg: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
});
