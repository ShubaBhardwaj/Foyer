import { create } from "zustand";
import { UserMongoDto, SocietyDto, UserRole } from "@/types/api/auth";

export interface ClerkUserMetaData {
  id: string;
  email?: string;
  fullName?: string;
  imageUrl?: string;
}

interface AuthState {
  clerkUser: ClerkUserMetaData | null;
  user: UserMongoDto | null;
  society: SocietyDto | null;
  role: UserRole | null;
  permissions: string[];
  tower: string | null;
  flat: string | null;
  isAuthenticated: boolean;
  isLoaded: boolean;
  isInitialized: boolean;

  setUserSession: (user: UserMongoDto | null, society?: SocietyDto | null, clerkUser?: ClerkUserMetaData | null) => void;
  setClerkUser: (clerkUser: ClerkUserMetaData | null) => void;
  setInitialized: (initialized: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  clerkUser: null,
  user: null,
  society: null,
  role: null,
  permissions: [],
  tower: null,
  flat: null,
  isAuthenticated: false,
  isLoaded: false,
  isInitialized: false,

  setUserSession: (user, society = null, clerkUser = null) => {
    // Condition 2: Application authentication ONLY exists when a valid MongoDB user is returned from backend
    if (!user || !user._id) {
      set({
        user: null,
        society: null,
        role: null,
        permissions: [],
        tower: null,
        flat: null,
        isAuthenticated: false,
        isLoaded: true,
        isInitialized: true,
      });
      return;
    }

    const permissions = user.permissions || [];
    const tower = typeof user.tower === "string" ? user.tower : null;
    const flat = typeof user.flat === "string" ? user.flat : (user.flatNumber || null);

    set((state) => ({
      user,
      society: society || (typeof user.society === "object" ? (user.society as SocietyDto) : state.society),
      role: user.role,
      permissions,
      tower,
      flat,
      clerkUser: clerkUser || state.clerkUser,
      isAuthenticated: true,
      isLoaded: true,
      isInitialized: true,
    }));
  },

  setClerkUser: (clerkUser) => set({ clerkUser }),

  setInitialized: (initialized) => set({ isInitialized: initialized }),

  logout: () =>
    set({
      clerkUser: null,
      user: null,
      society: null,
      role: null,
      permissions: [],
      tower: null,
      flat: null,
      isAuthenticated: false,
      isLoaded: true,
      isInitialized: true,
    }),
}));
