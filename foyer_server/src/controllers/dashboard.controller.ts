import { Request, Response } from "express";
import dashboardService from "../services/dashboard.service";
import ApiResponse from "../utils/apiResponse";
import ApiError from "../utils/apiError";
import asyncHandler from "../utils/asyncHandler";

/**
 * DashboardController — Thin HTTP layer for Role-Specific Dashboards & Analytics.
 */
class DashboardController {
  /**
   * GET /dashboard/resident
   */
  getResidentDashboard = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw ApiError.unauthorized("Authentication required.");
    }

    const data = await dashboardService.getResidentDashboard(req.user);
    ApiResponse.ok(res, "Resident dashboard data retrieved successfully.", data);
  });

  /**
   * GET /dashboard/admin
   */
  getAdminDashboard = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const data = await dashboardService.getAdminDashboard(req.user.society);
    ApiResponse.ok(res, "Admin dashboard data retrieved successfully.", data);
  });

  /**
   * GET /dashboard/guard
   */
  getGuardDashboard = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const data = await dashboardService.getGuardDashboard(req.user.society);
    ApiResponse.ok(res, "Guard dashboard data retrieved successfully.", data);
  });

  /**
   * GET /dashboard/owner
   */
  getOwnerDashboard = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const data = await dashboardService.getOwnerDashboard(req.user.society);
    ApiResponse.ok(res, "Owner dashboard data retrieved successfully.", data);
  });

  /**
   * GET /dashboard/analytics/complaints
   */
  getComplaintAnalytics = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const { startDate, endDate } = req.query;
    const data = await dashboardService.getComplaintAnalytics(
      req.user.society,
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined
    );

    ApiResponse.ok(res, "Complaint analytics retrieved successfully.", data);
  });

  /**
   * GET /dashboard/analytics/visitors
   */
  getVisitorAnalytics = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const { startDate, endDate } = req.query;
    const data = await dashboardService.getVisitorAnalytics(
      req.user.society,
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined
    );

    ApiResponse.ok(res, "Visitor analytics retrieved successfully.", data);
  });
}

export default new DashboardController();
