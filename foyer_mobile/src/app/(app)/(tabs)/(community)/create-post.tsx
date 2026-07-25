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
    try {
      await createPost({
        content: title ? `${title}\n\n${content}` : content,
        category,
      });
      router.back();
    } catch (err) {
      console.warn("Failed to create post:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppScreen scrollable={true} statusBarStyle="auto">
      <CommunityHeader
        title="Create Post"
        showBack={true}
        onBackPress={() => router.back()}
      />

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
  submitContainer: {
    marginVertical: spacing.lg,
  },
});
