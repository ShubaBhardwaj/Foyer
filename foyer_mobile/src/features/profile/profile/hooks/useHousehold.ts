import { useState, useCallback } from "react";
import { householdMembersData } from "../../shared/data/profileDummyData";
import { HouseholdMember } from "../../shared/types/profile.types";

export function useHousehold() {
  const [members, setMembers] = useState<HouseholdMember[]>(householdMembersData);
  const [isLoading, setIsLoading] = useState(false);

  const handleRemoveMember = useCallback((memberId: string) => {
    // TODO: Call DELETE /api/v1/household/:id API endpoint
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
  }, []);

  const handleVerifyMember = useCallback((memberId: string) => {
    // TODO: Call POST /api/v1/household/:id/verify API endpoint
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, isVerified: true } : m))
    );
  }, []);

  return {
    members,
    rawCount: members.length,
    isLoading,
    setIsLoading,
    handleRemoveMember,
    handleVerifyMember,
  };
}
