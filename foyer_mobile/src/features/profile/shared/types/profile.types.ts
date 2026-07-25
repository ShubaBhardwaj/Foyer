export interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
  initials: string;
  residentId: string;
  tower: string;
  flat: string;
  role: "Society Admin" | "Resident Owner" | "Tenant";
  phone: string;
  email: string;
  occupation: string;
  bio?: string;
  societyName: string;
}

export type HouseholdRole =
  | "Owner"
  | "Resident"
  | "Tenant"
  | "Family Member"
  | "Domestic Helper"
  | "Driver";

export interface HouseholdMember {
  id: string;
  name: string;
  role: HouseholdRole;
  relationship: string;
  phone?: string;
  isVerified: boolean;
  avatar?: string;
  initials: string;
}

export interface Vehicle {
  id: string;
  vehicleNumber: string;
  type: "Car" | "Bike" | "EV" | "SUV";
  parkingSlot: string;
  status: "Verified" | "Pending" | "Rejected";
}

export interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  isPrimary: boolean;
}

export interface DigitalDocument {
  id: string;
  title: string;
  type: "Aadhaar" | "PAN" | "Rental Agreement" | "Vehicle RC" | "Society ID";
  docNumber: string;
  status: "Verified" | "Pending Verification" | "Expired";
  expiryDate?: string;
}

export interface NotificationPreferences {
  visitorAlerts: boolean;
  bookingUpdates: boolean;
  communityPosts: boolean;
  polls: boolean;
  events: boolean;
  maintenance: boolean;
  announcements: boolean;
  marketing: boolean;
}

export interface AppSettings {
  darkMode: boolean;
  language: string;
  appVersion: string;
  buildNumber: string;
  cacheSize: string;
  developerOptions: boolean;
  experimentalFeatures: boolean;
}
