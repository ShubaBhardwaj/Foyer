"use client";

import { Vote } from "lucide-react";
import { FutureModulePlaceholder } from "@/components/shared/FutureModulePlaceholder";

export default function PollsPage() {
  return (
    <FutureModulePlaceholder
      title="Society Polls & Voting"
      description="Democratic voting module for AGM resolutions, budget approvals, and community decision polls."
      icon={Vote}
    />
  );
}
