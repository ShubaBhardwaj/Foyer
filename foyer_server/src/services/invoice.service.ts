import { Types } from "mongoose";
import InvoiceModel, { IInvoice, InvoiceStatus } from "../models/invoice.model";
import { Role, IUser } from "../models/User";
import ApiError from "../utils/apiError";
import searchService from "./search.service";
import { validateObjectId } from "../utils/validation";
import { SearchResult } from "../types/search.types";
import { ListInvoicesInput } from "../validators/invoice.validator";

/**
 * InvoiceService — Business logic layer for Invoices management.
 */
class InvoiceService {
  /**
   * Get invoice details by ID with society tenant isolation.
   */
  async getInvoiceById(
    societyId: Types.ObjectId,
    user: IUser,
    id: string
  ): Promise<IInvoice> {
    validateObjectId(id, "Invoice ID");

    const invoice = await InvoiceModel.findOne({
      _id: id,
      society: societyId,
      isDeleted: { $ne: true },
    })
      .populate("maintenance", "title billingPeriod amount dueDate lateFee")
      .populate("resident", "name email phone roles");

    if (!invoice) {
      throw ApiError.notFound("Invoice not found.");
    }

    const isResident = user.roles.includes(Role.RESIDENT);
    const isAdmin =
      user.roles.includes(Role.ADMIN) ||
      user.roles.includes(Role.SUPER_ADMIN) ||
      user.roles.includes(Role.OWNER);

    if (isResident && !isAdmin && invoice.resident._id.toString() !== user._id.toString()) {
      throw ApiError.forbidden("You do not have permission to view this invoice.");
    }

    return invoice;
  }

  /**
   * List invoices with filtering, search, and role isolation.
   */
  async listInvoices(
    societyId: Types.ObjectId,
    user: IUser,
    input: ListInvoicesInput
  ): Promise<SearchResult<IInvoice>> {
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

    if (input.maintenanceId) {
      validateObjectId(input.maintenanceId, "Maintenance ID");
      filter.maintenance = new Types.ObjectId(input.maintenanceId);
    }

    if (input.flat) filter.flat = input.flat;
    if (input.status) filter.status = input.status;

    if (input.startDate || input.endDate) {
      filter.dueDate = {};
      if (input.startDate) filter.dueDate.$gte = new Date(input.startDate);
      if (input.endDate) filter.dueDate.$lte = new Date(input.endDate);
    }

    return searchService.search<IInvoice>(InvoiceModel as any, {
      searchKeyword: input.searchKeyword,
      searchFields: ["invoiceNumber", "flat"],
      filter,
      sort: input.sort || "-dueDate",
      page: input.page ? Number(input.page) : undefined,
      limit: input.limit ? Number(input.limit) : undefined,
      populate: [
        { path: "maintenance", select: "title billingPeriod amount dueDate" },
        { path: "resident", select: "name email phone" },
      ],
    });
  }

  /**
   * Update overdue status for invoices past due date.
   */
  async markOverdueInvoices(societyId: Types.ObjectId): Promise<number> {
    const result = await InvoiceModel.updateMany(
      {
        society: societyId,
        status: { $in: [InvoiceStatus.PENDING, InvoiceStatus.PARTIALLY_PAID] },
        dueDate: { $lt: new Date() },
        isDeleted: { $ne: true },
      },
      {
        $set: { status: InvoiceStatus.OVERDUE },
      }
    );

    return result.modifiedCount;
  }
}

export default new InvoiceService();
