import React from "react";
import { View, StyleSheet } from "react-native";
import { AppCard, Title, Body, Caption, AppStatusPill } from "@/components/ui";
import { useAppTheme, spacing, radius } from "@/theme";
import { QrCode, ShieldCheck } from "lucide-react-native";

interface QRCodeCardProps {
  visitorName: string;
  unit: string;
  visitorIdCode: string;
  status?: "pending" | "approved" | "rejected";
}

export const QRCodeCard = React.memo(function QRCodeCard({
  visitorName,
  unit,
  visitorIdCode,
  status = "approved",
}: QRCodeCardProps) {
  const theme = useAppTheme();

  return (
    <AppCard variant="elevated" style={styles.card}>
      <View style={styles.header}>
        <Title center style={{ color: theme.colors.onSurface }}>
          {visitorName}
        </Title>
        <Body center style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}>
          {unit}
        </Body>
        <View style={{ marginTop: spacing.sm, alignSelf: "center" }}>
          <AppStatusPill status={status} />
        </View>
      </View>

      {/* ─── QR Code Placeholder Frame ─────────────────────────────────── */}
      <View style={[styles.qrFrame, { borderColor: theme.colors.outline, backgroundColor: theme.colors.surfaceVariant ?? "#F5F0E8" }]}>
        {/* TODO: Generate QR code using backend data & react-native-qrcode-svg */}
        <QrCode size={140} color={theme.colors.primary} />
        <Caption style={{ color: theme.colors.outline, marginTop: spacing.sm }}>
          ---------------------------------------
        </Caption>
        <Caption style={{ color: theme.colors.onSurfaceVariant, fontWeight: "600" }}>
          QR CODE PLACEHOLDER
        </Caption>
        <Caption style={{ color: theme.colors.outline }}>
          ---------------------------------------
        </Caption>
      </View>

      <View style={styles.footer}>
        <View style={styles.passCodeBadge}>
          <ShieldCheck size={16} color={theme.colors.primary} />
          <Caption style={{ color: theme.colors.primary, fontWeight: "700" }}>
            PASS ID: {visitorIdCode}
          </Caption>
        </View>
        <Caption style={{ color: theme.colors.outline, marginTop: spacing.xs, textAlign: "center" }}>
          Scan at Gate 1 or Gate 2 security kiosk for automated check-in
        </Caption>
      </View>
    </AppCard>
  );
});

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    padding: spacing.xl,
    marginVertical: spacing.md,
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.md,
  },
  qrFrame: {
    width: 220,
    height: 220,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.md,
    marginVertical: spacing.md,
  },
  footer: {
    alignItems: "center",
    marginTop: spacing.sm,
  },
  passCodeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
});
