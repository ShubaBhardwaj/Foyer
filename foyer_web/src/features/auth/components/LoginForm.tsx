"use client";

import { useState, useEffect } from "react";
import { useClerk, useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/services/api/auth.api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { Building2, ShieldCheck, KeyRound, ArrowRight, Loader2, UserPlus, LogIn } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export function LoginForm() {
  const clerk = useClerk();
  const { isLoaded: isClerkLoaded, isSignedIn } = useAuth();
  const { user: clerkUser } = useUser();
  const router = useRouter();

  const [societyCode, setSocietyCode] = useState("");
  const [requiresSocietyCode, setRequiresSocietyCode] = useState(false);

  const completeLoginMutation = useMutation({
    mutationFn: async () => {
      const res = await authApi.completeLogin({
        clerkId: clerkUser?.id,
        email: clerkUser?.primaryEmailAddress?.emailAddress,
        firstName: clerkUser?.firstName || undefined,
        lastName: clerkUser?.lastName || undefined,
        imageUrl: clerkUser?.imageUrl,
      });
      return res.data;
    },
    onSuccess: (data) => {
      if (data.requiresSocietyCode) {
        setRequiresSocietyCode(true);
        toast.info("Please enter your Society Code to complete account linking.");
        return;
      }

      toast.success("Account successfully authenticated!");
      if (data.society) {
        router.push("/dashboard");
      } else {
        router.push("/society/register");
      }
    },
    onError: (err: any) => {
      console.error("[Login] Complete Login error:", err);
      toast.error(err?.response?.data?.message || "Authentication failed.");
    },
  });

  const linkAccountMutation = useMutation({
    mutationFn: async () => {
      const res = await authApi.linkAccount({
        clerkId: clerkUser?.id,
        societyCode: societyCode.trim(),
      });

      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Account linked successfully!");
      if (data.society) {
        router.push("/dashboard");
      } else {
        router.push("/society/register");
      }
    },
    onError: (err: any) => {
      console.error("[Login] Link Account error:", err);
      toast.error(err?.response?.data?.message || "Failed to link account. Check your society code.");
    },
  });

  useEffect(() => {
    if (isClerkLoaded && isSignedIn && !requiresSocietyCode && !completeLoginMutation.isPending && !completeLoginMutation.isSuccess) {
      completeLoginMutation.mutate();
    }
  }, [isClerkLoaded, isSignedIn]);

  const handleGoogleLogin = async () => {
    if (!isClerkLoaded || !clerk) return;
    try {
      if (typeof (clerk as any).authenticateWithRedirect === "function") {
        await (clerk as any).authenticateWithRedirect({
          strategy: "oauth_google",
          redirectUrl: "/sso-callback",
          redirectUrlComplete: "/login",
        });
      } else if (typeof (clerk as any).redirectToSignIn === "function") {
        await (clerk as any).redirectToSignIn({
          signInForceRedirectUrl: "/login",
        });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to initialize Google Sign-in.");
    }
  };

  const handleLinkAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    linkAccountMutation.mutate();
  };

  return (
    <Card className="w-full max-w-md border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-xl">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/40">
          <Building2 className="h-7 w-7" />
        </div>
        <CardTitle className="text-2xl font-bold text-slate-100">
          Sign In to Foyer
        </CardTitle>
        <CardDescription className="text-slate-400">
          {requiresSocietyCode
            ? "Enter your Society Code to complete account linking"
            : "Enterprise Society Management Platform"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-4">
        {requiresSocietyCode ? (
          /* Enter Society Code Form */
          <form onSubmit={handleLinkAccountSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="societyCode" className="flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-purple-400" />
                Society Code
              </Label>
              <Input
                id="societyCode"
                placeholder="e.g. RgvKtk"
                value={societyCode}
                onChange={(e) => setSocietyCode(e.target.value)}
                required
                className="font-mono text-center text-lg tracking-widest py-3"
              />
              <p className="text-[11px] text-slate-500">
                Enter the invitation code provided by your society management.
              </p>
            </div>

            <Button
              type="submit"
              disabled={linkAccountMutation.isPending || !societyCode.trim()}
              className="w-full gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg shadow-purple-900/30"
            >
              {linkAccountMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Continue <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        ) : (
          /* Single Authentication Button: Continue with Google */
          <div className="space-y-4">
            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              disabled={completeLoginMutation.isPending}
              className="w-full h-12 justify-center gap-3 border-slate-700 bg-slate-950 text-slate-100 hover:bg-slate-800"
            >
              {completeLoginMutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin text-purple-400" />
              ) : (
                <>
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  Continue with Google
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-3 border-t border-slate-800/80 pt-4 text-center">
        <p className="text-xs text-slate-400">
          New Society Owner?{" "}
          <Link
            href="/society/register"
            className="font-semibold text-purple-400 hover:underline inline-flex items-center gap-1"
          >
            Register a New Society <UserPlus className="h-3 w-3" />
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

