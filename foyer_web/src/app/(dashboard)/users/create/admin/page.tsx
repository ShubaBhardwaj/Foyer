"use client";

import { RoleGuard } from "@/components/guards/RoleGuard";
import { CreateUserForm } from "@/features/users/components/CreateUserForm";

export default function CreateAdminPage() {
  return (
    <RoleGuard allowedRoles={["super_admin"]}>
      <CreateUserForm
        targetRole="admin"
        title="Create Society Admin"
        description="Grants administrative rights to manage residents, guards, and society structure."
      />
    </RoleGuard>
  );
}
