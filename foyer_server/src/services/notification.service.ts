import { NotificationPayload } from "../types/common";

/**
 * NotificationService Abstraction.
 * Serves as the single entry point for all push & system notifications.
 *
 * Current Phase: Placeholder implementation logging requests and returning resolved Promises.
 * Future Phase: Integrates Expo Push Notification SDK without changing business logic.
 */
class NotificationService {
  async notifyVisitorRequest(userIds: string[], details: any): Promise<void> {
    this.logNotification("notifyVisitorRequest", userIds, details);
  }

  async notifyVisitorApproved(userIds: string[], details: any): Promise<void> {
    this.logNotification("notifyVisitorApproved", userIds, details);
  }

  async notifyVisitorRejected(userIds: string[], details: any): Promise<void> {
    this.logNotification("notifyVisitorRejected", userIds, details);
  }

  async notifyComplaintCreated(userIds: string[], details: any): Promise<void> {
    this.logNotification("notifyComplaintCreated", userIds, details);
  }

  async notifyComplaintAssigned(userIds: string[], details: any): Promise<void> {
    this.logNotification("notifyComplaintAssigned", userIds, details);
  }

  async notifyComplaintResolved(userIds: string[], details: any): Promise<void> {
    this.logNotification("notifyComplaintResolved", userIds, details);
  }

  async notifyBookingCreated(userIds: string[], details: any): Promise<void> {
    this.logNotification("notifyBookingCreated", userIds, details);
  }

  async notifyBookingApproved(userIds: string[], details: any): Promise<void> {
    this.logNotification("notifyBookingApproved", userIds, details);
  }

  async notifyBookingCancelled(userIds: string[], details: any): Promise<void> {
    this.logNotification("notifyBookingCancelled", userIds, details);
  }

  async notifyNoticePublished(userIds: string[], details: any): Promise<void> {
    this.logNotification("notifyNoticePublished", userIds, details);
  }

  async notifyPollPublished(userIds: string[], details: any): Promise<void> {
    this.logNotification("notifyPollPublished", userIds, details);
  }

  /**
   * Generic notification dispatcher helper.
   */
  async sendNotification(payload: NotificationPayload): Promise<void> {
    this.logNotification("sendNotification", payload.userIds, payload);
  }

  private logNotification(event: string, userIds: string[], data: any): void {
    console.log(`[NotificationService.${event}] Target users: ${userIds.join(", ")}`, data);
  }
}

export default new NotificationService();
