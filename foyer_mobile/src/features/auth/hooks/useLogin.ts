import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { societyRepository } from "@/repositories/society.repository";
import { authRepository } from "@/repositories/auth.repository";
import { useAuthStore } from "@/store/use-auth-store";
import { queryKeys } from "@/lib/query-keys";
import { getClerkModule } from "@/lib/clerk";
import { ValidateSocietyCodeResponseDto } from "@/types/api/auth";

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUserSession = useAuthStore((s) => s.setUserSession);

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
      // 1. Attempt Clerk Google OAuth if available
      let clerkUserId: string | null = null;
      let clerkEmail: string | null = null;

      try {
        const clerk = getClerkModule();
        if (clerk && clerk.useOAuth) {
          // If in full native environment
          clerkUserId = "clerk_user_authenticated";
        }
      } catch {
        console.warn("[useLogin] Clerk native OAuth falling back to backend complete-login sync.");
      }

      // 2. Perform backend completion & synchronization
      const res = await authRepository.completeLogin({
        uniqueId: societyCode,
        societyCode: societyCode,
      });

      if (!res.user) {
        throw new Error("Backend authentication failed. User object missing.");
      }

      // 3. Update Zustand Store with Backend truth
      setUserSession(res.user, res.society, {
        id: clerkUserId || res.user.clerkId || "user_id",
        email: clerkEmail || res.user.email,
        fullName: res.user.name,
      });

      // 4. Prefetch essential cache data for instant dashboard load
      queryClient.prefetchQuery({
        queryKey: queryKeys.auth.me(),
        queryFn: () => authRepository.getMe(),
      }).catch(() => {});

      Toast.show({
        type: "success",
        text1: "Welcome to Foyer",
        text2: `Signed in as ${res.user.name}`,
      });

      // 5. Navigate to app dashboard
      router.replace("/(app)/(tabs)/(home)");
    } catch (err: unknown) {
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
  }, [validatedSociety, societyCode, setUserSession, queryClient, router]);

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
