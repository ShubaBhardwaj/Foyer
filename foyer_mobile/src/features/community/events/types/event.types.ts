export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  venue: string;
  date: string;
  time: string;
  organizer: string;
  rsvpCount: number;
  capacity?: number;
  isUserRsvped?: boolean;
  bannerUrl?: string;
  category: "Event";
}
