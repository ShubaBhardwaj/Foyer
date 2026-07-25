import { Router } from "express";
import clerkAuth from "../middleware/clerkAuth";
import { requireLinkedAccount } from "../middleware/roleAuth";
import { requirePermission } from "../middleware/requirePermission";
import dashboardController from "../controllers/dashboard.controller";
import { Permission } from "../constants/permissions";

export const dashboardRouter = Router();

/**
 * GET /dashboard/resident
 * Resident Dashboard metrics & highlights.
 * Required Permission: DASHBOARD_READ
 */
dashboardRouter.get(
  "/resident",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.DASHBOARD_READ),
  dashboardController.getResidentDashboard.bind(dashboardController)
);

/**
 * GET /dashboard/admin
 * Admin Dashboard metrics & society summary.
 * Required Permission: DASHBOARD_READ
 */
dashboardRouter.get(
  "/admin",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.DASHBOARD_READ),
  dashboardController.getAdminDashboard.bind(dashboardController)
);

/**
 * GET /dashboard/guard
 * Guard Dashboard active shifts & visitors.
 * Required Permission: DASHBOARD_READ
 */
dashboardRouter.get(
  "/guard",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.DASHBOARD_READ),
  dashboardController.getGuardDashboard.bind(dashboardController)
);

/**
 * GET /dashboard/owner
 * Owner Dashboard high-level society analytics.
 * Required Permission: DASHBOARD_READ
 */
dashboardRouter.get(
  "/owner",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.DASHBOARD_READ),
  dashboardController.getOwnerDashboard.bind(dashboardController)
);

/**
 * GET /dashboard/analytics/complaints
 * Complaint analytics pipeline.
 * Required Permission: ANALYTICS_READ
 */
dashboardRouter.get(
  "/analytics/complaints",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.ANALYTICS_READ),
  dashboardController.getComplaintAnalytics.bind(dashboardController)
);

/**
 * GET /dashboard/analytics/visitors
 * Visitor analytics pipeline.
 * Required Permission: ANALYTICS_READ
 */
dashboardRouter.get(
  "/analytics/visitors",
  clerkAuth,
  requireLinkedAccount,
  requirePermission(Permission.ANALYTICS_READ),
  dashboardController.getVisitorAnalytics.bind(dashboardController)
);

export default dashboardRouter;
