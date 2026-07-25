import { Request, Response } from "express";
import { Types } from "mongoose";
import structureService from "../services/structure.service";
import ApiResponse from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";
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
  generate = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const societyId = req.user!.society;
    const { towers } = req.body as CreateStructureInput;

    const result = await structureService.generateInitialStructure(
      societyId,
      towers
    );

    ApiResponse.created(
      res,
      "Initial society structure generated successfully.",
      result
    );
  });

  /**
   * POST /society/structure/expand
   * Expand existing society structure with additional towers.
   */
  expand = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const societyId = req.user!.society;
    const { towers } = req.body as ExpandStructureInput;

    const result = await structureService.expandStructure(societyId, towers);

    ApiResponse.created(res, "Society structure expanded successfully.", result);
  });

  /**
   * PATCH /society/structure
   * Bulk update multiple towers in a single request.
   */
  update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const societyId = req.user!.society;
    const { towers } = req.body as UpdateStructureInput;

    const result = await structureService.updateStructure(societyId, towers);

    ApiResponse.ok(res, "Society structure updated successfully.", result);
  });

  /**
   * GET /society/structure
   * Get complete society structure (towers & flats).
   */
  get = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const societyId = req.user!.society;

    const result = await structureService.getStructure(societyId);

    ApiResponse.ok(res, "Society structure fetched successfully.", result);
  });

  /**
   * DELETE /society/structure/tower/:towerId
   * Delete a specific tower block.
   */
  deleteTower = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const societyId = req.user!.society;
    const { towerId } = req.params;

    await structureService.deleteTower(
      societyId,
      new Types.ObjectId(towerId)
    );

    ApiResponse.ok(res, "Tower deleted successfully.", null);
  });
}

export default new StructureController();
