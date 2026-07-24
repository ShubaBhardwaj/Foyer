import { Request, Response } from "express";
import structureService from "../services/structure.service";
import { sendSuccess, sendError } from "../utils/apiResponse";
import {
  CreateStructureInput,
  ExpandStructureInput,
  UpdateStructureInput,
} from "../validators/structure.validator";

/**
 * StructureController — Handles HTTP requests for Society Structure Management.
 * Thin controller layer; all business logic is in StructureService.
 */
class StructureController {
  /**
   * POST /society/structure
   * Generate initial society structure (towers & flats).
   */
  async generate(req: Request, res: Response): Promise<void> {
    try {
      const societyId = req.user!.society;
      const { towers } = req.body as CreateStructureInput;

      const result = await structureService.generateInitialStructure(
        societyId,
        towers
      );

      sendSuccess(
        res,
        result,
        "Initial society structure generated successfully.",
        201
      );
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Failed to generate society structure.";
      console.error("[StructureController.generate]", message);
      sendError(res, message, statusCode);
    }
  }

  /**
   * POST /society/structure/expand
   * Expand existing society structure with additional towers.
   */
  async expand(req: Request, res: Response): Promise<void> {
    try {
      const societyId = req.user!.society;
      const { towers } = req.body as ExpandStructureInput;

      const result = await structureService.expandStructure(societyId, towers);

      sendSuccess(res, result, "Society structure expanded successfully.", 201);
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Failed to expand society structure.";
      console.error("[StructureController.expand]", message);
      sendError(res, message, statusCode);
    }
  }

  /**
   * PATCH /society/structure
   * Bulk update multiple towers in a single request.
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const societyId = req.user!.society;
      const { towers } = req.body as UpdateStructureInput;

      const result = await structureService.updateStructure(societyId, towers);

      sendSuccess(res, result, "Society structure updated successfully.");
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Failed to update society structure.";
      console.error("[StructureController.update]", message);
      sendError(res, message, statusCode);
    }
  }

  /**
   * GET /society/structure
   * Get complete society structure (towers & flats).
   */
  async get(req: Request, res: Response): Promise<void> {
    try {
      const societyId = req.user!.society;

      const result = await structureService.getStructure(societyId);

      sendSuccess(res, result, "Society structure fetched successfully.");
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Failed to fetch society structure.";
      console.error("[StructureController.get]", message);
      sendError(res, message, statusCode);
    }
  }
}

export default new StructureController();
