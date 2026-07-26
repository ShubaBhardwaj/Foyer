import { useEffect } from "react";
import { setAuthTokenProvider, setUnauthenticatedHandler } from "@/api/axios";
import { authRepository } from "@/repositories/auth.repository";
import { useAuthStore } from "@/store/use-auth-store";
import { queryClient } from "@/lib/query-client";
import { getClerkModule } from "@/lib/clerk";

export function useAuthInitializer() {
  const setUserSession = useAuthStore((s) => s.setUserSession);
  const setRequiresSocietyCode = useAuthStore((s) => s.setRequiresSocietyCode);
  const setInitialized = useAuthStore((s) => s.setInitialized);
  const logoutStore = useAuthStore((s) => s.logout);

  const clerk = getClerkModule();
  
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const clerkAuth = clerk?.useAuth
    // eslint-disable-next-line react-hooks/rules-of-hooks
    ? clerk.useAuth({ treatPendingAsSignedOut: false })
    : { getToken: async () => null as string | null, isSignedIn: undefined, isLoaded: true };
  
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const clerkUserResult = clerk?.useUser ? clerk.useUser() : { user: null };

  const { getToken, isSignedIn, isLoaded: isClerkLoaded } = clerkAuth;
  const clerkUser = clerkUserResult.user;

  const performFullLogout = async () => {
    try {
      if (clerk && clerk.useClerk) {
        const { signOut } = clerk.useClerk();
        if (signOut) await signOut();
      }
    } catch {
      // Clerk unavailable
    }
    queryClient.clear();
    logoutStore();
    setInitialized(true);
  };

  useEffect(() => {
    setAuthTokenProvider(async () => {
      if (!isSignedIn) return null;
      return await getToken();
    });

    setUnauthenticatedHandler(() => {
      performFullLogout();
    });
  }, [getToken, isSignedIn]);

  useEffect(() => {
    if (!isClerkLoaded) return;

    let isMounted = true;

    async function syncBackendSession() {
      if (!isSignedIn) {
        if (isMounted) {
          logoutStore();
          setInitialized(true);
        }
        return;
      }

      try {
        // Step 1: Call GET /auth/me to restore authenticated session from backend
        try {
          const meRes = await authRepository.getMe();
          if (meRes && meRes.user && meRes.user._id && isMounted) {
            setUserSession(
              meRes.user,
              meRes.society,
              clerkUser
                ? {
                    id: clerkUser.id,
                    email: clerkUser.primaryEmailAddress?.emailAddress,
                    fullName: clerkUser.fullName || undefined,
                    imageUrl: clerkUser.imageUrl,
                  }
                : null,
              meRes.role,
              meRes.permissions
            );
            setInitialized(true);
            return;
          }
        } catch (meError: any) {
          // If 404 or missing account, proceed to completeLogin evaluation
        }

        // Step 2: Attempt completeLogin to check if user needs society code
        const clerkMeta = clerkUser
          ? {
              clerkId: clerkUser.id,
              email: clerkUser.primaryEmailAddress?.emailAddress,
              firstName: clerkUser.firstName || undefined,
              lastName: clerkUser.lastName || undefined,
              imageUrl: clerkUser.imageUrl,
            }
          : {};

        const completeRes = await authRepository.completeLogin(clerkMeta);

        if (completeRes.requiresSocietyCode) {
          if (isMounted) {
            setRequiresSocietyCode(true);
            setInitialized(true);
          }
          return;
        }

        if (completeRes.user && completeRes.user._id && isMounted) {
          setUserSession(
            completeRes.user,
            completeRes.society,
            clerkUser
              ? {
                  id: clerkUser.id,
                  email: clerkUser.primaryEmailAddress?.emailAddress,
                  fullName: clerkUser.fullName || undefined,
                  imageUrl: clerkUser.imageUrl,
                }
              : null,
            completeRes.role,
            completeRes.permissions
          );
          setInitialized(true);
          return;
        }

        if (isMounted) {
          await performFullLogout();
        }
      } catch (err) {
        console.warn("[useAuthInitializer] Backend verification failed on startup:", err);
        if (isMounted) {
          await performFullLogout();
        }
      }
    }

    syncBackendSession();

    return () => {
      isMounted = false;
    };
  }, [isClerkLoaded, isSignedIn, clerkUser, setUserSession, setRequiresSocietyCode, setInitialized, logoutStore]);

  return {
    isLoaded: isClerkLoaded,
    isSignedIn,
  };
}

