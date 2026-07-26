export type Role = "owner" | "super_admin" | "admin" | "resident" | "guard";

export interface User {
  _id: string;
  uniqueId: string;
  clerkId: string | null;
  name: string;
  email: string;
  phone: string;
  roles: Role[];
  society: string | Society;
  tower: string | Tower | null;
  flat: string | Flat | null;
  isVerified: boolean;
  status: "active" | "blocked";
  createdAt: string;
  updatedAt: string;
}

export interface Society {
  _id: string;
  name: string;
  societyCode: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  owner: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface Tower {
  _id: string;
  society: string;
  name: string;
  floors: number;
  flatsPerFloor: number;
  createdAt: string;
  updatedAt: string;
}

export interface Flat {
  _id: string;
  society: string;
  tower: string;
  flatNumber: string;
  floor: number;
  occupied: boolean;
  occupiedBy: string | User | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthMeResponse {
  requiresSocietyCode?: boolean;
  user?: User;
  society?: Society | null;
  role?: Role;
  permissions?: string[];
}

export interface StructureResponse {
  towersCount?: number;
  totalFlatsCount?: number;
  towers?: Tower[];
  flats?: Flat[];
  structure?: (Tower & { flats?: Flat[] })[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

// Request Payload Types
export interface CompleteLoginPayload {
  clerkId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
}

export interface LinkAccountPayload {
  clerkId?: string;
  societyCode: string;
}


export interface RegisterSocietyPayload {
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  ownerName: string;
  ownerPhone: string;
}

export interface TowerConfigPayload {
  count: number;
  floors: number;
  flatsPerFloor: number;
}

export interface CreateStructurePayload {
  towers: TowerConfigPayload[];
}

export interface TowerUpdatePayload {
  towerId: string;
  floors: number;
  flatsPerFloor: number;
}

export interface UpdateStructurePayload {
  towers: TowerUpdatePayload[];
}

export interface CreateUserPayload {
  name: string;
  email: string;
  phone: string;
  tower?: string;
  flat?: string;
}

export interface CreateResidentPayload extends CreateUserPayload {
  tower: string;
  flat: string;
}
