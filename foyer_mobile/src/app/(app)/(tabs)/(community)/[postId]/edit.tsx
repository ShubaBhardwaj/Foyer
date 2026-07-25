import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  AppScreen,
  AppTextField,
  AppButton,
  AppCard,
  AppSectionHeader,
} from "@/components/ui";
import { useAppTheme, spacing } from "@/theme";
import {
  usePostDetails,
  CommunityHeader,
} from "@/features/community";
import { FileText, MessageSquare, Save } from "lucide-react-native";

export default function EditPostScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const { postId } = useLocalSearchParams<{ postId: string }>();

  const { post } = usePostDetails(postId);

  const [title, setTitle] = useState(post?.title ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    setIsSubmitting(true);
    // TODO: Replace dummy save with PATCH /api/v1/community/posts/:id API call
    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsSubmitting(false);

    router.back();
  };

  return (
    <AppScreen scrollable={true} statusBarStyle="auto">
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <CommunityHeader
        title="Edit Post"
        showBack={true}
        onBackPress={() => router.back()}
      />

      {/* ─── Post Form ──────────────────────────────────────────────────── */}
      <AppSectionHeader title="Edit Post Details" />
      <AppCard variant="outlined" style={styles.cardSection}>
        <AppTextField
          label="Discussion Title"
          value={title}
          onChangeText={setTitle}
          leftIcon={FileText}
        />
        <AppTextField
          label="Content & Description"
          value={content}
          onChangeText={setContent}
          multiline={true}
          leftIcon={MessageSquare}
        />
      </AppCard>

      {/* ─── Save Action Button ────────────────────────────────────────── */}
      <View style={styles.submitContainer}>
        <AppButton
          label="Save Changes"
          variant="filled"
          size="lg"
          loading={isSubmitting}
          leftIcon={Save}
          onPress={handleSave}
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
