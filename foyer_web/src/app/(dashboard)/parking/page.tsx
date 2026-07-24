"use client";

import { Car } from "lucide-react";
import { FutureModulePlaceholder } from "@/components/shared/FutureModulePlaceholder";

export default function ParkingPage() {
  return (
    <FutureModulePlaceholder
      title="Parking Space Allocation"
      description="Resident and guest parking slot allocation, vehicle registration tags, and unauthorized parking alerts."
      icon={Car}
    />
  );
}
