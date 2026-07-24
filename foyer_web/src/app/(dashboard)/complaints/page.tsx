"use client";

import { MessageSquare } from "lucide-react";
import { FutureModulePlaceholder } from "@/components/shared/FutureModulePlaceholder";

export default function ComplaintsPage() {
  return (
    <FutureModulePlaceholder
      title="Helpdesk & Complaints"
      description="Ticket lifecycle management for society maintenance issues, staff assignments, and resident resolution tracking."
      icon={MessageSquare}
    />
  );
}
