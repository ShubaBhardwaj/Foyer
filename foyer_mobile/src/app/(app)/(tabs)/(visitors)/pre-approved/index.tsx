import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import {
  AppScreen,
  AppCard,
  AppButton,
} from "@/components/ui";
import { spacing } from "@/theme";
import {
  useVisitors,
  VisitorHeader,
  VisitorSearch,
  GuestCard,
  VisitorEmptyState,
} from "@/features/visitors";
import { UserPlus } from "lucide-react-native";

export default function PreApprovedGuestsScreen() {
  const router = useRouter();
  const { searchQuery, setSearchQuery, guests } = useVisitors();

  return (
    <AppScreen scrollable={true} statusBarStyle="auto">
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <VisitorHeader
        title="Pre Approved Guests"
        showBack={true}
        onBackPress={() => router.back()}
      />

      {/* ─── Search Bar ─────────────────────────────────────────────────── */}
      <VisitorSearch
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search guest name or resident..."
      />

      {/* ─── Guest List / Empty State ───────────────────────────────────── */}
      {guests.length === 0 ? (
        <VisitorEmptyState
          type={searchQuery ? "search" : "empty"}
          query={searchQuery}
          onResetSearch={() => setSearchQuery("")}
          onAddVisitor={() => router.push("/(app)/(tabs)/(visitors)/pre-approved/add" as any)}
        />
      ) : (
        <AppCard variant="elevated" style={styles.listCard}>
          {guests.map((guest, index) => (
            <GuestCard
              key={guest.id}
              guest={guest}
              onPress={() => {
                // TODO: Open guest pass details modal/screen
              }}
              divider={index < guests.length - 1}
            />
          ))}
        </AppCard>
      )}

      {/* ─── Floating Action Button ─────────────────────────────────────── */}
      <View style={styles.fabRow}>
        <AppButton
          label="+ Pre-Approve Guest"
          variant="filled"
          size="md"
          leftIcon={UserPlus}
          onPress={() => router.push("/(app)/(tabs)/(visitors)/pre-approved/add" as any)}
          fullWidth
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  listCard: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    marginVertical: spacing.md,
    overflow: "hidden",
  },
  fabRow: {
    marginVertical: spacing.md,
  },
});
