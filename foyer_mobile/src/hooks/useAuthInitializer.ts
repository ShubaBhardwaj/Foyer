import { useEffect } from "react";
import { setAuthTokenProvider } from "@/api/axios";
import { authRepository } from "@/repositories/auth.repository";
import { useAuthStore } from "@/store/use-auth-store";
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
    ? clerk.useAuth()
    : { getToken: async () => null as string | null, isSignedIn: undefined, isLoaded: true };
  
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const clerkUserResult = clerk?.useUser ? clerk.useUser() : { user: null };

  const { getToken, isSignedIn, isLoaded: isClerkLoaded } = clerkAuth;
  const clerkUser = clerkUserResult.user;

  useEffect(() => {
    // Inject token provider into Axios client
    setAuthTokenProvider(async () => {
      if (!isSignedIn) return null;
      return await getToken();
    });
  }, [getToken, isSignedIn]);

  useEffect(() => {
    if (!isClerkLoaded) return;

    let isMounted = true;

    async function syncBackendSession() {
      try {
        // Attempt session restore with backend /auth/me
        const meRes = await authRepository.getMe();

        if (meRes && meRes.user && isMounted) {
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

        // If no user found from GET /auth/me and signed in on Clerk, complete login
        if (isSignedIn && clerkUser) {
          const completeRes = await authRepository.completeLogin({});
          if (completeRes && completeRes.user && isMounted) {
            setUserSession(completeRes.user, completeRes.society, {
              id: clerkUser.id,
              email: clerkUser.primaryEmailAddress?.emailAddress,
              fullName: clerkUser.fullName || undefined,
              imageUrl: clerkUser.imageUrl,
            });
            setInitialized(true);
            return;
          }
        }

        if (isMounted) {
          setInitialized(true);
        }
      } catch (err) {
        console.warn("[useAuthInitializer] Session restore completed without active backend session:", err);
        if (isMounted) {
          setInitialized(true);
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
