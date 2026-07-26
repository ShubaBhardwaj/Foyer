export type UserRole = "RESIDENT" | "ADMIN" | "GUARD" | "OWNER" | "resident" | "admin" | "guard" | "owner" | "super_admin";

export interface UserMongoDto {
  _id: string;
  clerkId?: string | null;
  uniqueId?: string;
  name: string;
  email: string;
  phone?: string;
  roles?: UserRole[];
  role: UserRole;
  permissions?: string[];
  status: "ACTIVE" | "INACTIVE" | "PENDING" | "active" | "blocked";
  society?: string | SocietyDto;
  flatNumber?: string;
  tower?: string;
  flat?: string;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SocietyDto {
  _id: string;
  name: string;
  societyCode: string;
  code?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  zipCode?: string;
  logo?: string;
  themeColor?: string;
}

export interface CompleteLoginRequestDto {
  clerkId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
}

export interface CompleteLoginResponseDto {
  success: boolean;
  requiresSocietyCode?: boolean;
  message?: string;
  user?: UserMongoDto;
  society?: SocietyDto;
  role?: UserRole;
  permissions?: string[];
}

export interface LinkAccountRequestDto {
  clerkId?: string;
  societyCode: string;
}

export interface LinkAccountResponseDto {
  success: boolean;
  user: UserMongoDto;
  society?: SocietyDto;
  role?: UserRole;
  permissions?: string[];
  message?: string;
}

export interface GetMeResponseDto {
  success: boolean;
  user: UserMongoDto;
  society?: SocietyDto;
  role?: UserRole;
  permissions?: string[];
}

