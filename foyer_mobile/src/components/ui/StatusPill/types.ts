/**
 * ─── USAGE RULE ────────────────────────────────────────────────────────────────
 *
 * StatusPill is ONLY for DOMAIN ENTITY STATUS indicators:
 *   - Visitor requests (pending / approved / rejected)
 *   - Complaints (open / resolved / closed)
 *   - Facility bookings (pending / confirmed / cancelled)
 *   - Polls / votes (active / closed)
 *
 * DO NOT use StatusPill for generic UI labels (counts, "New" tags, categories).
 * Use AppBadge instead.
 *
 * These two components must NOT be used interchangeably.
 * ────────────────────────────────────────────────────────────────────────────────
 */

import type { LucideIcon } from "lucide-react-native";

export type StatusPillStatus = "pending" | "approved" | "rejected" | "neutral";
export type StatusPillVariant = "compact" | "full";

export interface AppStatusPillProps {
  /** Domain entity status */
  status: StatusPillStatus;
  /** Display variant — "compact" (dot only) or "full" (dot + label) */
  variant?: StatusPillVariant;
  /** Custom label (defaults to status name) */
  label?: string;
  /** Optional leading icon */
  icon?: LucideIcon;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Test ID for testing */
  testID?: string;
}
