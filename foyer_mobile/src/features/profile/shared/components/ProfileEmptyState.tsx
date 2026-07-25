import React from "react";
import { AppEmptyState } from "@/components/ui";
import { Car, Users, PhoneOff, FileX } from "lucide-react-native";

interface ProfileEmptyStateProps {
  type?: "vehicles" | "contacts" | "documents" | "household";
  onActionPress?: () => void;
}

export const ProfileEmptyState = React.memo(function ProfileEmptyState({
  type = "vehicles",
  onActionPress,
}: ProfileEmptyStateProps) {
  if (type === "household") {
    return (
      <AppEmptyState
        icon={Users}
        title="No Additional Household Members"
        description="No additional family members, tenants, or helpers registered under this flat."
        actionLabel={onActionPress ? "+ Invite Member" : undefined}
        onActionPress={onActionPress}
      />
    );
  }

  if (type === "contacts") {
    return (
      <AppEmptyState
        icon={PhoneOff}
        title="No Emergency Contacts"
        description="Add emergency contacts for quick assistance during urgent situations."
        actionLabel={onActionPress ? "+ Add Contact" : undefined}
        onActionPress={onActionPress}
      />
    );
  }

  if (type === "documents") {
    return (
      <AppEmptyState
        icon={FileX}
        title="No Digital Documents"
        description="Your digital document vault is currently empty."
      />
    );
  }

  return (
    <AppEmptyState
      icon={Car}
      title="No Registered Vehicles"
      description="No cars, two-wheelers, or EVs registered for your flat parking allocation."
      actionLabel={onActionPress ? "+ Register Vehicle" : undefined}
      onActionPress={onActionPress}
    />
  );
});
