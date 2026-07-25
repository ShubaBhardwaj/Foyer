import React, { useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import {
  AppScreen,
  AppButton,
  AppBottomSheet,
  AppBottomSheetRef,
  Body,
  Subtitle,
} from "@/components/ui";
import { useAppTheme, spacing } from "@/theme";
import {
  useVisitors,
  VisitorHeader,
  VisitorSearch,
  VisitorFilters,
  VisitorStatistics,
  VisitorList,
  VisitorRequest,
} from "@/features/visitors";
import { UserPlus, Shield, QrCode, Eye, CheckCircle2, XCircle } from "lucide-react-native";

export default function VisitorsListScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const bottomSheetRef = useRef<AppBottomSheetRef>(null);
  const [selectedVisitor, setSelectedVisitor] = useState<VisitorRequest | null>(null);

  const {
    searchQuery,
    setSearchQuery,
    selectedFilter,
    setSelectedFilter,
    filters,
    statistics,
    visitors,
    isLoading,
    handleApproveVisitor,
    handleRejectVisitor,
  } = useVisitors();

  const handleVisitorPress = (visitorId: string) => {
    router.push(`/(app)/(tabs)/(visitors)/${visitorId}` as any);
  };

  return (
    <AppScreen scrollable={true} statusBarStyle="auto">
      <VisitorHeader
        title="Visitors"
        rightActionIcon={Shield}
        onRightActionPress={() => {
          router.push("/(app)/(tabs)/(visitors)/pre-approved" as any);
        }}
      />

      <VisitorSearch value={searchQuery} onChangeText={setSearchQuery} />

      <VisitorFilters
        filters={filters as any}
        selectedFilter={selectedFilter as any}
        onSelectFilter={(f) => setSelectedFilter(f)}
      />

      <VisitorStatistics
        statistics={statistics}
        onStatPress={(_statId) => {}}
      />

      <VisitorList
        visitors={visitors}
        onVisitorPress={handleVisitorPress}
        onApproveVisitor={handleApproveVisitor}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onResetSearch={() => setSearchQuery("")}
        onAddVisitor={() => router.push("/(app)/(tabs)/(visitors)/add" as any)}
      />

      <View style={styles.fabRow}>
        <AppButton
          label="Pre-Approved"
          variant="tonal"
          size="md"
          leftIcon={Shield}
          onPress={() => router.push("/(app)/(tabs)/(visitors)/pre-approved" as any)}
        />
        <AppButton
          label="+ Visitor"
          variant="filled"
          size="md"
          leftIcon={UserPlus}
          onPress={() => router.push("/(app)/(tabs)/(visitors)/add" as any)}
        />
      </View>

      <AppBottomSheet
        ref={bottomSheetRef}
        title={selectedVisitor ? selectedVisitor.name : "Visitor Actions"}
      >
        {selectedVisitor && (
          <View style={styles.sheetContent}>
            <Subtitle style={{ color: theme.colors.onSurface }}>
              {selectedVisitor.unit}
            </Subtitle>
            <Body style={{ color: theme.colors.onSurfaceVariant, marginBottom: spacing.md }}>
              {selectedVisitor.purpose}
            </Body>

            <View style={styles.sheetButtons}>
              {selectedVisitor.status === "pending" && (
                <>
                  <AppButton
                    label="Approve Entry"
                    variant="filled"
                    leftIcon={CheckCircle2}
                    onPress={() => {
                      handleApproveVisitor(selectedVisitor.id);
                      bottomSheetRef.current?.close();
                    }}
                    fullWidth
                  />
                  <AppButton
                    label="Reject Entry"
                    variant="danger"
                    leftIcon={XCircle}
                    onPress={() => {
                      handleRejectVisitor(selectedVisitor.id);
                      bottomSheetRef.current?.close();
                    }}
                    fullWidth
                  />
                </>
              )}

              <AppButton
                label="View Complete Details"
                variant="tonal"
                leftIcon={Eye}
                onPress={() => {
                  bottomSheetRef.current?.close();
                  router.push(`/(app)/(tabs)/(visitors)/${selectedVisitor.id}` as any);
                }}
                fullWidth
              />

              <AppButton
                label="View Digital Pass"
                variant="outlined"
                leftIcon={QrCode}
                onPress={() => {
                  bottomSheetRef.current?.close();
                  router.push(`/(app)/(tabs)/(visitors)/${selectedVisitor.id}/qr-pass` as any);
                }}
                fullWidth
              />
            </View>
          </View>
        )}
      </AppBottomSheet>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  fabRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: spacing.md,
  },
  sheetContent: {
    paddingVertical: spacing.sm,
  },
  sheetButtons: {
    gap: spacing.sm,
  },
});
