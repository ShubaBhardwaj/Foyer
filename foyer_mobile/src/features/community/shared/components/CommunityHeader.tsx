import React from "react";
import { View, StyleSheet } from "react-native";
import { H1, Title, AppIconButton } from "@/components/ui";
import { useAppTheme, spacing } from "@/theme";
import { ArrowLeft, Bell } from "lucide-react-native";

interface CommunityHeaderProps {
  title: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightActionIcon?: any;
  onRightActionPress?: () => void;
}

export const CommunityHeader = React.memo(function CommunityHeader({
  title,
  showBack = false,
  onBackPress,
  rightActionIcon: RightIcon = Bell,
  onRightActionPress,
}: CommunityHeaderProps) {
  const theme = useAppTheme();

  return (
    <View style={styles.container}>
      <View style={styles.leftSlot}>
        {showBack ? (
          <AppIconButton
            icon={ArrowLeft}
            variant="outlined"
            size={40}
            onPress={onBackPress}
            accessibilityLabel="Go back"
          />
        ) : null}
        {showBack ? (
          <Title style={{ color: theme.colors.onBackground, marginLeft: spacing.sm }}>
            {title}
          </Title>
        ) : (
          <H1 style={{ color: theme.colors.onBackground }}>{title}</H1>
        )}
      </View>
      <View style={styles.rightSlot}>
        <AppIconButton
          icon={RightIcon}
          variant="tonal"
          size={40}
          onPress={onRightActionPress}
          accessibilityLabel="Header notification"
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
    marginBottom: spacing.xs,
  },
  leftSlot: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  rightSlot: {
    flexDirection: "row",
    alignItems: "center",
  },
});
