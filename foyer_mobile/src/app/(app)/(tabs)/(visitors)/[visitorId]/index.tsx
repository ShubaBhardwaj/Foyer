import React, { useRef } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  AppScreen,
  AppBottomSheet,
  AppBottomSheetRef,
  AppLoader,
  Body,
  Title,
} from "@/components/ui";
import { useAppTheme, spacing } from "@/theme";
import {
  useVisitorDetails,
  VisitorHeader,
  VisitorDetailsCard,
  VisitorResidentCard,
  VisitorActions,
} from "@/features/visitors";
import { Edit, QrCode } from "lucide-react-native";

export default function VisitorDetailsScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const { visitorId } = useLocalSearchParams<{ visitorId: string }>();
  const reasonSheetRef = useRef<AppBottomSheetRef>(null);

  const {
    detail,
    isLoading,
    handleApprove,
    handleReject,
    handleMarkEntry,
  } = useVisitorDetails(visitorId);

  if (isLoading || !detail) {
    return (
      <AppScreen scrollable={false}>
        {/* TODO: Replace with backend loading state */}
        <AppLoader mode="fullscreen" message="Loading visitor details..." />
      </AppScreen>
    );
  }

  return (
    <AppScreen scrollable={true} statusBarStyle="auto">
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <VisitorHeader
        title="Visitor Details"
        showBack={true}
        onBackPress={() => router.back()}
        rightActionIcon={Edit}
        onRightActionPress={() => {
          // TODO: Navigate to Edit Visitor screen
          router.push(`/(app)/(tabs)/(visitors)/${detail.id}/edit` as any);
        }}
      />

      {/* ─── Visitor Details Card ───────────────────────────────────────── */}
      <VisitorDetailsCard detail={detail} />

      {/* ─── Host Resident Card ─────────────────────────────────────────── */}
      <VisitorResidentCard
        resident={detail.resident}
        onCallResident={() => {
          // TODO: Trigger phone call or chat with resident
        }}
      />

      {/* ─── Visitor Actions ───────────────────────────────────────────── */}
      <VisitorActions
        status={detail.status}
        onApprove={handleApprove}
        onReject={handleReject}
        onMarkEntry={handleMarkEntry}
        onCancel={() => handleReject("Cancelled by Society Admin")}
        onViewReason={() => reasonSheetRef.current?.expand()}
        onEdit={() => router.push(`/(app)/(tabs)/(visitors)/${detail.id}/edit` as any)}
        onViewQrPass={() => router.push(`/(app)/(tabs)/(visitors)/${detail.id}/qr-pass` as any)}
      />

      {/* ─── Rejection Reason Bottom Sheet ────────────────────────────── */}
      <AppBottomSheet ref={reasonSheetRef} title="Denial Reason Details">
        <View style={styles.sheetContent}>
          <Title style={{ color: theme.colors.error, marginBottom: spacing.xs }}>
            Entry Denied
          </Title>
          <Body style={{ color: theme.colors.onSurfaceVariant }}>
            {detail.rejectionReason ?? "No detailed denial reason provided."}
          </Body>
        </View>
      </AppBottomSheet>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  sheetContent: {
    paddingVertical: spacing.md,
  },
});
