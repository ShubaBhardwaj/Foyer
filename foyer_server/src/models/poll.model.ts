import { Schema, model, Types, Document } from "mongoose";

/**
 * Poll Category Enum.
 */
export enum PollCategory {
  GENERAL = "GENERAL",
  ELECTION = "ELECTION",
  MAINTENANCE = "MAINTENANCE",
  FINANCE = "FINANCE",
  EVENT = "EVENT",
  OTHER = "OTHER",
}

/**
 * Poll Status Enum.
 */
export enum PollStatus {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  CLOSED = "CLOSED",
}

/**
 * Poll Visibility Enum.
 */
export enum PollVisibility {
  ALL = "ALL",
  RESIDENTS = "RESIDENTS",
  OWNERS = "OWNERS",
}

/**
 * Poll Option Subdocument.
 */
export interface IPollOption {
  id: string;
  text: string;
  votesCount: number;
}

/**
 * Poll Document TypeScript Interface.
 */
export interface IPoll extends Document {
  society: Types.ObjectId;
  title: string;
  description: string;
  category: PollCategory;
  options: IPollOption[];
  visibility: PollVisibility;
  allowMultipleSelection: boolean;
  anonymousVoting: boolean;
  startAt: Date;
  endAt: Date;
  status: PollStatus;
  totalVotes: number;
  createdBy: Types.ObjectId;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const pollOptionSchema = new Schema<IPollOption>(
  {
    id: { type: String, required: true },
    text: { type: String, required: true, trim: true },
    votesCount: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const pollSchema = new Schema<IPoll>(
  {
    society: {
      type: Schema.Types.ObjectId,
      ref: "Society",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: Object.values(PollCategory),
      default: PollCategory.GENERAL,
      required: true,
      index: true,
    },

    options: {
      type: [pollOptionSchema],
      required: true,
    },

    visibility: {
      type: String,
      enum: Object.values(PollVisibility),
      default: PollVisibility.ALL,
      required: true,
      index: true,
    },

    allowMultipleSelection: {
      type: Boolean,
      default: false,
    },

    anonymousVoting: {
      type: Boolean,
      default: false,
    },

    startAt: {
      type: Date,
      default: Date.now,
      required: true,
    },

    endAt: {
      type: Date,
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(PollStatus),
      default: PollStatus.DRAFT,
      required: true,
      index: true,
    },

    totalVotes: {
      type: Number,
      default: 0,
      min: 0,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound Indexes
pollSchema.index({ society: 1, status: 1, createdAt: -1 });

export default model<IPoll>("Poll", pollSchema);
