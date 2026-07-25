import React from "react";
import { View, StyleSheet } from "react-native";
import { AppCard, H2, Subtitle, Caption } from "@/components/ui";
import { useAppTheme, spacing } from "@/theme";
import { MessageSquare, Vote, Calendar, Bell } from "lucide-react-native";
import { CommunityStatistic } from "../data/communityDummyData";

interface CommunityStatisticsProps {
  statistics: CommunityStatistic[];
  onStatPress?: (statId: string) => void;
}

export const CommunityStatistics = React.memo(function CommunityStatistics({
  statistics,
  onStatPress,
}: CommunityStatisticsProps) {
  const theme = useAppTheme();

  return (
    <View style={styles.gridContainer}>
      {statistics.map((stat) => {
        const IconComponent = getStatIcon(stat.iconName);
        return (
          <AppCard
            key={stat.id}
            variant="outlined"
            onPress={onStatPress ? () => onStatPress(stat.id) : undefined}
            style={styles.overviewCard}
            accessibilityLabel={`${stat.title}: ${stat.value}`}
          >
            <View style={styles.cardHeader}>
              <Subtitle
                style={{ color: theme.colors.onSurfaceVariant, flex: 1 }}
                numberOfLines={1}
              >
                {stat.title}
              </Subtitle>
              <IconComponent size={18} color={theme.colors.primary} />
            </View>
            <H2 style={{ color: theme.colors.onSurface, marginVertical: spacing.xs }}>
              {stat.value}
            </H2>
            <Caption style={{ color: theme.colors.outline }}>{stat.caption}</Caption>
          </AppCard>
        );
      })}
    </View>
  );
});

function getStatIcon(iconName: CommunityStatistic["iconName"]) {
  switch (iconName) {
    case "MessageSquare":
      return MessageSquare;
    case "Vote":
      return Vote;
    case "Calendar":
      return Calendar;
    case "Bell":
      return Bell;
  }
}

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginVertical: spacing.sm,
  },
  overviewCard: {
    width: "47.5%",
    padding: spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
