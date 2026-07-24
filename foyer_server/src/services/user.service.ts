import mongoose, { Types } from "mongoose";
import UserModel, { Role, IUser } from "../models/User";
import SocietyModel from "../models/Society";
import TowerModel from "../models/Tower";
import FlatModel from "../models/Flat";
import { generateUniqueId } from "../utils/generateUniqueId";

/**
 * Defines which roles can create which other roles.
 *
 * Owner → Super Admin
 * Super Admin → Society Admin, Resident, Guard
 * Society Admin → Resident, Guard
 */
const CREATE_PERMISSION_MAP: Record<string, Role[]> = {
  [Role.OWNER]: [Role.SUPER_ADMIN],
  [Role.SUPER_ADMIN]: [Role.ADMIN, Role.RESIDENT, Role.GUARD],
  [Role.ADMIN]: [Role.RESIDENT, Role.GUARD],
};

interface CreateUserData {
  name: string;
  email: string;
  phone: string;
  tower?: string;
  flat?: string;
}

/**
 * UserService — handles user creation and role management using Mongoose ODM directly.
 */
class UserService {
  /**
   * Create a new user with the specified target role.
   *
   * @param creator - The authenticated user creating this new user.
   * @param targetRole - The primary role to assign to the new user.
   * @param data - The user data (name, email, phone, optional tower/flat).
   */
  async createUser(
    creator: IUser,
    targetRole: Role,
    data: CreateUserData
  ): Promise<IUser> {
    // Security Rule: Reject any attempt to assign the Owner role
    if (targetRole === Role.OWNER) {
      throw {
        statusCode: 403,
        message: "The Owner role is reserved and cannot be assigned.",
      };
    }

    // Step 1: Verify permission based on hierarchy (creator must have at least one allowed role)
    const hasPermission = creator.roles.some((role) => {
      const allowedTargets = CREATE_PERMISSION_MAP[role];
      return allowedTargets && allowedTargets.includes(targetRole);
    });

    if (!hasPermission) {
      throw {
        statusCode: 403,
        message: `Your current roles [${creator.roles.join(
          ", "
        )}] do not have permission to create role "${targetRole}".`,
      };
    }

    // Step 2: Verify email uniqueness in MongoDB
    const existingUser = await UserModel.findOne({
      email: data.email.toLowerCase(),
    });
    if (existingUser) {
      throw {
        statusCode: 409,
        message: `A user with email "${data.email}" already exists.`,
      };
    }

    // Step 3: Ensure society exists
    const society = await SocietyModel.findById(creator.society);
    if (!society) {
      throw {
        statusCode: 500,
        message: "Creator's society not found.",
      };
    }

    // Step 4: Generate 6-character alphanumeric Unique ID
    const uniqueId = await generateUniqueId();

    // Step 5: Determine roles array (Multi-role support)
    const rolesToAssign: Role[] = [targetRole];

    // If an admin/super_admin or guard also has a flat assigned, add Resident role
    if (data.flat && !rolesToAssign.includes(Role.RESIDENT)) {
      rolesToAssign.push(Role.RESIDENT);
    }

    // Use transaction for atomic User creation & Flat occupancy update
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      let towerObjectId: Types.ObjectId | null = null;
      let flatObjectId: Types.ObjectId | null = null;

      if (data.tower || data.flat) {
        if (!data.tower || !data.flat) {
          throw {
            statusCode: 400,
            message: "Both Tower ID and Flat ID are required for residence allocation.",
          };
        }

        if (
          !Types.ObjectId.isValid(data.tower) ||
          !Types.ObjectId.isValid(data.flat)
        ) {
          throw {
            statusCode: 400,
            message: "Invalid Tower ID or Flat ID format.",
          };
        }

        towerObjectId = new Types.ObjectId(data.tower);
        flatObjectId = new Types.ObjectId(data.flat);

        // Validate tower belongs to society
        const towerDoc = await TowerModel.findOne({
          _id: towerObjectId,
          society: creator.society,
        }).session(session);

        if (!towerDoc) {
          throw {
            statusCode: 404,
            message: "Tower not found in this society.",
          };
        }

        // Validate flat belongs to tower & society
        const flatDoc = await FlatModel.findOne({
          _id: flatObjectId,
          tower: towerObjectId,
          society: creator.society,
        }).session(session);

        if (!flatDoc) {
          throw {
            statusCode: 404,
            message: "Flat not found in the specified Tower.",
          };
        }

        // Validate flat is not already occupied
        if (flatDoc.occupied) {
          throw {
            statusCode: 409,
            message: `Flat ${flatDoc.flatNumber} is already occupied.`,
          };
        }

        // Reserve flatObjectId for user creation below
      }

      // Create User
      const [newUser] = await UserModel.create(
        [
          {
            uniqueId,
            name: data.name,
            email: data.email.toLowerCase(),
            phone: data.phone,
            roles: rolesToAssign,
            society: creator.society,
            tower: towerObjectId,
            flat: flatObjectId,
            clerkId: null,
            isVerified: false,
          },
        ],
        { session }
      );

      // Mark Flat as occupied if allocated
      if (flatObjectId) {
        await FlatModel.findByIdAndUpdate(
          flatObjectId,
          { occupied: true, occupiedBy: newUser._id },
          { session }
        );
      }

      await session.commitTransaction();
      return newUser;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}

export default new UserService();
