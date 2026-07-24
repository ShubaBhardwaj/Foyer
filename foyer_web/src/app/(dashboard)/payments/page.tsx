"use client";

import { CreditCard } from "lucide-react";
import { FutureModulePlaceholder } from "@/components/shared/FutureModulePlaceholder";

export default function PaymentsPage() {
  return (
    <FutureModulePlaceholder
      title="Online Payment Gateway"
      description="Integrated UPI, Netbanking, and Credit Card payment collection for society maintenance and amenity fees."
      icon={CreditCard}
    />
  );
}
