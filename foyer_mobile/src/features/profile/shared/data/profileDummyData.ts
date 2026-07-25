import {
  UserProfile,
  HouseholdMember,
  Vehicle,
  EmergencyContact,
  DigitalDocument,
  NotificationPreferences,
  AppSettings,
} from "../types/profile.types";

export const profileData: UserProfile = {
  id: "usr_001",
  name: "Shubham Bhardwaj",
  initials: "SB",
  residentId: "FYR-RES-5040",
  tower: "Tower A",
  flat: "Flat 504",
  role: "Society Admin",
  phone: "+91 98765 43210",
  email: "shubham@foyer.app",
  occupation: "Software Engineer",
  bio: "Society Managing Committee member & Tower A Representative.",
  societyName: "Foyer Heights Residency",
};

export const householdMembersData: HouseholdMember[] = [
  {
    id: "hm_001",
    name: "Ananya Bhardwaj",
    role: "Family Member",
    relationship: "Spouse",
    phone: "+91 98111 22334",
    isVerified: true,
    initials: "AB",
  },
  {
    id: "hm_002",
    name: "Ramesh Sharma",
    role: "Driver",
    relationship: "Personal Driver",
    phone: "+91 98222 33445",
    isVerified: true,
    initials: "RS",
  },
  {
    id: "hm_003",
    name: "Sunita Devi",
    role: "Domestic Helper",
    relationship: "Housekeeping",
    phone: "+91 98333 44556",
    isVerified: false,
    initials: "SD",
  },
];

export const vehiclesData: Vehicle[] = [
  {
    id: "veh_001",
    vehicleNumber: "MH 12 AB 3456",
    type: "Car",
    parkingSlot: "Basement 1 • Slot B-12",
    status: "Verified",
  },
  {
    id: "veh_002",
    vehicleNumber: "MH 12 EV 9999",
    type: "EV",
    parkingSlot: "Basement 1 • Slot EV-04",
    status: "Verified",
  },
];

export const emergencyContactsData: EmergencyContact[] = [
  {
    id: "em_001",
    name: "Ananya Bhardwaj",
    relation: "Spouse",
    phone: "+91 98111 22334",
    isPrimary: true,
  },
  {
    id: "em_002",
    name: "Dr. Suresh Gupta",
    relation: "Family Physician",
    phone: "+91 98444 55667",
    isPrimary: false,
  },
  {
    id: "em_003",
    name: "Gate 1 Security Control",
    relation: "Society Security Kiosk",
    phone: "+91 99999 00000",
    isPrimary: false,
  },
];

export const documentsData: DigitalDocument[] = [
  {
    id: "doc_001",
    title: "Resident Aadhaar Card",
    type: "Aadhaar",
    docNumber: "XXXX-XXXX-8821",
    status: "Verified",
  },
  {
    id: "doc_002",
    title: "Permanent Account Number (PAN)",
    type: "PAN",
    docNumber: "ABCDE1234F",
    status: "Verified",
  },
  {
    id: "doc_003",
    title: "Apartment Ownership Deed",
    type: "Society ID",
    docNumber: "DEED-2024-504",
    status: "Verified",
  },
  {
    id: "doc_004",
    title: "Vehicle Registration Certificate (RC)",
    type: "Vehicle RC",
    docNumber: "RC-MH12-AB3456",
    status: "Verified",
  },
];

export const initialNotificationPreferences: NotificationPreferences = {
  visitorAlerts: true,
  bookingUpdates: true,
  communityPosts: true,
  polls: true,
  events: true,
  maintenance: true,
  announcements: true,
  marketing: false,
};

export const initialAppSettings: AppSettings = {
  darkMode: false,
  language: "English (US)",
  appVersion: "v1.4.0",
  buildNumber: "2026.07.25",
  cacheSize: "14.2 MB",
  developerOptions: false,
  experimentalFeatures: true,
};
