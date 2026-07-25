import React, { useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import {
  AppScreen,
  AppTextField,
  AppButton,
  AppCard,
  AppSectionHeader,
  Body,
} from "@/components/ui";
import { useAppTheme, spacing, radius } from "@/theme";
import { CommunityHeader } from "@/features/community";
import {
  FileText,
  MessageSquare,
  Calendar,
  BellRing,
  AlertTriangle,
} from "lucide-react-native";

export default function CreateNoticeScreen() {
  const theme = useAppTheme();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"Emergency" | "Important" | "Maintenance" | "General">("Important");
  const [date, setDate] = useState("Today, 25 Jul 2026");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // TODO: Replace dummy notice creation with POST /api/v1/community/notices API call
    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsSubmitting(false);

    router.back();
  };

  return (
    <AppScreen scrollable={true} statusBarStyle="auto">
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <CommunityHeader
        title="Create Notice"
        showBack={true}
        onBackPress={() => router.back()}
      />

      {/* ─── Notice Details ─────────────────────────────────────────────── */}
      <AppSectionHeader title="Notice Details" />
      <AppCard variant="outlined" style={styles.cardSection}>
        <AppTextField
          label="Notice Title"
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Scheduled Elevator Maintenance Shutdown"
          leftIcon={FileText}
        />
        <AppTextField
          label="Notice Description & Instructions"
          value={description}
          onChangeText={setDescription}
          placeholder="Provide complete notice information, affected towers, and timings..."
          multiline={true}
          leftIcon={MessageSquare}
        />
      </AppCard>

      {/* ─── Priority Selection ────────────────────────────────────────── */}
      <AppSectionHeader title="Notice Priority" />
      <View style={styles.priorityGrid}>
        {(["Emergency", "Important", "Maintenance", "General"] as const).map((p) => {
          const isSelected = priority === p;
          return (
            <Pressable
              key={p}
              onPress={() => setPriority(p)}
              style={[
                styles.priorityChip,
                {
                  backgroundColor: isSelected
                    ? theme.colors.secondaryContainer
                    : theme.colors.surface,
                  borderColor: isSelected
                    ? theme.colors.secondary
                    : theme.colors.outline,
                },
              ]}
            >
              <AlertTriangle
                size={16}
                color={
                  isSelected
                    ? theme.colors.onSecondaryContainer
                    : theme.colors.onSurfaceVariant
                }
              />
              <Body
                style={{
                  color: isSelected
                    ? theme.colors.onSecondaryContainer
                    : theme.colors.onSurface,
                  fontWeight: isSelected ? "700" : "500",
                }}
              >
                {p}
              </Body>
            </Pressable>
          );
        })}
      </View>

      {/* ─── Issue Date ─────────────────────────────────────────────────── */}
      <AppSectionHeader title="Schedule & Date" />
      <AppCard variant="outlined" style={styles.cardSection}>
        <AppTextField
          label="Issue Date"
          value={date}
          onChangeText={setDate}
          leftIcon={Calendar}
        />
      </AppCard>

      {/* ─── Submit Action Button ──────────────────────────────────────── */}
      <View style={styles.submitContainer}>
        <AppButton
          label="Publish Notice"
          variant="filled"
          size="lg"
          loading={isSubmitting}
          leftIcon={BellRing}
          onPress={handleSubmit}
          fullWidth
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  cardSection: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  priorityGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  priorityChip: {
    width: "47.5%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.xs,
  },
  submitContainer: {
    marginVertical: spacing.lg,
  },
});
