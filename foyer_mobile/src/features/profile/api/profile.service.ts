import {
  profileData,
  householdMembersData,
  vehiclesData,
  emergencyContactsData,
  documentsData,
  initialNotificationPreferences,
  initialAppSettings,
} from "../shared/data/profileDummyData";
import {
  UserProfile,
  HouseholdMember,
  Vehicle,
  EmergencyContact,
  DigitalDocument,
  NotificationPreferences,
  AppSettings,
} from "../shared/types/profile.types";

/**
 * Dummy API service layer for Profile Module.
 * Future backend integration should wire Clerk or API endpoints here.
 */

// TODO: Replace with GET /api/v1/profile
export async function getProfile(): Promise<UserProfile> {
  return Promise.resolve(profileData);
}

// TODO: Replace with PATCH /api/v1/profile
export async function updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
  return Promise.resolve({ ...profileData, ...data });
}

// TODO: Replace with GET /api/v1/household
export async function getHouseholdMembers(): Promise<HouseholdMember[]> {
  return Promise.resolve(householdMembersData);
}

// TODO: Replace with POST /api/v1/household/invite
export async function inviteHouseholdMember(
  data: Partial<HouseholdMember>
): Promise<HouseholdMember> {
  const newMember: HouseholdMember = {
    id: `hm_${Date.now()}`,
    name: data.name ?? "New Member",
    role: data.role ?? "Family Member",
    relationship: data.relationship ?? "Resident",
    phone: data.phone,
    isVerified: false,
    initials: (data.name ?? "NM")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2),
  };
  return Promise.resolve(newMember);
}

// TODO: Replace with GET /api/v1/vehicles
export async function getVehicles(): Promise<Vehicle[]> {
  return Promise.resolve(vehiclesData);
}

// TODO: Replace with GET /api/v1/emergency-contacts
export async function getEmergencyContacts(): Promise<EmergencyContact[]> {
  return Promise.resolve(emergencyContactsData);
}

// TODO: Replace with GET /api/v1/documents
export async function getDocuments(): Promise<DigitalDocument[]> {
  return Promise.resolve(documentsData);
}

// TODO: Replace with GET /api/v1/profile/notifications
export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  return Promise.resolve(initialNotificationPreferences);
}

// TODO: Replace with POST /api/v1/auth/logout
export async function logoutUser(): Promise<boolean> {
  return Promise.resolve(true);
}
