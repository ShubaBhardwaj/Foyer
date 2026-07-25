export interface VehicleDto {
  _id: string;
  vehicleNumber: string;
  type: "CAR" | "BIKE" | "SCOOTER" | "OTHER";
  model?: string;
  parkingSlot?: string;
}

export interface HouseholdMemberDto {
  _id: string;
  name: string;
  relation: "SPOUSE" | "CHILD" | "PARENT" | "SIBLING" | "TENANT" | "OTHER";
  phone?: string;
  email?: string;
}

export interface UpdateProfileRequestDto {
  name?: string;
  phone?: string;
  avatarUrl?: string;
  tower?: string;
  flatNumber?: string;
}

export interface AddVehicleRequestDto {
  vehicleNumber: string;
  type: "CAR" | "BIKE" | "SCOOTER" | "OTHER";
  model?: string;
  parkingSlot?: string;
}

export interface AddHouseholdMemberRequestDto {
  name: string;
  relation: "SPOUSE" | "CHILD" | "PARENT" | "SIBLING" | "TENANT" | "OTHER";
  phone?: string;
  email?: string;
}
