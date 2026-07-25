import { Types } from "mongoose";
import VisitorModel from "../models/visitor.model";
import { VisitorStatus } from "../constants/enums";
import ComplaintModel, { ComplaintStatus } from "../models/complaint.model";
import NoticeModel, { NoticeStatus, NoticeVisibility, NoticePriority } from "../models/notice.model";
import AmenityModel from "../models/amenity.model";
import BookingModel, { BookingStatus } from "../models/booking.model";
import PollModel, { PollStatus, PollVisibility } from "../models/poll.model";
import MaintenanceModel from "../models/maintenance.model";
import InvoiceModel, { InvoiceStatus } from "../models/invoice.model";
import PaymentModel, { PaymentStatus } from "../models/payment.model";
import CommunityPostModel, { PostStatus, PostVisibility } from "../models/community-post.model";
import CommunityCommentModel from "../models/community-comment.model";
import CommunityReactionModel from "../models/community-reaction.model";
import ActivityModel from "../models/activity.model";
import UserModel, { Role, IUser } from "../models/User";
import ApiError from "../utils/apiError";

/**
 * DashboardService — Aggregates role-specific dashboards & society analytics.
 */
class DashboardService {
  /**
   * GET /dashboard/resident
   */
  async getResidentDashboard(user: IUser) {
    if (!user.society) {
      throw ApiError.forbidden("User account is not linked to any society.");
    }

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // 1. Pending Maintenance Balance
    const unpaidInvoices = await InvoiceModel.find({
      society: user.society,
      resident: user._id,
      status: { $in: [InvoiceStatus.PENDING, InvoiceStatus.PARTIALLY_PAID, InvoiceStatus.OVERDUE] },
      isDeleted: { $ne: true },
    });
    const pendingMaintenanceAmount = unpaidInvoices.reduce((sum, inv) => sum + inv.balance, 0);

    // 2. Upcoming Bookings
    const upcomingBookings = await BookingModel.find({
      society: user.society,
      resident: user._id,
      slotStart: { $gte: now },
      status: { $in: [BookingStatus.APPROVED, BookingStatus.PENDING] },
      isDeleted: { $ne: true },
    })
      .sort({ slotStart: 1 })
      .limit(5)
      .populate("amenity", "name category location");

    // 3. Recent Notices
    const recentNotices = await NoticeModel.find({
      society: user.society,
      status: NoticeStatus.PUBLISHED,
      visibility: { $in: [NoticeVisibility.ALL, NoticeVisibility.RESIDENTS] },
      isDeleted: { $ne: true },
    })
      .sort({ isPinned: -1, publishAt: -1 })
      .limit(5);

    // 4. Active Polls
    const activePolls = await PollModel.find({
      society: user.society,
      status: PollStatus.ACTIVE,
      visibility: { $in: [PollVisibility.ALL, PollVisibility.RESIDENTS] },
      isDeleted: { $ne: true },
    })
      .sort({ createdAt: -1 })
      .limit(5);

    // 5. Open Complaints
    const openComplaints = await ComplaintModel.find({
      society: user.society,
      createdBy: user._id,
      status: { $in: [ComplaintStatus.OPEN, ComplaintStatus.ASSIGNED, ComplaintStatus.IN_PROGRESS] },
      isDeleted: { $ne: true },
    }).sort({ createdAt: -1 });

    // 6. Recent Visitors
    const recentVisitors = await VisitorModel.find({
      society: user.society,
      createdBy: user._id,
      isDeleted: { $ne: true },
    })
      .sort({ createdAt: -1 })
      .limit(5);

    // 7. Community Highlights
    const communityHighlights = await CommunityPostModel.find({
      society: user.society,
      status: PostStatus.ACTIVE,
      visibility: { $in: [PostVisibility.ALL, PostVisibility.RESIDENTS] },
      isDeleted: { $ne: true },
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("author", "name email");

    return {
      pendingMaintenanceAmount,
      upcomingBookings,
      recentNotices,
      activePolls,
      openComplaintsCount: openComplaints.length,
      openComplaints,
      recentVisitors,
      communityHighlights,
    };
  }

  /**
   * GET /dashboard/admin
   */
  async getAdminDashboard(societyId: Types.ObjectId) {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);

    // 1. Visitor Statistics
    const todayVisitors = await VisitorModel.find({
      society: societyId,
      createdAt: { $gte: startOfToday, $lt: endOfToday },
      isDeleted: { $ne: true },
    });

    const visitorStatistics = {
      totalToday: todayVisitors.length,
      checkedIn: todayVisitors.filter((v) => v.status === VisitorStatus.CHECKED_IN).length,
      approved: todayVisitors.filter((v) => v.status === VisitorStatus.APPROVED).length,
      pending: todayVisitors.filter((v) => v.status === VisitorStatus.PENDING).length,
    };

    // 2. Complaints by Status
    const complaintCounts = await ComplaintModel.aggregate([
      { $match: { society: societyId, isDeleted: { $ne: true } } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const complaintsByStatus: Record<string, number> = {};
    complaintCounts.forEach((c) => {
      complaintsByStatus[c._id] = c.count;
    });

    // 3. Active Amenities Count
    const activeAmenitiesCount = await AmenityModel.countDocuments({
      society: societyId,
      isActive: true,
      isDeleted: { $ne: true },
    });

    // 4. Today's Bookings Count
    const todaysBookingsCount = await BookingModel.countDocuments({
      society: societyId,
      slotStart: { $gte: startOfToday, $lt: endOfToday },
      isDeleted: { $ne: true },
    });

    // 5. Outstanding Invoices
    const outstandingInvoicesDocs = await InvoiceModel.find({
      society: societyId,
      status: { $in: [InvoiceStatus.PENDING, InvoiceStatus.PARTIALLY_PAID, InvoiceStatus.OVERDUE] },
      isDeleted: { $ne: true },
    });
    const outstandingInvoices = {
      count: outstandingInvoicesDocs.length,
      totalAmount: outstandingInvoicesDocs.reduce((sum, inv) => sum + inv.balance, 0),
    };

    // 6. Payment Collection Summary
    const paymentCollection = await PaymentModel.aggregate([
      { $match: { society: societyId, status: PaymentStatus.SUCCESS, isDeleted: { $ne: true } } },
      { $group: { _id: null, totalCollected: { $sum: "$amount" } } },
    ]);
    const paymentCollectionSummary = {
      totalCollected: paymentCollection[0]?.totalCollected || 0,
    };

    // 7. Active Notices Count
    const activeNoticesCount = await NoticeModel.countDocuments({
      society: societyId,
      status: NoticeStatus.PUBLISHED,
      isDeleted: { $ne: true },
    });

    // 8. Active Polls Count
    const activePollsCount = await PollModel.countDocuments({
      society: societyId,
      status: PollStatus.ACTIVE,
      isDeleted: { $ne: true },
    });

    // 9. Community Activity (last 7 days)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const postsCount = await CommunityPostModel.countDocuments({
      society: societyId,
      createdAt: { $gte: sevenDaysAgo },
      isDeleted: { $ne: true },
    });
    const commentsCount = await CommunityCommentModel.countDocuments({
      society: societyId,
      createdAt: { $gte: sevenDaysAgo },
      isDeleted: { $ne: true },
    });

    // 10. Occupancy Summary
    const verifiedResidentsCount = await UserModel.countDocuments({
      society: societyId,
      roles: { $in: [Role.RESIDENT, Role.OWNER] },
      isActive: true,
    });

    return {
      visitorStatistics,
      complaintsByStatus,
      activeAmenitiesCount,
      todaysBookingsCount,
      outstandingInvoices,
      paymentCollectionSummary,
      activeNoticesCount,
      activePollsCount,
      communityActivity: {
        postsCount,
        commentsCount,
      },
      occupancySummary: {
        totalActiveUsers: verifiedResidentsCount,
      },
    };
  }

  /**
   * GET /dashboard/guard
   */
  async getGuardDashboard(societyId: Types.ObjectId) {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);

    // 1. Today's Expected Visitors
    const todaysExpectedVisitors = await VisitorModel.find({
      society: societyId,
      status: { $in: [VisitorStatus.APPROVED, VisitorStatus.PENDING, VisitorStatus.CHECKED_IN] },
      createdAt: { $gte: startOfToday, $lt: endOfToday },
      isDeleted: { $ne: true },
    }).populate("createdBy", "name phone");

    // 2. Pending Visitor Approvals
    const pendingVisitorApprovals = await VisitorModel.find({
      society: societyId,
      status: VisitorStatus.PENDING,
      isDeleted: { $ne: true },
    }).populate("createdBy", "name phone");

    // 3. Today's Amenity Bookings
    const todaysAmenityBookings = await BookingModel.find({
      society: societyId,
      status: BookingStatus.APPROVED,
      slotStart: { $gte: startOfToday, $lt: endOfToday },
      isDeleted: { $ne: true },
    }).populate("amenity", "name location").populate("resident", "name phone");

    // 4. Emergency Notices
    const emergencyNotices = await NoticeModel.find({
      society: societyId,
      status: NoticeStatus.PUBLISHED,
      priority: { $in: [NoticePriority.HIGH, NoticePriority.URGENT] },
      visibility: { $in: [NoticeVisibility.ALL, NoticeVisibility.GUARDS] },
      isDeleted: { $ne: true },
    }).sort({ publishAt: -1 });

    return {
      todaysExpectedVisitorsCount: todaysExpectedVisitors.length,
      todaysExpectedVisitors,
      pendingVisitorApprovalsCount: pendingVisitorApprovals.length,
      pendingVisitorApprovals,
      todaysAmenityBookings,
      emergencyNotices,
    };
  }

  /**
   * GET /dashboard/owner
   */
  async getOwnerDashboard(societyId: Types.ObjectId) {
    const adminDash = await this.getAdminDashboard(societyId);

    // Recent System Activities
    const recentActivities = await ActivityModel.find({
      society: societyId,
    })
      .sort({ createdAt: -1 })
      .limit(10);

    return {
      ...adminDash,
      recentActivities,
    };
  }

  /**
   * Reusable Complaint Analytics
   */
  async getComplaintAnalytics(societyId: Types.ObjectId, startDate?: Date, endDate?: Date) {
    const match: Record<string, any> = { society: societyId, isDeleted: { $ne: true } };
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = startDate;
      if (endDate) match.createdAt.$lte = endDate;
    }

    const byStatus = await ComplaintModel.aggregate([
      { $match: match },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const byCategory = await ComplaintModel.aggregate([
      { $match: match },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    return { byStatus, byCategory };
  }

  /**
   * Reusable Visitor Analytics
   */
  async getVisitorAnalytics(societyId: Types.ObjectId, startDate?: Date, endDate?: Date) {
    const match: Record<string, any> = { society: societyId, isDeleted: { $ne: true } };
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = startDate;
      if (endDate) match.createdAt.$lte = endDate;
    }

    const byType = await VisitorModel.aggregate([
      { $match: match },
      { $group: { _id: "$visitorType", count: { $sum: 1 } } },
    ]);

    const byStatus = await VisitorModel.aggregate([
      { $match: match },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    return { byType, byStatus };
  }

  /**
   * Reusable Maintenance Analytics
   */
  async getMaintenanceAnalytics(societyId: Types.ObjectId, startDate?: Date, endDate?: Date) {
    const match: Record<string, any> = { society: societyId, isDeleted: { $ne: true } };
    if (startDate || endDate) {
      match.dueDate = {};
      if (startDate) match.dueDate.$gte = startDate;
      if (endDate) match.dueDate.$lte = endDate;
    }

    const invoicesByStatus = await InvoiceModel.aggregate([
      { $match: match },
      { $group: { _id: "$status", totalAmount: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]);

    return { invoicesByStatus };
  }

  /**
   * Reusable Amenity Analytics
   */
  async getAmenityAnalytics(societyId: Types.ObjectId, startDate?: Date, endDate?: Date) {
    const match: Record<string, any> = { society: societyId, isDeleted: { $ne: true } };
    if (startDate || endDate) {
      match.slotStart = {};
      if (startDate) match.slotStart.$gte = startDate;
      if (endDate) match.slotStart.$lte = endDate;
    }

    const bookingsByAmenity = await BookingModel.aggregate([
      { $match: match },
      { $group: { _id: "$amenity", count: { $sum: 1 } } },
    ]);

    return { bookingsByAmenity };
  }

  /**
   * Reusable Community Analytics
   */
  async getCommunityAnalytics(societyId: Types.ObjectId, startDate?: Date, endDate?: Date) {
    const match: Record<string, any> = { society: societyId, isDeleted: { $ne: true } };
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = startDate;
      if (endDate) match.createdAt.$lte = endDate;
    }

    const totalPosts = await CommunityPostModel.countDocuments(match);
    const totalComments = await CommunityCommentModel.countDocuments(match);
    const totalReactions = await CommunityReactionModel.countDocuments({ society: societyId });

    return { totalPosts, totalComments, totalReactions };
  }
}

export default new DashboardService();
