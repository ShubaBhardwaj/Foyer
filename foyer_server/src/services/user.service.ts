import { Types } from "mongoose";
import UserModel, { Role, IUser } from "../models/User";
import SocietyModel from "../models/Society";
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
 * UserService — handles user creation for all roles using Mongoose ODM directly.
 */
class UserService {
  /**
   * Create a new user with the specified role.
   *
   * @param creator - The authenticated user creating this new user.
   * @param targetRole - The role to assign to the new user.
   * @param data - The user data (name, email, phone, optionally tower/flat).
   */
  async createUser(
    creator: IUser,
    targetRole: Role,
    data: CreateUserData
  ): Promise<IUser> {
    // Step 1: Verify permission based on hierarchy.
    const allowedTargets = CREATE_PERMISSION_MAP[creator.role];
    if (!allowedTargets || !allowedTargets.includes(targetRole)) {
      throw {
        statusCode: 403,
        message: `Role "${creator.role}" cannot create role "${targetRole}".`,
      };
    }

    // Step 2: Verify email uniqueness in MongoDB.
    const existingUser = await UserModel.findOne({ email: data.email.toLowerCase() });
    if (existingUser) {
      throw {
        statusCode: 409,
        message: `A user with email "${data.email}" already exists.`,
      };
    }

    // Step 3: Ensure society exists.
    const society = await SocietyModel.findById(creator.society);
    if (!society) {
      throw {
        statusCode: 500,
        message: "Creator's society not found.",
      };
    }

    // Step 4: Generate 6-character alphanumeric Unique ID (0-9a-zA-Z).
    const uniqueId = await generateUniqueId();

    // Step 5: Build and save user document directly via Mongoose model.
    const newUser = new UserModel({
      uniqueId,
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone,
      role: targetRole,
      society: creator.society,
      clerkId: null, // Set on first login
      isVerified: false,
    });

    if (data.tower) {
      newUser.tower = new Types.ObjectId(data.tower);
    }
    if (data.flat) {
      newUser.flat = new Types.ObjectId(data.flat);
    }

    await newUser.save();
    return newUser;
  }
}

export default new UserService();
