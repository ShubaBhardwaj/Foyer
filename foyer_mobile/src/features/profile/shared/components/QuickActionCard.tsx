import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { AppCard, Subtitle, Caption } from "@/components/ui";
import { useAppTheme, spacing, radius } from "@/theme";
import { Car, Users, PhoneCall, FileText } from "lucide-react-native";

interface QuickActionCardProps {
  onVehiclesPress: () => void;
  onHouseholdPress: () => void;
  onEmergencyPress: () => void;
  onDocumentsPress: () => void;
}

export const QuickActionCard = React.memo(function QuickActionCard({
  onVehiclesPress,
  onHouseholdPress,
  onEmergencyPress,
  onDocumentsPress,
}: QuickActionCardProps) {
  const theme = useAppTheme();

  const actions = [
    {
      id: "vehicles",
      title: "Vehicles",
      caption: "2 Registered",
      icon: Car,
      onPress: onVehiclesPress,
    },
    {
      id: "household",
      title: "Household",
      caption: "3 Members",
      icon: Users,
      onPress: onHouseholdPress,
    },
    {
      id: "emergency",
      title: "Emergency",
      caption: "3 Contacts",
      icon: PhoneCall,
      onPress: onEmergencyPress,
    },
    {
      id: "documents",
      title: "Documents",
      caption: "Vault Files",
      icon: FileText,
      onPress: onDocumentsPress,
    },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {actions.map((act) => {
        const IconComponent = act.icon;
        return (
          <AppCard
            key={act.id}
            variant="elevated"
            onPress={act.onPress}
            style={styles.card}
            accessibilityLabel={`Quick action ${act.title}`}
          >
            <View style={[styles.iconCircle, { backgroundColor: theme.colors.primaryContainer }]}>
              <IconComponent size={20} color={theme.colors.onPrimaryContainer} />
            </View>
            <Subtitle style={{ color: theme.colors.onSurface, marginTop: spacing.sm, fontSize: 14 }}>
              {act.title}
            </Subtitle>
            <Caption style={{ color: theme.colors.outline, marginTop: 2 }}>
              {act.caption}
            </Caption>
          </AppCard>
        );
      })}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  scrollContent: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  card: {
    width: 120,
    alignItems: "center",
    padding: spacing.md,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
});
