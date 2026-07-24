export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    me: ["auth", "me"] as const,
  },
  society: {
    all: ["society"] as const,
    me: ["society", "me"] as const,
    structure: ["society", "structure"] as const,
  },
  users: {
    all: ["users"] as const,
    list: (role?: string) => ["users", "list", role || "all"] as const,
  },
} as const;
