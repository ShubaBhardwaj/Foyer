import { Badge } from "@/components/ui/Badge";

interface StatusBadgeProps {
  status: "active" | "inactive" | "blocked" | "occupied" | "vacant" | boolean;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  let variant: "success" | "destructive" | "warning" | "secondary" = "success";
  let label = String(status);

  if (typeof status === "boolean") {
    variant = status ? "destructive" : "success";
    label = status ? "Occupied" : "Vacant";
  } else {
    switch (status) {
      case "active":
      case "vacant":
        variant = "success";
        label = status === "active" ? "Active" : "Vacant";
        break;
      case "inactive":
      case "blocked":
      case "occupied":
        variant = status === "occupied" ? "warning" : "destructive";
        label =
          status === "occupied"
            ? "Occupied"
            : status === "inactive"
            ? "Inactive"
            : "Blocked";
        break;
    }
  }

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}
