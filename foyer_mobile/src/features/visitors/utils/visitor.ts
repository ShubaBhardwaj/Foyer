import { VisitorStatus } from "../types";

export function formatVisitorStatusLabel(status: VisitorStatus): string {
  switch (status) {
    case "pending":
      return "Pending Approval";
    case "approved":
      return "Approved Entry";
    case "rejected":
      return "Entry Denied";
    default:
      return status;
  }
}

export function getVisitorStatusPillType(status: VisitorStatus): "pending" | "approved" | "rejected" {
  return status;
}
