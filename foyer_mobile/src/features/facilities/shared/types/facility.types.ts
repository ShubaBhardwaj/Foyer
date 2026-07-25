export type FacilityStatus = "Available" | "Booked" | "Maintenance";

export type FacilityCategory =
  | "All"
  | "Sports"
  | "Indoor"
  | "Outdoor"
  | "Club"
  | "Fitness"
  | "Kids"
  | "Events";

export interface FacilityItem {
  id: string;
  name: string;
  description: string;
  image: string;
  category: FacilityCategory;
  status: FacilityStatus;
  operatingHours: string;
  capacity: string;
  bookingDuration: string;
  bookingLimit: string;
  rules: string[];
  amenities: string[];
  gallery?: string[];
  nextAvailableSlot?: string;
}

export interface TimeSlotItem {
  id: string;
  time: string;
  period: "Morning" | "Afternoon" | "Evening";
  isBooked?: boolean;
  isDisabled?: boolean;
}

export type BookingStatus = "Upcoming" | "Active" | "Completed" | "Cancelled";

export interface BookingItem {
  id: string;
  facilityId: string;
  facilityName: string;
  image: string;
  date: string;
  timeSlot: string;
  status: BookingStatus;
  bookingCode: string;
  purpose?: string;
  notes?: string;
  createdAt: string;
}

export interface GroupedBookingHistory {
  period: "Today" | "Yesterday" | "This Week" | "Earlier";
  bookings: BookingItem[];
}
