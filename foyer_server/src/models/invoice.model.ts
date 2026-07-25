import { Schema, model, Types, Document } from "mongoose";

/**
 * Invoice Status Enum.
 */
export enum InvoiceStatus {
  PENDING = "PENDING",
  PARTIALLY_PAID = "PARTIALLY_PAID",
  PAID = "PAID",
  OVERDUE = "OVERDUE",
  CANCELLED = "CANCELLED",
}

/**
 * Invoice Document TypeScript Interface.
 */
export interface IInvoice extends Document {
  society: Types.ObjectId;
  maintenance: Types.ObjectId;
  resident: Types.ObjectId;
  flat: string;
  invoiceNumber: string;
  amount: number;
  dueDate: Date;
  paidAmount: number;
  balance: number;
  status: InvoiceStatus;
  generatedAt: Date;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const invoiceSchema = new Schema<IInvoice>(
  {
    society: {
      type: Schema.Types.ObjectId,
      ref: "Society",
      required: true,
      index: true,
    },

    maintenance: {
      type: Schema.Types.ObjectId,
      ref: "Maintenance",
      required: true,
      index: true,
    },

    resident: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    flat: {
      type: String,
      required: true,
      trim: true,
    },

    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    dueDate: {
      type: Date,
      required: true,
      index: true,
    },

    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    balance: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: Object.values(InvoiceStatus),
      default: InvoiceStatus.PENDING,
      required: true,
      index: true,
    },

    generatedAt: {
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
invoiceSchema.index({ society: 1, status: 1 });
invoiceSchema.index({ resident: 1, status: 1 });
invoiceSchema.index({ maintenance: 1, resident: 1 });

export default model<IInvoice>("Invoice", invoiceSchema);
