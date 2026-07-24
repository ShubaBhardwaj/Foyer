import mongoose, { Types } from "mongoose";
import TowerModel, { ITower } from "../models/Tower";
import FlatModel, { IFlat } from "../models/Flat";
import { generateTowerNames } from "../utils/towerNaming";
import {
  CreateStructureInput,
  ExpandStructureInput,
  UpdateStructureInput,
} from "../validators/structure.validator";

export interface StructureResult {
  towers: ITower[];
  totalFlats: number;
}

/**
 * StructureService — Single source of truth owning the complete lifecycle
 * of Society Structure (Towers & Flats).
 *
 * All multi-document operations run inside Mongoose Transactions.
 */
class StructureService {
  /**
   * Generate initial Society Structure.
   * Only callable if no towers exist yet for the society.
   */
  async generateInitialStructure(
    societyId: Types.ObjectId,
    towerConfigs: CreateStructureInput["towers"]
  ): Promise<StructureResult> {
    // Check if structure already exists
    const existingCount = await TowerModel.countDocuments({ society: societyId });
    if (existingCount > 0) {
      throw {
        statusCode: 409,
        message:
          "Society structure has already been initialized. Use expand or update endpoints instead.",
      };
    }

    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      let currentTowerIndex = 0;
      const createdTowers: ITower[] = [];
      let totalFlatsCreated = 0;

      for (const config of towerConfigs) {
        const names = generateTowerNames(currentTowerIndex, config.count);
        currentTowerIndex += config.count;

        for (const name of names) {
          const [tower] = await TowerModel.create(
            [
              {
                society: societyId,
                name,
                floors: config.floors,
                flatsPerFloor: config.flatsPerFloor,
              },
            ],
            { session }
          );

          const flats = this.buildFlatsForTower(
            societyId,
            tower._id as Types.ObjectId,
            config.floors,
            config.flatsPerFloor
          );

          await FlatModel.insertMany(flats, { session });
          createdTowers.push(tower);
          totalFlatsCreated += flats.length;
        }
      }

      await session.commitTransaction();
      return { towers: createdTowers, totalFlats: totalFlatsCreated };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Expand existing Society Structure by adding new Towers.
   * Continues tower naming sequence seamlessly from the last existing tower.
   */
  async expandStructure(
    societyId: Types.ObjectId,
    towerConfigs: ExpandStructureInput["towers"]
  ): Promise<StructureResult> {
    const existingCount = await TowerModel.countDocuments({ society: societyId });

    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      let currentTowerIndex = existingCount;
      const createdTowers: ITower[] = [];
      let totalFlatsCreated = 0;

      for (const config of towerConfigs) {
        const names = generateTowerNames(currentTowerIndex, config.count);
        currentTowerIndex += config.count;

        for (const name of names) {
          const [tower] = await TowerModel.create(
            [
              {
                society: societyId,
                name,
                floors: config.floors,
                flatsPerFloor: config.flatsPerFloor,
              },
            ],
            { session }
          );

          const flats = this.buildFlatsForTower(
            societyId,
            tower._id as Types.ObjectId,
            config.floors,
            config.flatsPerFloor
          );

          await FlatModel.insertMany(flats, { session });
          createdTowers.push(tower);
          totalFlatsCreated += flats.length;
        }
      }

      await session.commitTransaction();
      return { towers: createdTowers, totalFlats: totalFlatsCreated };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Bulk update multiple Towers in a single request.
   * Rejects modification if any requested Tower is locked (occupied).
   */
  async updateStructure(
    societyId: Types.ObjectId,
    updates: UpdateStructureInput["towers"]
  ): Promise<{ updatedTowers: ITower[] }> {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const updatedTowers: ITower[] = [];

      for (const update of updates) {
        if (!Types.ObjectId.isValid(update.towerId)) {
          throw {
            statusCode: 400,
            message: `Invalid Tower ID format: ${update.towerId}`,
          };
        }

        const towerObjectId = new Types.ObjectId(update.towerId);

        const tower = await TowerModel.findOne({
          _id: towerObjectId,
          society: societyId,
        }).session(session);

        if (!tower) {
          throw {
            statusCode: 404,
            message: `Tower not found in this society: ${update.towerId}`,
          };
        }

        // Extensible Structure Lock Check
        await this.checkStructureLock(towerObjectId, session);

        // Calculate changes
        const oldFloors = tower.floors;
        const oldFlatsPerFloor = tower.flatsPerFloor;
        const newFloors = update.floors;
        const newFlatsPerFloor = update.flatsPerFloor;

        if (oldFloors === newFloors && oldFlatsPerFloor === newFlatsPerFloor) {
          updatedTowers.push(tower);
          continue;
        }

        // Re-generate flats for updated dimensions cleanly
        await FlatModel.deleteMany({ tower: towerObjectId }).session(session);

        const newFlats = this.buildFlatsForTower(
          societyId,
          towerObjectId,
          newFloors,
          newFlatsPerFloor
        );

        await FlatModel.insertMany(newFlats, { session });

        tower.floors = newFloors;
        tower.flatsPerFloor = newFlatsPerFloor;
        await tower.save({ session });

        updatedTowers.push(tower);
      }

      await session.commitTransaction();
      return { updatedTowers };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Get full society structure (Towers & Flats).
   */
  async getStructure(societyId: Types.ObjectId) {
    const towers = await TowerModel.find({ society: societyId }).sort({ name: 1 });
    const flats = await FlatModel.find({ society: societyId }).sort({
      floor: 1,
      flatNumber: 1,
    });

    // Group flats by tower ID
    const flatsByTower: Record<string, IFlat[]> = {};
    for (const flat of flats) {
      const towerId = flat.tower.toString();
      if (!flatsByTower[towerId]) flatsByTower[towerId] = [];
      flatsByTower[towerId].push(flat);
    }

    const structure = towers.map((tower) => ({
      ...tower.toObject(),
      flats: flatsByTower[tower._id.toString()] || [],
    }));

    return {
      towersCount: towers.length,
      totalFlatsCount: flats.length,
      towers,
      flats,
      structure,
    };
  }

  /**
   * Delete a specific tower and its un-occupied flats.
   * Enforces Extensible Structure Lock Check (fails if any flat is occupied).
   */
  async deleteTower(
    societyId: Types.ObjectId,
    towerId: Types.ObjectId
  ): Promise<void> {
    const tower = await TowerModel.findOne({ _id: towerId, society: societyId });
    if (!tower) {
      throw {
        statusCode: 404,
        message: "Tower not found in this society.",
      };
    }

    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      // Check structure lock (fails if any flat is occupied)
      await this.checkStructureLock(towerId, session);

      // Delete all flats in this tower
      await FlatModel.deleteMany({ tower: towerId }).session(session);

      // Delete tower document
      await TowerModel.findByIdAndDelete(towerId).session(session);

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Extensible Structure Lock Check.
   * Verifies whether a tower can be modified.
   *
   * Phase 1: Rejects if any Flat in the Tower is occupied.
   * Future lock conditions (visitors, maintenance, parking, etc.) can be added here cleanly.
   */
  async checkStructureLock(
    towerId: Types.ObjectId,
    session?: mongoose.ClientSession
  ): Promise<void> {
    const query = FlatModel.findOne({ tower: towerId, occupied: true });
    if (session) query.session(session);

    const occupiedFlat = await query.exec();

    if (occupiedFlat) {
      throw {
        statusCode: 409,
        message: `Society structure cannot be modified because the Tower is already in use (Flat ${occupiedFlat.flatNumber} is occupied).`,
      };
    }
  }

  /**
   * Helper function to build Flat documents for a tower configuration.
   */
  private buildFlatsForTower(
    societyId: Types.ObjectId,
    towerId: Types.ObjectId,
    floors: number,
    flatsPerFloor: number
  ) {
    const flats = [];

    for (let floor = 1; floor <= floors; floor++) {
      for (let idx = 1; idx <= flatsPerFloor; idx++) {
        const flatNumber = `${floor * 100 + idx}`;
        flats.push({
          society: societyId,
          tower: towerId,
          flatNumber,
          floor,
          occupied: false,
          occupiedBy: null,
        });
      }
    }

    return flats;
  }
}

export default new StructureService();
