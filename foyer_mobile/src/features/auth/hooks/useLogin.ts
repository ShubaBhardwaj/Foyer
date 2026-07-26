import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";
import Toast from "react-native-toast-message";
import { authRepository } from "@/repositories/auth.repository";
import { useAuthStore } from "@/store/use-auth-store";
import { queryKeys } from "@/lib/query-keys";
import { getClerkModule } from "@/lib/clerk";

function safeMaybeCompleteAuthSession() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const WebBrowser = require("expo-web-browser");
    if (WebBrowser && typeof WebBrowser.maybeCompleteAuthSession === "function") {
      WebBrowser.maybeCompleteAuthSession();
    }
  } catch {
    // WebBrowser native module absent in dev build
  }
}

safeMaybeCompleteAuthSession();

function getRedirectUri(): string {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const AuthSession = require("expo-auth-session");
    if (AuthSession && typeof AuthSession.makeRedirectUri === "function") {
      return AuthSession.makeRedirectUri();
    }
  } catch {
    // Fallback to expo-linking URL
  }
  return Linking.createURL("/oauth-native-callback");
}

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUserSession = useAuthStore((s) => s.setUserSession);
  const storeRequiresSocietyCode = useAuthStore((s) => s.requiresSocietyCode);
  const setRequiresSocietyCode = useAuthStore((s) => s.setRequiresSocietyCode);

  const clerk = getClerkModule();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const sso = clerk?.useSSO ? clerk.useSSO() : null;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const oauth = clerk?.useOAuth ? clerk.useOAuth({ strategy: "oauth_google" }) : null;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const clerkUserResult = clerk?.useUser ? clerk.useUser() : { user: null };
  const clerkUser = clerkUserResult.user;

  const [societyCode, setSocietyCode] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isLinkingLoading, setIsLinkingLoading] = useState(false);
  const [requiresSocietyCode, setLocalRequiresSocietyCode] = useState(false);

  const showSocietyCodeScreen = requiresSocietyCode || storeRequiresSocietyCode;

  /**
   * Step 1 & 2: Tap "Continue with Google" -> Clerk Auth -> POST /auth/complete-login
   */
  const handleGoogleSignIn = useCallback(async () => {
    setIsGoogleLoading(true);
    try {
      let activeClerkUserId: string | null = null;
      const redirectUrl = getRedirectUri();

      // 1. Authenticate with Clerk Google OAuth
      if (sso && sso.startSSOFlow) {
        try {
          const { createdSessionId, setActive } = await sso.startSSOFlow({
            strategy: "oauth_google",
            redirectUrl,
            additionalParameters: { prompt: "select_account" },
          });
          if (createdSessionId && setActive) {
            await setActive({ session: createdSessionId });
            activeClerkUserId = createdSessionId;
          }
        } catch (ssoErr) {
          console.warn("[handleGoogleSignIn] SSO flow log:", ssoErr);
        }
      } else if (oauth && oauth.startOAuthFlow) {
        try {
          const { createdSessionId, setActive } = await oauth.startOAuthFlow({
            redirectUrl,
            additionalParameters: { prompt: "select_account" },
          });
          if (createdSessionId && setActive) {
            await setActive({ session: createdSessionId });
            activeClerkUserId = createdSessionId;
          }
        } catch (oauthErr) {
          console.warn("[handleGoogleSignIn] OAuth browser flow log:", oauthErr);
        }
      }

      // 2. Call backend POST /auth/complete-login
      const completeRes = await authRepository.completeLogin({
        clerkId: activeClerkUserId || clerkUser?.id,
        email: clerkUser?.primaryEmailAddress?.emailAddress,
        firstName: clerkUser?.firstName || undefined,
        lastName: clerkUser?.lastName || undefined,
        imageUrl: clerkUser?.imageUrl,
      });

      // Case B: Requires society code link
      if (completeRes.requiresSocietyCode) {
        setLocalRequiresSocietyCode(true);
        setRequiresSocietyCode(true);
        Toast.show({
          type: "info",
          text1: "Society Code Required",
          text2: "Please enter your society code to link your account.",
        });
        return;
      }

      // Case A: User exists -> immediate login
      if (completeRes.user && completeRes.user._id) {
        setUserSession(
          completeRes.user,
          completeRes.society,
          {
            id: activeClerkUserId || clerkUser?.id || completeRes.user.clerkId || "user_id",
            email: clerkUser?.primaryEmailAddress?.emailAddress || completeRes.user.email,
            fullName: clerkUser?.fullName || completeRes.user.name,
            imageUrl: clerkUser?.imageUrl,
          },
          completeRes.role,
          completeRes.permissions
        );

        queryClient.prefetchQuery({
          queryKey: queryKeys.auth.me(),
          queryFn: () => authRepository.getMe(),
        }).catch(() => {});

        Toast.show({
          type: "success",
          text1: "Welcome to Foyer",
          text2: `Signed in as ${completeRes.user.name}`,
        });

        router.replace("/(app)/(tabs)/(home)");
      }
    } catch (err: unknown) {
      console.error("[handleGoogleSignIn] Error:", err);
      const msg = err instanceof Error ? err.message : "Authentication failed. Please try again.";
      Toast.show({
        type: "error",
        text1: "Sign In Error",
        text2: msg,
      });
    } finally {
      setIsGoogleLoading(false);
    }
  }, [sso, oauth, clerkUser, setUserSession, setRequiresSocietyCode, queryClient, router]);

  /**
   * Step 4 & 5: Account Linking -> POST /auth/link-account
   */
  const handleLinkAccount = useCallback(async () => {
    const code = societyCode.trim();
    if (!code) {
      Toast.show({
        type: "error",
        text1: "Society Code Required",
        text2: "Please enter your society code.",
      });
      return;
    }

    setIsLinkingLoading(true);
    try {
      const linkRes = await authRepository.linkAccount({
        clerkId: clerkUser?.id,
        societyCode: code,
      });


      if (!linkRes.user || !linkRes.user._id) {
        throw new Error("Failed to link account.");
      }

      setUserSession(
        linkRes.user,
        linkRes.society,
        clerkUser
          ? {
              id: clerkUser.id,
              email: clerkUser.primaryEmailAddress?.emailAddress,
              fullName: clerkUser.fullName || undefined,
              imageUrl: clerkUser.imageUrl,
            }
          : null,
        linkRes.role,
        linkRes.permissions
      );

      setLocalRequiresSocietyCode(false);
      setRequiresSocietyCode(false);

      Toast.show({
        type: "success",
        text1: "Account Linked Successfully",
        text2: `Welcome to ${linkRes.society?.name || "your society"}`,
      });

      router.replace("/(app)/(tabs)/(home)");
    } catch (err: unknown) {
      console.error("[handleLinkAccount] Error:", err);
      const msg = err instanceof Error ? err.message : "Account linking failed. Please check society code.";
      Toast.show({
        type: "error",
        text1: "Linking Error",
        text2: msg,
      });
    } finally {
      setIsLinkingLoading(false);
    }
  }, [societyCode, clerkUser, setUserSession, setRequiresSocietyCode, router]);

  return {
    societyCode,
    setSocietyCode,
    showSocietyCodeScreen,
    isGoogleLoading,
    isLinkingLoading,
    handleGoogleSignIn,
    handleLinkAccount,
  };
}

