import React from "react";
import { View, StyleSheet } from "react-native";
import {
  AppCard,
  Subtitle,
  Body,
  Caption,
  AppStatusPill,
  AppIconButton,
} from "@/components/ui";
import { useAppTheme, spacing, radius } from "@/theme";
import { Phone, ShieldAlert } from "lucide-react-native";
import { EmergencyContact } from "../../shared/types/profile.types";

interface EmergencyContactCardProps {
  contact: EmergencyContact;
  onPress?: (contact: EmergencyContact) => void;
  onCall?: (phone: string) => void;
}

export const EmergencyContactCard = React.memo(function EmergencyContactCard({
  contact,
  onPress,
  onCall,
}: EmergencyContactCardProps) {
  const theme = useAppTheme();

  return (
    <AppCard
      variant="elevated"
      onPress={onPress ? () => onPress(contact) : undefined}
      style={styles.card}
      accessibilityLabel={`Emergency contact: ${contact.name}`}
    >
      <View style={styles.header}>
        <View style={[styles.iconCircle, { backgroundColor: theme.colors.errorContainer }]}>
          <ShieldAlert size={20} color={theme.colors.onErrorContainer} />
        </View>

        <View style={styles.textCol}>
          <View style={styles.nameRow}>
            <Subtitle style={{ color: theme.colors.onSurface, fontSize: 16 }}>
              {contact.name}
            </Subtitle>
            {contact.isPrimary && (
              <AppStatusPill status="pending" label="Primary" />
            )}
          </View>
          <Caption style={{ color: theme.colors.onSurfaceVariant }}>
            {contact.relation} • {contact.phone}
          </Caption>
        </View>

        {onCall && (
          <AppIconButton
            icon={Phone}
            variant="tonal"
            size={40}
            onPress={() => onCall(contact.phone)}
            accessibilityLabel={`Call ${contact.name}`}
          />
        )}
      </View>
    </AppCard>
  );
});

const styles = StyleSheet.create({
  card: {
    marginVertical: spacing.xs,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  textCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
});
