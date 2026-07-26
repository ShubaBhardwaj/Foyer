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
  roles: Role[];
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

    roles: {
      type: [String],
      enum: Object.values(Role),
      required: true,
      validate: [
        (val: string[]) => Array.isArray(val) && val.length > 0,
        "User must have at least one role.",
      ],
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
    strict: true,
  }
);

// Deduplicate roles before saving
userSchema.pre("save", function () {
  if (this.roles && Array.isArray(this.roles)) {
    this.roles = Array.from(new Set(this.roles));
  }
});

// Compound index for fast lookup & concurrency protection
userSchema.index({ society: 1, uniqueId: 1 }, { unique: true });
userSchema.index({ clerkId: 1 }, { unique: true, sparse: true });

export default model<IUser>("User", userSchema);
