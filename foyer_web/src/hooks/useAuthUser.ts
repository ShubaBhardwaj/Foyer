"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { authApi } from "@/services/api/auth.api";
import { queryKeys } from "@/constants/queryKeys";
import { getPrimaryRole } from "@/constants/roles";
import { User, Society, Role } from "@/types";

export interface UseAuthUserReturn {
  user: User | null;
  society: Society | null;
  roles: Role[];
  primaryRole: Role | null;
  isClerkLoaded: boolean;
  isSignedIn: boolean | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
}

export function useAuthUser(): UseAuthUserReturn {
  const { isSignedIn, isLoaded: isClerkLoaded } = useAuth();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: async () => {
      const res = await authApi.getMe();
      return res.data;
    },
    enabled: !!isClerkLoaded && !!isSignedIn,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const user = data?.user || null;
  const society = data?.society || null;
  const roles = user?.roles || [];
  const primaryRole = roles.length > 0 ? getPrimaryRole(roles) : null;

  return {
    user,
    society,
    roles,
    primaryRole,
    isClerkLoaded,
    isSignedIn,
    isLoading: !isClerkLoaded || (!!isSignedIn && isLoading),
    isError,
    error,
    refetch,
  };
}
