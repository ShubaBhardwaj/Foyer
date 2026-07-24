"use client";

import { ShieldAlert } from "lucide-react";
import { FutureModulePlaceholder } from "@/components/shared/FutureModulePlaceholder";

export default function VisitorsPage() {
  return (
    <FutureModulePlaceholder
      title="Visitor Management"
      description="Automated digital gate pass generation, visitor check-in/out tracking, and pre-approved guest entries."
      icon={ShieldAlert}
    />
  );
}
