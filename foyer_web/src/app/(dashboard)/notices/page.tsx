"use client";

import { Bell } from "lucide-react";
import { FutureModulePlaceholder } from "@/components/shared/FutureModulePlaceholder";

export default function NoticesPage() {
  return (
    <FutureModulePlaceholder
      title="Digital Notice Board"
      description="Publish society announcements, event notifications, and official circulars directly to resident devices."
      icon={Bell}
    />
  );
}
