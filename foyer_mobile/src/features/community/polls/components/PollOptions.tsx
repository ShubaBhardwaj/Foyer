import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Body, Caption, Label } from "@/components/ui";
import { useAppTheme, spacing, radius } from "@/theme";
import { CheckCircle2 } from "lucide-react-native";
import { PollOption } from "../types/poll.types";

interface PollOptionsProps {
  options: PollOption[];
  userVotedOptionId?: string;
  isClosed?: boolean;
  onVoteOption: (optionId: string) => void;
}

export const PollOptions = React.memo(function PollOptions({
  options,
  userVotedOptionId,
  isClosed = false,
  onVoteOption,
}: PollOptionsProps) {
  const theme = useAppTheme();
  const hasVoted = Boolean(userVotedOptionId);

  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isSelected = userVotedOptionId === option.id;
        return (
          <Pressable
            key={option.id}
            onPress={() => (!hasVoted && !isClosed ? onVoteOption(option.id) : undefined)}
            disabled={hasVoted || isClosed}
            style={[
              styles.optionBox,
              {
                borderColor: isSelected ? theme.colors.primary : theme.colors.outline,
                backgroundColor: theme.colors.surface,
              },
            ]}
          >
            {/* Background percentage fill bar */}
            {(hasVoted || isClosed) && (
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${option.percentage}%`,
                    backgroundColor: isSelected
                      ? theme.colors.primaryContainer
                      : theme.colors.secondaryContainer,
                  },
                ]}
              />
            )}

            <View style={styles.contentRow}>
              <View style={styles.textRow}>
                {isSelected && (
                  <CheckCircle2 size={16} color={theme.colors.primary} style={styles.checkIcon} />
                )}
                <Body
                  style={{
                    color: theme.colors.onSurface,
                    fontWeight: isSelected ? "700" : "500",
                    flex: 1,
                  }}
                >
                  {option.text}
                </Body>
              </View>

              {(hasVoted || isClosed) && (
                <Label style={{ color: theme.colors.primary, fontWeight: "700", marginLeft: spacing.sm }}>
                  {option.percentage}% ({option.votesCount})
                </Label>
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    marginVertical: spacing.sm,
  },
  optionBox: {
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    overflow: "hidden",
    justifyContent: "center",
  },
  progressFill: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.85,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 1,
  },
  textRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  checkIcon: {
    marginRight: spacing.xs,
  },
});
