import { useEffect } from "react";
import { setAuthTokenProvider, setUnauthenticatedHandler } from "@/api/axios";
import { authRepository } from "@/repositories/auth.repository";
import { useAuthStore } from "@/store/use-auth-store";
import { queryClient } from "@/lib/query-client";
import { getClerkModule } from "@/lib/clerk";

export function useAuthInitializer() {
  const setUserSession = useAuthStore((s) => s.setUserSession);
  const setInitialized = useAuthStore((s) => s.setInitialized);
  const logoutStore = useAuthStore((s) => s.logout);

  const clerk = getClerkModule();
  
  // Safely call Clerk hooks if module is available
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const clerkAuth = clerk?.useAuth
    // eslint-disable-next-line react-hooks/rules-of-hooks
    ? clerk.useAuth({ treatPendingAsSignedOut: false })
    : { getToken: async () => null as string | null, isSignedIn: undefined, isLoaded: true };
  
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const clerkUserResult = clerk?.useUser ? clerk.useUser() : { user: null };

  const { getToken, isSignedIn, isLoaded: isClerkLoaded } = clerkAuth;
  const clerkUser = clerkUserResult.user;

  // Helper for full session cleanup on failure or 401
  const performFullLogout = async () => {
    try {
      if (clerk && clerk.useClerk) {
        const { signOut } = clerk.useClerk();
        if (signOut) await signOut();
      }
    } catch {
      // Clerk unavailable or signOut failed
    }
    queryClient.clear();
    logoutStore();
    setInitialized(true);
  };

  useEffect(() => {
    // Inject token provider into Axios client
    setAuthTokenProvider(async () => {
      if (!isSignedIn) return null;
      return await getToken();
    });

    // Register 401 unauthenticated handler
    setUnauthenticatedHandler(() => {
      performFullLogout();
    });
  }, [getToken, isSignedIn]);

  useEffect(() => {
    if (!isClerkLoaded) return;

    let isMounted = true;

    async function syncBackendSession() {
      // If no Clerk session exists, clear backend session and finish initialization
      if (!isSignedIn) {
        if (isMounted) {
          logoutStore();
          setInitialized(true);
        }
        return;
      }

      try {
        // Step 1: Call GET /auth/me to verify existing session with backend truth
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
              : null
          );
          setInitialized(true);
          return;
        }

        // Step 2: If GET /auth/me returned empty, attempt complete-login sync
        const completeRes = await authRepository.completeLogin({});
        const mongoUser = (completeRes as any)?.user || (completeRes as any)?.data?.user;
        const societyObj = (completeRes as any)?.society || (completeRes as any)?.data?.society;

        if (mongoUser && mongoUser._id && isMounted) {
          setUserSession(
            mongoUser,
            societyObj,
            clerkUser
              ? {
                  id: clerkUser.id,
                  email: clerkUser.primaryEmailAddress?.emailAddress,
                  fullName: clerkUser.fullName || undefined,
                  imageUrl: clerkUser.imageUrl,
                }
              : null
          );
          setInitialized(true);
          return;
        }

        // If backend verification returned invalid data, purge session
        if (isMounted) {
          await performFullLogout();
        }
      } catch (err) {
        console.warn("[useAuthInitializer] Backend verification failed on startup — purging session:", err);
        if (isMounted) {
          await performFullLogout();
        }
      }
    }

    syncBackendSession();

    return () => {
      isMounted = false;
    };
  }, [isClerkLoaded, isSignedIn, clerkUser, setUserSession, setInitialized, logoutStore]);

  return {
    isLoaded: isClerkLoaded,
    isSignedIn,
  };
}
