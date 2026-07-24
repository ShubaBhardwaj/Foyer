"use client";

import { Wrench } from "lucide-react";
import { FutureModulePlaceholder } from "@/components/shared/FutureModulePlaceholder";

export default function MaintenancePage() {
  return (
    <FutureModulePlaceholder
      title="Maintenance & Dues"
      description="Monthly maintenance billing, automated ledger generation, receipt tracking, and penalty calculations."
      icon={Wrench}
    />
  );
}
