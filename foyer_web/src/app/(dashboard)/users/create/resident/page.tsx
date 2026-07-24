"use client";

import { RoleGuard } from "@/components/guards/RoleGuard";
import { CreateUserForm } from "@/features/users/components/CreateUserForm";

export default function CreateResidentPage() {
  return (
    <RoleGuard allowedRoles={["super_admin", "admin"]}>
      <CreateUserForm
        targetRole="resident"
        title="Create Society Resident"
        description="Onboard a resident. Requires mandatory Tower and Flat allocation."
        isResidenceMandatory
      />
    </RoleGuard>
  );
}
