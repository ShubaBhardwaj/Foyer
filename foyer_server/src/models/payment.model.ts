import { Schema, model, Types, Document } from "mongoose";

/**
 * Payment Status Enum.
 */
export enum PaymentStatus {
  INITIATED = "INITIATED",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

/**
 * Payment Method Enum.
 */
export enum PaymentMethod {
  CASH = "CASH",
  UPI = "UPI",
  CARD = "CARD",
  NET_BANKING = "NET_BANKING",
  OTHER = "OTHER",
}

/**
 * Payment Document TypeScript Interface.
 */
export interface IPayment extends Document {
  invoice: Types.ObjectId;
  society: Types.ObjectId;
  resident: Types.ObjectId;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionReference: string;
  gateway?: string;
  gatewayPaymentId?: string;
  receiptNumber: string;
  status: PaymentStatus;
  paidAt: Date;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    invoice: {
      type: Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
      index: true,
    },

    society: {
      type: Schema.Types.ObjectId,
      ref: "Society",
      required: true,
      index: true,
    },

    resident: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },

    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      default: PaymentMethod.UPI,
      required: true,
    },

    transactionReference: {
      type: String,
      required: true,
      trim: true,
    },

    gateway: {
      type: String,
      trim: true,
    },

    gatewayPaymentId: {
      type: String,
      trim: true,
    },

    receiptNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.SUCCESS,
      required: true,
      index: true,
    },

    paidAt: {
      type: Date,
      default: Date.now,
      required: true,
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
paymentSchema.index({ society: 1, createdAt: -1 });
paymentSchema.index({ resident: 1, createdAt: -1 });

export default model<IPayment>("Payment", paymentSchema);
