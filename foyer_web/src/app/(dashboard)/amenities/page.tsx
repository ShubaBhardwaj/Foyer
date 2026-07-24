"use client";

import { Coffee } from "lucide-react";
import { FutureModulePlaceholder } from "@/components/shared/FutureModulePlaceholder";

export default function AmenitiesPage() {
  return (
    <FutureModulePlaceholder
      title="Clubhouse & Amenities Booking"
      description="Reserve society clubhouse, swimming pool slots, tennis courts, and party halls with slot management."
      icon={Coffee}
    />
  );
}
