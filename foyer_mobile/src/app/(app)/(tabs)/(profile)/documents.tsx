import React from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { AppScreen, AppSectionHeader, Body } from "@/components/ui";
import { spacing } from "@/theme";
import {
  useDocuments,
  DocumentCard,
  ProfileEmptyState,
} from "@/features/profile";

export default function DocumentsScreen() {
  const router = useRouter();
  const { documents, isLoading } = useDocuments();

  return (
    <AppScreen scrollable={true} statusBarStyle="auto">
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <AppSectionHeader title="Digital Document Vault" />
      <Body style={{ color: "gray", marginBottom: spacing.md }}>
        Verified identity, apartment deed, and vehicle documents associated with your resident profile.
      </Body>

      {/* ─── Documents List / Empty State ───────────────────────────────── */}
      {documents.length === 0 ? (
        <ProfileEmptyState type="documents" />
      ) : (
        <View style={styles.listContainer}>
          {documents.map((doc) => (
            <DocumentCard key={doc.id} document={doc} />
          ))}
        </View>
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    marginVertical: spacing.xs,
    gap: spacing.xs,
  },
});
