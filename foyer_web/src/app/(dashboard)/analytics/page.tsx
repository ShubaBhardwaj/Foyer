"use client";

import { BarChart3 } from "lucide-react";
import { FutureModulePlaceholder } from "@/components/shared/FutureModulePlaceholder";

export default function AnalyticsPage() {
  return (
    <FutureModulePlaceholder
      title="Society Analytics & Insights"
      description="Real-time occupancy metrics, visitor trends, revenue collections, and security audit reports."
      icon={BarChart3}
    />
  );
}
