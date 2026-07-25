import React from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { AppScreen, AppButton } from "@/components/ui";
import { spacing } from "@/theme";
import {
  useNotices,
  CommunityHeader,
  CommunitySearch,
  NoticeList,
} from "@/features/community";
import { BellRing } from "lucide-react-native";

export default function NoticesListScreen() {
  const router = useRouter();
  const { notices, searchQuery, setSearchQuery, isLoading } = useNotices();

  return (
    <AppScreen scrollable={true} statusBarStyle="auto">
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <CommunityHeader
        title="Notice Board"
        showBack={true}
        onBackPress={() => router.back()}
      />

      {/* ─── Search Bar ─────────────────────────────────────────────────── */}
      <CommunitySearch
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search notices by title or priority..."
      />

      {/* ─── Notice List ────────────────────────────────────────────────── */}
      <NoticeList
        notices={notices}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onResetSearch={() => setSearchQuery("")}
      />

      {/* ─── Floating Action Button ─────────────────────────────────────── */}
      <View style={styles.fabRow}>
        <AppButton
          label="+ Create Notice"
          variant="filled"
          size="md"
          leftIcon={BellRing}
          onPress={() => router.push("/(app)/(tabs)/(community)/notices/create" as any)}
          fullWidth
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  fabRow: {
    marginVertical: spacing.md,
  },
});
