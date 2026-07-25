import { useState, useCallback } from "react";
import { emergencyContactsData } from "../../shared/data/profileDummyData";
import { EmergencyContact } from "../../shared/types/profile.types";

export function useEmergencyContacts() {
  const [contacts, setContacts] = useState<EmergencyContact[]>(emergencyContactsData);
  const [isLoading, setIsLoading] = useState(false);

  const handleRemoveContact = useCallback((contactId: string) => {
    // TODO: Call DELETE /api/v1/emergency-contacts/:id API endpoint
    setContacts((prev) => prev.filter((c) => c.id !== contactId));
  }, []);

  const handleSetPrimary = useCallback((contactId: string) => {
    // TODO: Call POST /api/v1/emergency-contacts/:id/primary API endpoint
    setContacts((prev) =>
      prev.map((c) => ({ ...c, isPrimary: c.id === contactId }))
    );
  }, []);

  return {
    contacts,
    rawCount: contacts.length,
    isLoading,
    setIsLoading,
    handleRemoveContact,
    handleSetPrimary,
  };
}
