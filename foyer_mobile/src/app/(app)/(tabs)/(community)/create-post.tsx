import React, { useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import {
  AppScreen,
  AppTextField,
  AppButton,
  AppCard,
  AppSectionHeader,
  Caption,
  Body,
} from "@/components/ui";
import { useAppTheme, spacing, radius } from "@/theme";
import {
  CommunityHeader,
  createPost,
} from "@/features/community";
import {
  FileText,
  MessageSquare,
  Image as ImageIcon,
  Send,
  Tag,
} from "lucide-react-native";

export default function CreatePostScreen() {
  const theme = useAppTheme();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<"Discussion" | "Announcement" | "Maintenance">("Discussion");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // TODO: Replace dummy post creation with POST /api/v1/community/posts API call
    await createPost({
      title,
      content,
      category,
    });
    setIsSubmitting(false);

    router.back();
  };

  return (
    <AppScreen scrollable={true} statusBarStyle="auto">
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <CommunityHeader
        title="Create Post"
        showBack={true}
        onBackPress={() => router.back()}
      />

      {/* ─── Post Information Form ─────────────────────────────────────── */}
      <AppSectionHeader title="Post Details" />
      <AppCard variant="outlined" style={styles.cardSection}>
        <AppTextField
          label="Discussion Title"
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Proposal for Solar Panel Installation"
          leftIcon={FileText}
        />
        <AppTextField
          label="Content & Description"
          value={content}
          onChangeText={setContent}
          placeholder="Share your thoughts, announcement details, or question with residents..."
          multiline={true}
          leftIcon={MessageSquare}
        />
      </AppCard>

      {/* ─── Category Selection ────────────────────────────────────────── */}
      <AppSectionHeader title="Post Category" />
      <View style={styles.categoryRow}>
        {(["Discussion", "Announcement", "Maintenance"] as const).map((cat) => (
          <Pressable
            key={cat}
            onPress={() => setCategory(cat)}
            style={[
              styles.categoryChip,
              {
                backgroundColor:
                  category === cat
                    ? theme.colors.secondaryContainer
                    : theme.colors.surface,
                borderColor:
                  category === cat ? theme.colors.secondary : theme.colors.outline,
              },
            ]}
          >
            <Tag
              size={16}
              color={
                category === cat
                  ? theme.colors.onSecondaryContainer
                  : theme.colors.onSurfaceVariant
              }
            />
            <Body
              style={{
                color:
                  category === cat
                    ? theme.colors.onSecondaryContainer
                    : theme.colors.onSurface,
                fontWeight: category === cat ? "700" : "500",
              }}
            >
              {cat}
            </Body>
          </Pressable>
        ))}
      </View>

      {/* ─── Image Attachment Placeholder ─────────────────────────────── */}
      <AppSectionHeader title="Attachments (Optional)" />
      <AppCard variant="outlined" style={styles.attachmentBox}>
        {/* TODO: Image picker library integration */}
        <ImageIcon size={32} color={theme.colors.primary} />
        <Body style={{ color: theme.colors.onSurface, marginTop: spacing.xs }}>
          Tap to Upload Photo / PDF Document
        </Body>
        <Caption style={{ color: theme.colors.outline, marginTop: 2 }}>
          Image Attachment Placeholder (PNG, JPG up to 10MB)
        </Caption>
      </AppCard>

      {/* ─── Submit Action Button ──────────────────────────────────────── */}
      <View style={styles.submitContainer}>
        <AppButton
          label="Publish Post"
          variant="filled"
          size="lg"
          loading={isSubmitting}
          leftIcon={Send}
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
  categoryRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  categoryChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.xs,
  },
  attachmentBox: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    borderStyle: "dashed",
    marginBottom: spacing.md,
  },
  submitContainer: {
    marginVertical: spacing.lg,
  },
});
