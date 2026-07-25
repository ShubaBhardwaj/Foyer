/**
 * ─── USAGE RULE ────────────────────────────────────────────────────────────────
 *
 * AppBadge is for GENERIC UI LABELS ONLY:
 *   - Notification counts, "New" tags, category labels, filter counts
 *
 * DO NOT use AppBadge for domain entity status (visitor requests, complaints,
 * bookings, polls). Use StatusPill instead.
 *
 * These two components must NOT be used interchangeably.
 * ────────────────────────────────────────────────────────────────────────────────
 */

import type { LucideIcon } from "lucide-react-native";

export type BadgeStatus = "success" | "warning" | "error" | "info" | "neutral";

export interface AppBadgeProps {
  /** Badge label text */
  label: string;
  /** Semantic status */
  status?: BadgeStatus;
  /** Optional leading icon */
  icon?: LucideIcon;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Test ID for testing */
  testID?: string;
}
