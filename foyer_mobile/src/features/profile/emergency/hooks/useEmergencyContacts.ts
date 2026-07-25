import { useState } from "react";
import { EmergencyContact } from "../../shared/types/profile.types";

export function useEmergencyContacts() {
  const [contacts] = useState<EmergencyContact[]>([
    { id: "ec1", name: "Society Security Desk", relation: "Security", phone: "+91 98765 00000", isPrimary: true },
    { id: "ec2", name: "Fire & Safety Response", relation: "Emergency", phone: "101", isPrimary: false },
  ]);
  const [isLoading] = useState(false);

  return {
    contacts,
    isLoading,
    handleRemoveContact: (_id: string) => {},
    handleSetPrimary: (_id: string) => {},
  };
}
