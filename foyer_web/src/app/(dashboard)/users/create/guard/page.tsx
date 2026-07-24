"use client";

import { RoleGuard } from "@/components/guards/RoleGuard";
import { CreateUserForm } from "@/features/users/components/CreateUserForm";

export default function CreateGuardPage() {
  return (
    <RoleGuard allowedRoles={["super_admin", "admin"]}>
      <CreateUserForm
        targetRole="guard"
        title="Create Security Guard"
        description="Onboard gate security personnel for access control and visitor verification."
      />
    </RoleGuard>
  );
}
