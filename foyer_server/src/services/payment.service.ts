import mongoose, { Types } from "mongoose";
import PaymentModel, {
  IPayment,
  PaymentStatus,
} from "../models/payment.model";
import InvoiceModel, { InvoiceStatus } from "../models/invoice.model";
import { Role, IUser } from "../models/User";
import ApiError from "../utils/apiError";
import auditService from "./audit.service";
import { AuditAction, AuditResourceType } from "../models/audit.model";
import activityService from "./activity.service";
import { ActivityType, ActivityVisibility } from "../models/activity.model";
import notificationService from "./notification.service";
import searchService from "./search.service";
import { validateObjectId } from "../utils/validation";
import { SearchResult } from "../types/search.types";
import {
  RecordPaymentInput,
  ListPaymentsInput,
} from "../validators/payment.validator";

/**
 * PaymentService — Business logic layer for Maintenance Payments.
 */
class PaymentService {
  /**
   * Record a payment for an invoice with transaction-based invoice updates.
   */
  async recordPayment(
    payer: IUser,
    data: RecordPaymentInput
  ): Promise<IPayment> {
    if (!payer.society) {
      throw ApiError.forbidden("User account is not linked to any society.");
    }

    validateObjectId(data.invoiceId, "Invoice ID");

    const invoice = await InvoiceModel.findOne({
      _id: data.invoiceId,
      society: payer.society,
      isDeleted: { $ne: true },
    });

    if (!invoice) {
      throw ApiError.notFound("Invoice not found.");
    }

    if (invoice.status === InvoiceStatus.PAID) {
      throw ApiError.badRequest("Invoice is already fully paid.");
    }

    if (invoice.status === InvoiceStatus.CANCELLED) {
      throw ApiError.badRequest("Cannot pay a cancelled invoice.");
    }

    if (data.amount > invoice.balance) {
      throw ApiError.badRequest(
        `Payment amount (${data.amount}) cannot exceed remaining invoice balance (${invoice.balance}).`
      );
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    let createdPayment: IPayment;

    try {
      const receiptNumber = `RCP-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 1000)}`;

      const [newPayment] = await PaymentModel.create(
        [
          {
            invoice: invoice._id,
            society: payer.society,
            resident: invoice.resident,
            amount: data.amount,
            paymentMethod: data.paymentMethod,
            transactionReference: data.transactionReference,
            gateway: data.gateway,
            gatewayPaymentId: data.gatewayPaymentId,
            receiptNumber,
            status: PaymentStatus.SUCCESS,
            paidAt: new Date(),
            isDeleted: false,
          },
        ],
        { session }
      );

      invoice.paidAmount += data.amount;
      invoice.balance = Math.max(0, invoice.amount - invoice.paidAmount);

      if (invoice.balance === 0) {
        invoice.status = InvoiceStatus.PAID;
      } else {
        invoice.status = InvoiceStatus.PARTIALLY_PAID;
      }

      await invoice.save({ session });

      await session.commitTransaction();
      createdPayment = newPayment;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

    await this.safeAuditLog({
      actor: payer._id,
      actorRole: payer.roles[0] || "user",
      society: payer.society,
      action: AuditAction.PAYMENT_RECORDED,
      resourceType: AuditResourceType.PAYMENT,
      resourceId: createdPayment._id,
      after: createdPayment.toObject(),
    });

    await this.safeActivityPublish({
      society: payer.society,
      actor: payer._id,
      actorName: payer.name || payer.email || "Resident",
      actorRole: payer.roles[0] || "resident",
      activityType: ActivityType.PAYMENT_RECEIVED,
      resourceType: "Payment",
      resourceId: createdPayment._id,
      message: `Payment received: ${data.amount} for invoice ${invoice.invoiceNumber}.`,
      metadata: {
        amount: data.amount,
        receiptNumber: createdPayment.receiptNumber,
        invoiceNumber: invoice.invoiceNumber,
      },
      visibility: ActivityVisibility.ALL,
    });

    await notificationService.sendNotification({
      title: "Payment Receipt Issued",
      body: `Payment of ${data.amount} received. Receipt #${createdPayment.receiptNumber}.`,
      userIds: [invoice.resident.toString()],
    });

    return createdPayment;
  }

  /**
   * Get payment details by ID.
   */
  async getPaymentById(
    societyId: Types.ObjectId,
    user: IUser,
    id: string
  ): Promise<IPayment> {
    validateObjectId(id, "Payment ID");

    const payment = await PaymentModel.findOne({
      _id: id,
      society: societyId,
      isDeleted: { $ne: true },
    })
      .populate("invoice", "invoiceNumber amount balance status")
      .populate("resident", "name email phone");

    if (!payment) {
      throw ApiError.notFound("Payment record not found.");
    }

    const isResident = user.roles.includes(Role.RESIDENT);
    const isAdmin =
      user.roles.includes(Role.ADMIN) ||
      user.roles.includes(Role.SUPER_ADMIN) ||
      user.roles.includes(Role.OWNER);

    if (isResident && !isAdmin && payment.resident._id.toString() !== user._id.toString()) {
      throw ApiError.forbidden("You do not have permission to view this payment.");
    }

    return payment;
  }

  /**
   * List payments with filtering, search, and pagination.
   */
  async listPayments(
    societyId: Types.ObjectId,
    user: IUser,
    input: ListPaymentsInput
  ): Promise<SearchResult<IPayment>> {
    const filter: Record<string, any> = {
      society: societyId,
      isDeleted: { $ne: true },
    };

    const isResident = user.roles.includes(Role.RESIDENT);
    const isAdmin =
      user.roles.includes(Role.ADMIN) ||
      user.roles.includes(Role.SUPER_ADMIN) ||
      user.roles.includes(Role.OWNER);

    if (isResident && !isAdmin) {
      filter.resident = user._id;
    } else if (input.residentId) {
      validateObjectId(input.residentId, "Resident User ID");
      filter.resident = new Types.ObjectId(input.residentId);
    }

    if (input.invoiceId) {
      validateObjectId(input.invoiceId, "Invoice ID");
      filter.invoice = new Types.ObjectId(input.invoiceId);
    }

    if (input.paymentMethod) filter.paymentMethod = input.paymentMethod;
    if (input.status) filter.status = input.status;

    if (input.startDate || input.endDate) {
      filter.paidAt = {};
      if (input.startDate) filter.paidAt.$gte = new Date(input.startDate);
      if (input.endDate) filter.paidAt.$lte = new Date(input.endDate);
    }

    return searchService.search<IPayment>(PaymentModel as any, {
      searchKeyword: input.searchKeyword,
      searchFields: ["receiptNumber", "transactionReference"],
      filter,
      sort: input.sort || "-paidAt",
      page: input.page ? Number(input.page) : undefined,
      limit: input.limit ? Number(input.limit) : undefined,
      populate: [
        { path: "invoice", select: "invoiceNumber amount" },
        { path: "resident", select: "name email phone" },
      ],
    });
  }

  private async safeAuditLog(
    input: Parameters<typeof auditService.log>[0]
  ): Promise<void> {
    try {
      await auditService.log(input);
    } catch (err) {
      console.warn("[PaymentService] Non-critical audit warning:", err);
    }
  }

  private async safeActivityPublish(
    input: Parameters<typeof activityService.publish>[0]
  ): Promise<void> {
    try {
      await activityService.publish(input);
    } catch (err) {
      console.warn("[PaymentService] Non-critical activity warning:", err);
    }
  }
}

export default new PaymentService();
