import React from "react";
import { View, StyleSheet } from "react-native";
import {
  AppCard,
  Subtitle,
  Body,
  Caption,
  AppStatusPill,
} from "@/components/ui";
import { useAppTheme, spacing, radius } from "@/theme";
import { FileText, ShieldCheck, Car, FileCheck } from "lucide-react-native";
import { DigitalDocument } from "../../shared/types/profile.types";

interface DocumentCardProps {
  document: DigitalDocument;
  onPress?: (document: DigitalDocument) => void;
}

export const DocumentCard = React.memo(function DocumentCard({
  document,
  onPress,
}: DocumentCardProps) {
  const theme = useAppTheme();
  const IconComponent = getDocumentIcon(document.type);

  return (
    <AppCard
      variant="elevated"
      onPress={onPress ? () => onPress(document) : undefined}
      style={styles.card}
      accessibilityLabel={`Document ${document.title}`}
    >
      <View style={styles.header}>
        <View style={[styles.typeIcon, { backgroundColor: theme.colors.primaryContainer }]}>
          <IconComponent size={22} color={theme.colors.onPrimaryContainer} />
        </View>

        <View style={styles.textCol}>
          <Subtitle style={{ color: theme.colors.onSurface, fontSize: 16 }}>
            {document.title}
          </Subtitle>
          <Caption style={{ color: theme.colors.onSurfaceVariant }}>
            {document.type} • Number: {document.docNumber}
          </Caption>
        </View>

        <AppStatusPill
          status={document.status === "Verified" ? "approved" : "pending"}
          label={document.status}
        />
      </View>
    </AppCard>
  );
});

function getDocumentIcon(type: DigitalDocument["type"]) {
  switch (type) {
    case "Vehicle RC":
      return Car;
    case "Aadhaar":
    case "PAN":
      return ShieldCheck;
    case "Rental Agreement":
    case "Society ID":
    default:
      return FileText;
  }
}

const styles = StyleSheet.create({
  card: {
    marginVertical: spacing.xs,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  typeIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  textCol: {
    flex: 1,
  },
});
