import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import {
  AppScreen,
  AppTextField,
  AppButton,
  AppCard,
  AppSectionHeader,
} from "@/components/ui";
import { useAppTheme, spacing } from "@/theme";
import { CommunityHeader } from "@/features/community";
import { HelpCircle, ListFilter, Calendar, Vote } from "lucide-react-native";

export default function CreatePollScreen() {
  const theme = useAppTheme();
  const router = useRouter();

  const [question, setQuestion] = useState("");
  const [description, setDescription] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [option4, setOption4] = useState("");
  const [endDate, setEndDate] = useState("30 Jul 2026");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // TODO: Replace dummy poll creation with POST /api/v1/community/polls API call
    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsSubmitting(false);

    router.back();
  };

  return (
    <AppScreen scrollable={true} statusBarStyle="auto">
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <CommunityHeader
        title="Create Poll"
        showBack={true}
        onBackPress={() => router.back()}
      />

      {/* ─── Poll Question ──────────────────────────────────────────────── */}
      <AppSectionHeader title="Poll Topic" />
      <AppCard variant="outlined" style={styles.cardSection}>
        <AppTextField
          label="Poll Question"
          value={question}
          onChangeText={setQuestion}
          placeholder="e.g. Should we convert lawn to a tennis court?"
          leftIcon={HelpCircle}
        />
        <AppTextField
          label="Context / Description (Optional)"
          value={description}
          onChangeText={setDescription}
          placeholder="Provide additional details or timeline estimates..."
          multiline={true}
        />
      </AppCard>

      {/* ─── Voting Options ─────────────────────────────────────────────── */}
      <AppSectionHeader title="Voting Options" />
      <AppCard variant="outlined" style={styles.cardSection}>
        <AppTextField
          label="Option 1"
          value={option1}
          onChangeText={setOption1}
          placeholder="e.g. Yes, support proposal"
          leftIcon={ListFilter}
        />
        <AppTextField
          label="Option 2"
          value={option2}
          onChangeText={setOption2}
          placeholder="e.g. No, keep current area"
          leftIcon={ListFilter}
        />
        <AppTextField
          label="Option 3 (Optional)"
          value={option3}
          onChangeText={setOption3}
          placeholder="e.g. Neutral / Needs discussion"
          leftIcon={ListFilter}
        />
        <AppTextField
          label="Option 4 (Optional)"
          value={option4}
          onChangeText={setOption4}
          placeholder="e.g. Alternative suggestion"
          leftIcon={ListFilter}
        />
      </AppCard>

      {/* ─── Poll Duration ──────────────────────────────────────────────── */}
      <AppSectionHeader title="Voting Deadline" />
      <AppCard variant="outlined" style={styles.cardSection}>
        <AppTextField
          label="Poll End Date"
          value={endDate}
          onChangeText={setEndDate}
          leftIcon={Calendar}
        />
      </AppCard>

      {/* ─── Submit Action Button ──────────────────────────────────────── */}
      <View style={styles.submitContainer}>
        <AppButton
          label="Publish Poll"
          variant="filled"
          size="lg"
          loading={isSubmitting}
          leftIcon={Vote}
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
  submitContainer: {
    marginVertical: spacing.lg,
  },
});
