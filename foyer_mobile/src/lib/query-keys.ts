/**
 * Centralized Query Keys Factory for TanStack Query.
 * All query hooks and mutations MUST use these keys to maintain consistent cache invalidation.
 */
export const queryKeys = {
  // Auth & User Profile
  auth: {
    all: ["auth"] as const,
    me: () => ["auth", "me"] as const,
    society: () => ["auth", "society"] as const,
  },

  // Dashboard Metrics
  dashboard: {
    all: ["dashboard"] as const,
    byRole: (role?: string) => ["dashboard", role ?? "default"] as const,
  },

  // Visitors Module
  visitors: {
    all: ["visitors"] as const,
    list: (filters?: Record<string, unknown>) => ["visitors", "list", filters ?? {}] as const,
    detail: (id: string) => ["visitors", "detail", id] as const,
    preApproved: () => ["visitors", "preApproved"] as const,
  },

  // Complaints Module
  complaints: {
    all: ["complaints"] as const,
    list: (filters?: Record<string, unknown>) => ["complaints", "list", filters ?? {}] as const,
    detail: (id: string) => ["complaints", "detail", id] as const,
  },

  // Notices Module
  notices: {
    all: ["notices"] as const,
    list: (filters?: Record<string, unknown>) => ["notices", "list", filters ?? {}] as const,
    detail: (id: string) => ["notices", "detail", id] as const,
  },

  // Amenities Module
  amenities: {
    all: ["amenities"] as const,
    list: (filters?: Record<string, unknown>) => ["amenities", "list", filters ?? {}] as const,
    detail: (id: string) => ["amenities", "detail", id] as const,
    slots: (id: string, date: string) => ["amenities", "slots", id, date] as const,
  },

  // Bookings Module
  bookings: {
    all: ["bookings"] as const,
    list: (filters?: Record<string, unknown>) => ["bookings", "list", filters ?? {}] as const,
    detail: (id: string) => ["bookings", "detail", id] as const,
  },

  // Polls Module (Independent domain: /polls)
  polls: {
    all: ["polls"] as const,
    list: (filters?: Record<string, unknown>) => ["polls", "list", filters ?? {}] as const,
    detail: (id: string) => ["polls", "detail", id] as const,
  },

  // Community Module (Posts, Comments, Reactions)
  community: {
    all: ["community"] as const,
    posts: (filters?: Record<string, unknown>) => ["community", "posts", filters ?? {}] as const,
    post: (id: string) => ["community", "post", id] as const,
    comments: (postId: string) => ["community", "comments", postId] as const,
  },

  // Maintenance & Invoices Module
  maintenance: {
    all: ["maintenance"] as const,
    invoices: (filters?: Record<string, unknown>) => ["maintenance", "invoices", filters ?? {}] as const,
    invoice: (id: string) => ["maintenance", "invoice", id] as const,
    summary: () => ["maintenance", "summary"] as const,
  },

  // Notifications Center
  notifications: {
    all: ["notifications"] as const,
    list: (filters?: Record<string, unknown>) => ["notifications", "list", filters ?? {}] as const,
    unreadCount: () => ["notifications", "unreadCount"] as const,
  },

  // Profile, Vehicles & Household
  profile: {
    all: ["profile"] as const,
    me: () => ["profile", "me"] as const,
    vehicles: () => ["profile", "vehicles"] as const,
    household: () => ["profile", "household"] as const,
    documents: () => ["profile", "documents"] as const,
  },
} as const;
