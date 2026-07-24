"use client";

import { RoleGuard } from "@/components/guards/RoleGuard";
import { CreateUserForm } from "@/features/users/components/CreateUserForm";

export default function CreateSuperAdminPage() {
  return (
    <RoleGuard allowedRoles={["owner"]}>
      <CreateUserForm
        targetRole="super_admin"
        title="Create Super Admin"
        description="Owner reserved action. Grants top-level society administration rights."
      />
    </RoleGuard>
  );
}
