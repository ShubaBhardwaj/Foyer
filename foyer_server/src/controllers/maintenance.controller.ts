import { Request, Response } from "express";
import maintenanceService from "../services/maintenance.service";
import ApiResponse from "../utils/apiResponse";
import ApiError from "../utils/apiError";
import asyncHandler from "../utils/asyncHandler";

/**
 * MaintenanceController — Thin HTTP layer for Maintenance Billing Cycles.
 */
class MaintenanceController {
  createMaintenance = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw ApiError.unauthorized("Authentication required.");
    }

    const maintenance = await maintenanceService.createMaintenance(req.user, req.body);
    ApiResponse.created(res, "Maintenance cycle created successfully.", maintenance);
  });

  listMaintenances = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const result = await maintenanceService.listMaintenances(
      req.user.society,
      req.query as any
    );

    ApiResponse.ok(res, "Maintenance cycles retrieved successfully.", result.data, result.meta);
  });

  getMaintenance = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const maintenance = await maintenanceService.getMaintenanceById(
      req.user.society,
      req.params.id
    );

    ApiResponse.ok(res, "Maintenance details retrieved successfully.", maintenance);
  });

  updateMaintenance = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const maintenance = await maintenanceService.updateMaintenance(
      req.user.society,
      req.user,
      req.params.id,
      req.body
    );

    ApiResponse.ok(res, "Maintenance updated successfully.", maintenance);
  });

  publishMaintenance = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const maintenance = await maintenanceService.publishMaintenance(
      req.user.society,
      req.user,
      req.params.id
    );

    ApiResponse.ok(res, "Maintenance published and invoices generated.", maintenance);
  });

  closeMaintenance = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user.society) {
      throw ApiError.unauthorized("Linked account with society required.");
    }

    const maintenance = await maintenanceService.closeMaintenance(
      req.user.society,
      req.user,
      req.params.id
    );

    ApiResponse.ok(res, "Maintenance cycle closed successfully.", maintenance);
  });
}

export default new MaintenanceController();
