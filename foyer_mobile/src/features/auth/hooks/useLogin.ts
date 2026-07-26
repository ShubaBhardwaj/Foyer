import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import Toast from "react-native-toast-message";
import { societyRepository } from "@/repositories/society.repository";
import { authRepository } from "@/repositories/auth.repository";
import { useAuthStore } from "@/store/use-auth-store";
import { queryKeys } from "@/lib/query-keys";
import { getClerkModule } from "@/lib/clerk";
import { ValidateSocietyCodeResponseDto } from "@/types/api/auth";

// Warm up web browser for OAuth redirects on Android/iOS
WebBrowser.maybeCompleteAuthSession();

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUserSession = useAuthStore((s) => s.setUserSession);

  const clerk = getClerkModule();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const oauth = clerk?.useOAuth ? clerk.useOAuth({ strategy: "oauth_google" }) : null;

  const [societyCode, setSocietyCodeState] = useState("");
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  const [validatedSociety, setValidatedSociety] = useState<ValidateSocietyCodeResponseDto | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleValidateCode = useCallback(async (codeToValidate?: string) => {
    const code = (codeToValidate || societyCode).trim();
    if (!code || code.length < 6) {
      Toast.show({
        type: "error",
        text1: "Invalid Code",
        text2: "Please enter a valid 6-character society code.",
      });
      return;
    }

    setIsValidatingCode(true);
    try {
      const result = await societyRepository.validateCode({ code });
      if (result.valid) {
        setValidatedSociety(result);
        Toast.show({
          type: "success",
          text1: "Society Verified",
          text2: `Joining ${result.societyName || "Society"}`,
        });
      } else {
        setValidatedSociety(null);
        Toast.show({
          type: "error",
          text1: "Invalid Society Code",
          text2: result.message || "Please check your 6-character code and try again.",
        });
      }
    } catch (err: unknown) {
      setValidatedSociety(null);
      const msg = err instanceof Error ? err.message : "Validation failed. Please check network connection.";
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: msg,
      });
    } finally {
      setIsValidatingCode(false);
    }
  }, [societyCode]);

  const setSocietyCode = useCallback((code: string) => {
    setSocietyCodeState(code);
    if (validatedSociety) {
      setValidatedSociety(null);
    }
    if (code.trim().length === 6) {
      handleValidateCode(code);
    }
  }, [validatedSociety, handleValidateCode]);

  const handleGoogleSignIn = useCallback(async () => {
    if (!validatedSociety || !validatedSociety.valid) {
      Toast.show({
        type: "error",
        text1: "Validation Required",
        text2: "Please enter and validate a valid 6-character society code first.",
      });
      return;
    }

    setIsGoogleLoading(true);
    try {
      let clerkUserId: string | null = null;

      // 1. Open Clerk Google OAuth browser window if available
      if (oauth && oauth.startOAuthFlow) {
        try {
          const { createdSessionId, setActive } = await oauth.startOAuthFlow();
          if (createdSessionId && setActive) {
            await setActive({ session: createdSessionId });
            clerkUserId = createdSessionId;
          }
        } catch (oauthErr) {
          console.warn("[handleGoogleSignIn] Clerk OAuth browser flow log:", oauthErr);
        }
      }

      // 2. Perform backend completion & synchronization
      const res = await authRepository.completeLogin({
        uniqueId: societyCode,
        societyCode: societyCode,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mongoUser = (res as any)?.user || (res as any)?.data?.user;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const societyObj = (res as any)?.society || (res as any)?.data?.society;

      if (!mongoUser) {
        throw new Error("Backend authentication failed. User object missing.");
      }

      // 3. Update Zustand Store with Backend truth
      setUserSession(mongoUser, societyObj, {
        id: clerkUserId || mongoUser.clerkId || "user_id",
        email: mongoUser.email,
        fullName: mongoUser.name,
      });

      // 4. Prefetch essential cache data for instant dashboard load
      queryClient.prefetchQuery({
        queryKey: queryKeys.auth.me(),
        queryFn: () => authRepository.getMe(),
      }).catch(() => {});

      Toast.show({
        type: "success",
        text1: "Welcome to Foyer",
        text2: `Signed in as ${mongoUser.name}`,
      });

      // 5. Navigate to app dashboard
      router.replace("/(app)/(tabs)/(home)");
    } catch (err: unknown) {
      console.error("[handleGoogleSignIn] Sign In Error:", err);
      const msg = err instanceof Error ? err.message : "Authentication failed. Please try again.";
      Toast.show({
        type: "error",
        text1: "Sign In Error",
        text2: msg.includes("invitation")
          ? "This Google account is not associated with your invitation. Please sign in using the invited Google account."
          : msg,
      });
    } finally {
      setIsGoogleLoading(false);
    }
  }, [oauth, validatedSociety, societyCode, setUserSession, queryClient, router]);

  return {
    societyCode,
    setSocietyCode,
    isValidatingCode,
    validatedSociety,
    isGoogleLoading,
    handleValidateCode,
    handleGoogleSignIn,
  };
}
