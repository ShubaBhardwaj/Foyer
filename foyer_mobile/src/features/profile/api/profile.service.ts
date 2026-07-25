import { profileRepository } from "@/repositories/profile.repository";
import { AddHouseholdMemberRequestDto, AddVehicleRequestDto, UpdateProfileRequestDto } from "@/types/api/profile";

export async function getProfile() {
  return profileRepository.fetchUserProfile();
}

export async function updateProfile(data: UpdateProfileRequestDto) {
  return profileRepository.updateUserProfile(data);
}

export async function getHouseholdMembers() {
  return profileRepository.fetchHouseholdMembers();
}

export async function inviteHouseholdMember(data: AddHouseholdMemberRequestDto) {
  return profileRepository.createHouseholdMember(data);
}

export async function getVehicles() {
  return profileRepository.fetchVehicles();
}

export async function addVehicle(data: AddVehicleRequestDto) {
  return profileRepository.createVehicle(data);
}

export async function removeVehicle(id: string) {
  return profileRepository.deleteVehicle(id);
}
