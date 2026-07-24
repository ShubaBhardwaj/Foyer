"use client";

import { useAuth, useClerk } from "@clerk/nextjs";
import { RegisterSocietyForm } from "@/features/society/components/RegisterSocietyForm";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Building2, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function RegisterSocietyPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const clerk = useClerk();

  const handleGoogleSignUp = async () => {
    if (!isLoaded || !clerk) return;
    try {
      if (typeof (clerk as any).authenticateWithRedirect === "function") {
        await (clerk as any).authenticateWithRedirect({
          strategy: "oauth_google",
          redirectUrl: "/sso-callback",
          redirectUrlComplete: "/society/register",
        });
      } else if (typeof (clerk as any).redirectToSignIn === "function") {
        await (clerk as any).redirectToSignIn({
          signInForceRedirectUrl: "/society/register",
        });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to initialize Google Sign-in.");
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen w-screen items-center justify-center bg-slate-950 text-slate-100">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          <p className="text-sm font-medium text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-2xl space-y-4">
        {/* Back to Login Link */}
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Sign In
        </Link>

        {!isSignedIn ? (
          /* Step 1: Sign in with Google first */
          <Card className="border-slate-800 bg-slate-900/90 shadow-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/40">
                <Building2 className="h-7 w-7" />
              </div>
              <CardTitle className="text-xl text-slate-100">
                Register a New Society
              </CardTitle>
              <CardDescription className="text-slate-400">
                Sign in with your Google account to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pb-8">
              <p className="text-center text-xs text-slate-500">
                You&apos;ll use this Google account as the <strong className="text-slate-300">Owner</strong> of your new society.
                This account will have full administrative privileges.
              </p>
              <Button
                onClick={handleGoogleSignUp}
                variant="outline"
                className="w-full h-11 justify-center gap-3 border-slate-700 bg-slate-950 text-slate-100 hover:bg-slate-800"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Continue with Google
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Step 2: Fill society registration form */
          <RegisterSocietyForm />
        )}
      </div>
    </div>
  );
}
