import React from "react";
import { View, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  AppScreen,
  AppButton,
} from "@/components/ui";
import { spacing } from "@/theme";
import {
  useVisitorDetails,
  VisitorHeader,
  QRCodeCard,
} from "@/features/visitors";
import { Share2, Download } from "lucide-react-native";

export default function VisitorQrPassScreen() {
  const router = useRouter();
  const { visitorId } = useLocalSearchParams<{ visitorId: string }>();

  const { detail } = useVisitorDetails(visitorId);

  const handleShare = () => {
    // TODO: Share pass via native Share sheet / WhatsApp
  };

  const handleDownload = () => {
    // TODO: Download pass image to gallery
  };

  return (
    <AppScreen scrollable={true} statusBarStyle="auto">
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <VisitorHeader
        title="Visitor Pass"
        showBack={true}
        onBackPress={() => router.back()}
      />

      {/* ─── QR Code Digital Pass Card ──────────────────────────────────── */}
      <QRCodeCard
        visitorName={detail?.name ?? "John Doe"}
        unit={`${detail?.resident?.tower ?? "Tower A"} • ${detail?.resident?.flat ?? "Flat 302"}`}
        visitorIdCode={detail?.visitorIdCode ?? "FYR-VIS-2026-001"}
        status={detail?.status ?? "approved"}
      />

      {/* ─── Action Buttons ────────────────────────────────────────────── */}
      <View style={styles.buttonGroup}>
        <AppButton
          label="Share Pass"
          variant="filled"
          size="lg"
          leftIcon={Share2}
          onPress={handleShare}
          fullWidth
        />
        <AppButton
          label="Download Pass"
          variant="outlined"
          size="lg"
          leftIcon={Download}
          onPress={handleDownload}
          fullWidth
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  buttonGroup: {
    gap: spacing.sm,
    marginVertical: spacing.lg,
  },
});
