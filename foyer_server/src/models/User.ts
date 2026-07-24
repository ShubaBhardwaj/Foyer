import { Schema, model, Types, Document } from "mongoose";

/**
 * Supported user roles in the Foyer platform.
 *
 * Hierarchy:
 *   owner → super_admin → admin → resident / guard
 */
export enum Role {
  OWNER = "owner",
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  RESIDENT = "resident",
  GUARD = "guard",
}

export interface IUser extends Document {
  uniqueId: string;
  clerkId: string | null;
  name: string;
  email: string;
  phone: string;
  role: Role;
  society: Types.ObjectId;
  tower: Types.ObjectId | null;
  flat: Types.ObjectId | null;
  isVerified: boolean;
  status: "active" | "blocked";
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    uniqueId: {
      type: String,
      required: true,
      unique: true,
    },

    clerkId: {
      type: String,
      default: null,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },

    phone: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: Object.values(Role),
      required: true,
    },

    society: {
      type: Schema.Types.ObjectId,
      ref: "Society",
      required: true,
    },

    tower: {
      type: Schema.Types.ObjectId,
      ref: "Tower",
      default: null,
    },

    flat: {
      type: Schema.Types.ObjectId,
      ref: "Flat",
      default: null,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast lookups during authentication
userSchema.index({ clerkId: 1 }, { sparse: true });

export default model<IUser>("User", userSchema);
