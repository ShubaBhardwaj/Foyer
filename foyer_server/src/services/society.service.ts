import mongoose, { Types } from "mongoose";
import SocietyModel, { ISociety } from "../models/Society";
import UserModel, { Role, IUser } from "../models/User";
import { fetchClerkUser } from "../utils/clerkUser";
import { generateUniqueId } from "../utils/generateUniqueId";
import { RegisterSocietyInput } from "../validators/society.validator";
import ApiError from "../utils/apiError";

interface RegisterSocietyResult {
  society: ISociety;
  owner: IUser;
}

/**
 * SocietyService — handles society registration using Mongoose ODM directly.
 */
class SocietyService {
  /**
   * Register a new society and create the Owner user.
   * This is the ONLY legitimate flow where the Owner role is assigned.
   */
  async registerSociety(
    clerkUserId: string,
    data: RegisterSocietyInput
  ): Promise<RegisterSocietyResult> {
    // Ensure this Clerk user doesn't already own an account.
    const existingUser = await UserModel.findOne({ clerkId: clerkUserId });
    if (existingUser) {
      throw ApiError.conflict("You already have an account. Cannot register another society.");
    }

    const clerkProfile = await fetchClerkUser(clerkUserId);
    const societyCode = await this.generateSocietyCode(data.name);
    const ownerUniqueId = await generateUniqueId();

    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const ownerObjectId = new Types.ObjectId();

      // Create Society
      const [societyDoc] = await SocietyModel.create(
        [
          {
            name: data.name,
            societyCode,
            address: data.address,
            city: data.city,
            state: data.state,
            pincode: data.pincode,
            owner: ownerObjectId,
          },
        ],
        { session }
      );

      // Create Owner User with roles: [Role.OWNER]
      const [ownerDoc] = await UserModel.create(
        [
          {
            _id: ownerObjectId,
            uniqueId: ownerUniqueId,
            clerkId: clerkUserId,
            name: data.ownerName,
            email: clerkProfile.email,
            phone: data.ownerPhone,
            roles: [Role.OWNER],
            society: societyDoc._id,
            isVerified: true,
          },
        ],
        { session }
      );

      await session.commitTransaction();

      return { society: societyDoc, owner: ownerDoc };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Get the society for an authenticated user.
   */
  async getMySociety(societyId: Types.ObjectId): Promise<ISociety | null> {
    return SocietyModel.findById(societyId);
  }

  /**
   * Generate a unique society code from the society name.
   */
  private async generateSocietyCode(name: string): Promise<string> {
    const words = name.trim().split(/\s+/);
    const baseCode = words
      .slice(0, 4)
      .map((w) => w[0].toUpperCase())
      .join("");

    let code = baseCode;
    let suffix = 0;

    while (await SocietyModel.findOne({ societyCode: code })) {
      suffix++;
      code = `${baseCode}${suffix}`;
    }

    return code;
  }
}

export default new SocietyService();
