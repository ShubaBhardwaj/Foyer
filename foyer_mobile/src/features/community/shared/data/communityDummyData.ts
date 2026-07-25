import { CommunityPost } from "../../posts/types/post.types";
import { CommunityPoll } from "../../polls/types/poll.types";
import { CommunityEvent } from "../../events/types/event.types";
import { CommunityNotice } from "../../notices/types/notice.types";

export interface CommunityStatistic {
  id: string;
  title: string;
  value: string;
  caption: string;
  iconName: "MessageSquare" | "Vote" | "Calendar" | "Bell";
}

export type CommunityCategoryFilter =
  | "All"
  | "Pinned"
  | "Discussions"
  | "Polls"
  | "Events"
  | "Notices";

export const communityCategoryFilters: CommunityCategoryFilter[] = [
  "All",
  "Pinned",
  "Discussions",
  "Polls",
  "Events",
  "Notices",
];

export const communityStatistics: CommunityStatistic[] = [
  {
    id: "posts",
    title: "Discussions",
    value: "42",
    caption: "Active threads",
    iconName: "MessageSquare",
  },
  {
    id: "polls",
    title: "Open Polls",
    value: "3",
    caption: "Needs your vote",
    iconName: "Vote",
  },
  {
    id: "events",
    title: "Upcoming Events",
    value: "5",
    caption: "This month",
    iconName: "Calendar",
  },
  {
    id: "notices",
    title: "Notice Alerts",
    value: "4",
    caption: "1 Emergency",
    iconName: "Bell",
  },
];

export const communityPosts: CommunityPost[] = [
  {
    id: "post_001",
    authorName: "Shubham Bhardwaj",
    authorRole: "Society President",
    initials: "SB",
    timeAgo: "2 hours ago",
    title: "Solar Panel Installation Proposal in Tower A & B Roof",
    content:
      "Hello residents! The Managing Committee is proposing the installation of rooftop solar panels to power common area lighting and elevators. Please check the attachment and vote in the active poll.",
    category: "Announcement",
    isPinned: true,
    likesCount: 24,
    commentsCount: 8,
    isLiked: true,
    comments: [
      {
        id: "c1",
        authorName: "Ananya Mehta",
        initials: "AM",
        timeAgo: "1 hour ago",
        content: "Great initiative! What is the estimated payback period for maintenance cost offset?",
        likesCount: 5,
      },
      {
        id: "c2",
        authorName: "Suresh Gupta",
        initials: "SG",
        timeAgo: "30 mins ago",
        content: "Fully support this project. Will reduce society maintenance bills significantly.",
        likesCount: 3,
      },
    ],
  },
  {
    id: "post_002",
    authorName: "Vikram Malhotra",
    authorRole: "Resident (Tower C • 701)",
    initials: "VM",
    timeAgo: "5 hours ago",
    title: "Recommendation for Weekend Kids Football Trainer",
    content:
      "Does anyone have contacts for a certified football coach interested in conducting weekend coaching sessions at our society sports ground?",
    category: "Discussion",
    isPinned: false,
    likesCount: 11,
    commentsCount: 4,
    isLiked: false,
    comments: [
      {
        id: "c3",
        authorName: "Priya Patel",
        initials: "PP",
        timeAgo: "3 hours ago",
        content: "Coach Rahul conducts classes nearby on Saturdays. I can share his contact!",
        likesCount: 2,
      },
    ],
  },
  {
    id: "post_003",
    authorName: "Estate Management",
    authorRole: "Admin",
    initials: "EM",
    timeAgo: "Yesterday",
    title: "Quarterly Water Tank Cleaning Drive",
    content:
      "All overhead water tanks will undergo bi-annual cleaning on Sunday between 08:00 AM and 01:00 PM. Water supply will be paused temporarily during this duration.",
    category: "Maintenance",
    isPinned: true,
    likesCount: 38,
    commentsCount: 12,
    isLiked: false,
  },
];

export const communityPolls: CommunityPoll[] = [
  {
    id: "poll_001",
    question: "Should we convert the unused lawns into a Pickleball Court?",
    description: "The sports committee estimates 3 weeks construction timeline with minimal noise.",
    creatorName: "Sports Committee",
    creatorInitials: "SC",
    category: "Poll",
    options: [
      { id: "o1", text: "Yes, convert to Pickleball Court", votesCount: 68, percentage: 68 },
      { id: "o2", text: "No, keep green lawn area", votesCount: 24, percentage: 24 },
      { id: "o3", text: "Neutral / No Opinion", votesCount: 8, percentage: 8 },
    ],
    totalVotes: 100,
    userVotedOptionId: "o1",
    endsIn: "2 days left",
    endDate: "27 Jul 2026",
    isClosed: false,
  },
  {
    id: "poll_002",
    question: "Preferred Timing for Diwali Cultural Night Celebrations",
    description: "Select the time slot that works best for your family.",
    creatorName: "Cultural Club",
    creatorInitials: "CC",
    category: "Poll",
    options: [
      { id: "o4", text: "6:00 PM - 9:00 PM", votesCount: 45, percentage: 45 },
      { id: "o5", text: "7:00 PM - 10:00 PM", votesCount: 55, percentage: 55 },
    ],
    totalVotes: 100,
    endsIn: "5 days left",
    endDate: "30 Jul 2026",
    isClosed: false,
  },
];

export const communityEvents: CommunityEvent[] = [
  {
    id: "event_001",
    title: "Annual Society Monsoon Tree Plantation Drive",
    description:
      "Join fellow residents in planting 100 native saplings around our perimeter gardens. Refreshments and planting toolkits will be provided.",
    venue: "Central Garden Lawns",
    date: "Sunday, 27 Jul 2026",
    time: "08:30 AM - 11:30 AM",
    organizer: "Green Earth Club",
    rsvpCount: 42,
    capacity: 60,
    isUserRsvped: true,
    category: "Event",
  },
  {
    id: "event_002",
    title: "Health & Cardiac Wellness Checkup Camp",
    description:
      "Free ECG, Blood Pressure, Diabetes, and BMI screening by Apollo Hospital specialists for all society members.",
    venue: "Clubhouse Auditorium (1st Floor)",
    date: "Saturday, 02 Aug 2026",
    time: "09:00 AM - 02:00 PM",
    organizer: "Managing Committee & Apollo Hospital",
    rsvpCount: 85,
    capacity: 150,
    isUserRsvped: false,
    category: "Event",
  },
];

export const communityNotices: CommunityNotice[] = [
  {
    id: "notice_001",
    title: "Emergency Main Lift Servicing in Tower B",
    description: "Lift 1 in Tower B experienced motor tripping and is offline for technician repair.",
    date: "Today, 10:15 AM",
    priority: "Emergency",
    isPinned: true,
    category: "Notice",
  },
  {
    id: "notice_002",
    title: "STP Plant Maintenance Schedule Notice",
    description: "Sewage Treatment Plant aeration blowers will run on reduced capacity tonight.",
    date: "Yesterday",
    priority: "Maintenance",
    isPinned: false,
    category: "Notice",
  },
  {
    id: "notice_003",
    title: "Vehicle Parking Sticker Mandatory Enforcement",
    description: "Unregistered vehicles without RFID tags will require Gate Guard clearance starting Aug 1st.",
    date: "23 Jul 2026",
    priority: "Important",
    isPinned: true,
    category: "Notice",
  },
];
