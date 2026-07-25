export interface UserProfileData {
  name: string;
  societyName: string;
  unitDetails: string;
  role: "society_admin" | "resident" | "guard";
}

export interface QuickActionItem {
  id: string;
  label: string;
  iconName: "UserPlus" | "FilePlus" | "Vote" | "CalendarPlus";
  accessibilityHint: string;
}

export interface OverviewStat {
  id: string;
  title: string;
  value: string;
  caption: string;
  iconName: "Users" | "UserCheck" | "AlertCircle" | "Calendar";
}

export interface VisitorRequest {
  id: string;
  name: string;
  unit: string;
  timeAgo: string;
  status: "pending" | "approved" | "rejected";
  initials: string;
  avatarUrl?: string;
}

export interface ComplaintItem {
  id: string;
  title: string;
  status: "pending" | "approved" | "rejected" | "neutral";
  timestamp: string;
  category: string;
}

export interface BookingItem {
  id: string;
  facilityName: string;
  bookingTime: string;
  status: "approved" | "pending" | "rejected";
}

export interface NoticeItem {
  id: string;
  title: string;
  preview: string;
  date: string;
  isUrgent?: boolean;
}

export interface AdminActionItem {
  id: string;
  title: string;
  subtitle: string;
  iconName: "Users" | "Shield" | "BarChart3";
  countBadge?: number;
}

export const HOME_DUMMY_DATA = {
  userProfile: {
    name: "Shubham",
    societyName: "Green Valley Residency",
    unitDetails: "Tower A • Flat 504",
    role: "society_admin" as const,
  },
  quickActions: [
    {
      id: "visitor",
      label: "+ Visitor",
      iconName: "UserPlus",
      accessibilityHint: "Add a new visitor entry request",
    },
    {
      id: "notice",
      label: "+ Notice",
      iconName: "FilePlus",
      accessibilityHint: "Create a new society notice",
    },
    {
      id: "poll",
      label: "+ Poll",
      iconName: "Vote",
      accessibilityHint: "Create a new resident poll",
    },
    {
      id: "booking",
      label: "+ Booking",
      iconName: "CalendarPlus",
      accessibilityHint: "Book an amenity or facility",
    },
  ] as QuickActionItem[],
  overviewStats: [
    {
      id: "visitors",
      title: "Visitors Today",
      value: "18",
      caption: "Compared to yesterday",
      iconName: "Users",
    },
    {
      id: "pending_approvals",
      title: "Pending Approvals",
      value: "4",
      caption: "Requires action",
      iconName: "UserCheck",
    },
    {
      id: "open_complaints",
      title: "Open Complaints",
      value: "3",
      caption: "2 high priority",
      iconName: "AlertCircle",
    },
    {
      id: "amenities_booked",
      title: "Amenities Booked",
      value: "12",
      caption: "For today & weekend",
      iconName: "Calendar",
    },
  ] as OverviewStat[],
  visitorRequests: [
    {
      id: "v1",
      name: "John Doe",
      unit: "Tower A • Flat 302",
      timeAgo: "2 mins ago",
      status: "pending",
      initials: "JD",
    },
    {
      id: "v2",
      name: "Rahul Sharma",
      unit: "Tower B • Flat 104",
      timeAgo: "15 mins ago",
      status: "approved",
      initials: "RS",
    },
    {
      id: "v3",
      name: "Priya Patel",
      unit: "Tower A • Flat 504",
      timeAgo: "1 hour ago",
      status: "pending",
      initials: "PP",
    },
  ] as VisitorRequest[],
  recentComplaints: [
    {
      id: "c1",
      title: "Water leakage in Main Pipe",
      status: "pending",
      timestamp: "Today, 09:30 AM",
      category: "Plumbing",
    },
    {
      id: "c2",
      title: "Basement Parking B2 Light Defect",
      status: "approved",
      timestamp: "Yesterday, 04:15 PM",
      category: "Electrical",
    },
    {
      id: "c3",
      title: "Gym Treadmill #2 Maintenance",
      status: "neutral",
      timestamp: "23 Jul, 11:00 AM",
      category: "Amenities",
    },
  ] as ComplaintItem[],
  upcomingBookings: [
    {
      id: "b1",
      facilityName: "Club House Hall",
      bookingTime: "Today, 7:00 PM - 10:00 PM",
      status: "approved",
    },
    {
      id: "b2",
      facilityName: "Badminton Court 1",
      bookingTime: "Tomorrow, 6:00 AM - 7:00 AM",
      status: "pending",
    },
  ] as BookingItem[],
  recentNotices: [
    {
      id: "n1",
      title: "Scheduled Elevator Maintenance Shutdown",
      preview: "Elevator B in Tower A will undergo quarterly servicing tomorrow from 10 AM to 1 PM.",
      date: "Today, 08:00 AM",
      isUrgent: true,
    },
    {
      id: "n2",
      title: "Annual General Body Meeting (AGM) Announcement",
      preview: "All resident owners are invited to attend the AGM at the Clubhouse Auditorium.",
      date: "Yesterday",
      isUrgent: false,
    },
  ] as NoticeItem[],
  adminActions: [
    {
      id: "manage_residents",
      title: "Manage Residents",
      subtitle: "Approve flat registrations & resident directory",
      iconName: "Users",
      countBadge: 5,
    },
    {
      id: "manage_guards",
      title: "Manage Guards",
      subtitle: "Shift rosters, gate assignments & attendance",
      iconName: "Shield",
      countBadge: 2,
    },
    {
      id: "todays_analytics",
      title: "Today's Analytics",
      subtitle: "Traffic metrics, visitor frequency & gate activity",
      iconName: "BarChart3",
    },
  ] as AdminActionItem[],
};
