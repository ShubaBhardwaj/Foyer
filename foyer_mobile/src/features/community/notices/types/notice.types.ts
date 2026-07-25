export type NoticePriority = "Emergency" | "Important" | "Maintenance" | "General";

export interface CommunityNotice {
  id: string;
  title: string;
  description: string;
  date: string;
  priority: NoticePriority;
  isPinned?: boolean;
  category: "Notice";
}
