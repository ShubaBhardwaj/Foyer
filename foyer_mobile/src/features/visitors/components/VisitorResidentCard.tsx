import React from "react";
import { View, StyleSheet } from "react-native";
import {
  AppCard,
  AppSectionHeader,
  AppListRow,
  AppAvatar,
} from "@/components/ui";
import { Phone, Building2 } from "lucide-react-native";
import { ResidentHostInfo } from "../types";

interface VisitorResidentCardProps {
  resident: ResidentHostInfo;
  onCallResident?: () => void;
}

export const VisitorResidentCard = React.memo(function VisitorResidentCard({
  resident,
  onCallResident,
}: VisitorResidentCardProps) {
  return (
    <View style={styles.container}>
      <AppSectionHeader title="Host Resident" />
      <AppCard variant="outlined" style={styles.card}>
        <AppListRow
          title={resident.name}
          subtitle={`${resident.tower} • ${resident.flat}`}
          leading={
            <AppAvatar mode="initials" initials={getInitials(resident.name)} size="md" />
          }
          trailing={
            onCallResident ? (
              <Phone size={18} />
            ) : null
          }
          divider={false}
          onPress={onCallResident}
        />
      </AppCard>
    </View>
  );
});

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  card: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    overflow: "hidden",
  },
});
