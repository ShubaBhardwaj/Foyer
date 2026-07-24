"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { societyApi } from "@/services/api/society.api";
import { queryKeys } from "@/constants/queryKeys";
import {
  registerSocietySchema,
  RegisterSocietyFormValues,
} from "../validators/society.validator";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { Building2, User, CheckCircle2, ArrowRight, ArrowLeft, Loader2, MapPin } from "lucide-react";
import { toast } from "sonner";

export function RegisterSocietyForm() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<RegisterSocietyFormValues>({
    resolver: zodResolver(registerSocietySchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      ownerName: "",
      ownerPhone: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterSocietyFormValues) => societyApi.register(data),
    onSuccess: (res) => {
      toast.success(res.message || "Society successfully registered!");
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.society.all });
      router.push("/dashboard");
    },
  });

  const handleNextStep = async () => {
    if (step === 1) {
      const isValid = await trigger(["ownerName", "ownerPhone"]);
      if (isValid) setStep(2);
    } else if (step === 2) {
      const isValid = await trigger(["name", "address", "city", "state", "pincode"]);
      if (isValid) setStep(3);
    }
  };

  const onSubmit = (data: RegisterSocietyFormValues) => {
    registerMutation.mutate(data);
  };

  const values = getValues();

  return (
    <Card className="mx-auto max-w-2xl border-slate-800 bg-slate-900/90 shadow-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl">Register New Society</CardTitle>
              <CardDescription>Onboard your society to Foyer</CardDescription>
            </div>
          </div>
          <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
            Step {step} of 3
          </span>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className={`h-1.5 rounded-full transition-all ${step >= 1 ? "bg-purple-500" : "bg-slate-800"}`} />
          <div className={`h-1.5 rounded-full transition-all ${step >= 2 ? "bg-purple-500" : "bg-slate-800"}`} />
          <div className={`h-1.5 rounded-full transition-all ${step >= 3 ? "bg-purple-500" : "bg-slate-800"}`} />
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4 pt-2">
          {/* Step 1: Owner Information */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in-50">
              <div className="flex items-center gap-2 text-sm font-semibold text-purple-400 pb-2 border-b border-slate-800">
                <User className="h-4 w-4" /> Step 1: Owner Information
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownerName">Owner Full Name</Label>
                <Input
                  id="ownerName"
                  placeholder="e.g. Alexander Pierce"
                  {...register("ownerName")}
                />
                {errors.ownerName && (
                  <p className="text-xs text-red-400">{errors.ownerName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownerPhone">Owner Phone Number</Label>
                <Input
                  id="ownerPhone"
                  placeholder="e.g. +91 9876543210"
                  {...register("ownerPhone")}
                />
                {errors.ownerPhone && (
                  <p className="text-xs text-red-400">{errors.ownerPhone.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Society Information */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in-50">
              <div className="flex items-center gap-2 text-sm font-semibold text-purple-400 pb-2 border-b border-slate-800">
                <MapPin className="h-4 w-4" /> Step 2: Society Information
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Society Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Royal Palms Heights"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-red-400">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address Line</Label>
                <Input
                  id="address"
                  placeholder="e.g. Plot 42, Sector 18, Palm Beach Road"
                  {...register("address")}
                />
                {errors.address && (
                  <p className="text-xs text-red-400">{errors.address.message}</p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="e.g. Mumbai" {...register("city")} />
                  {errors.city && <p className="text-xs text-red-400">{errors.city.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" placeholder="e.g. Maharashtra" {...register("state")} />
                  {errors.state && <p className="text-xs text-red-400">{errors.state.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input id="pincode" placeholder="400706" {...register("pincode")} maxLength={6} />
                  {errors.pincode && <p className="text-xs text-red-400">{errors.pincode.message}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation Preview */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in-50">
              <div className="flex items-center gap-2 text-sm font-semibold text-purple-400 pb-2 border-b border-slate-800">
                <CheckCircle2 className="h-4 w-4" /> Step 3: Preview & Confirmation
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 uppercase tracking-wider text-[10px]">Society Name</span>
                    <p className="font-semibold text-slate-100 text-sm mt-0.5">{values.name}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 uppercase tracking-wider text-[10px]">Owner Name</span>
                    <p className="font-semibold text-slate-100 text-sm mt-0.5">{values.ownerName}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 uppercase tracking-wider text-[10px]">Owner Phone</span>
                    <p className="font-semibold text-slate-200 mt-0.5">{values.ownerPhone}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 uppercase tracking-wider text-[10px]">Pincode</span>
                    <p className="font-mono text-purple-400 font-medium mt-0.5">{values.pincode}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 text-xs">
                  <span className="text-slate-500 uppercase tracking-wider text-[10px]">Address</span>
                  <p className="text-slate-300 mt-0.5">{values.address}, {values.city}, {values.state}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t border-slate-800/60 pt-4">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep((s) => (s - 1) as any)}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <Button type="button" onClick={handleNextStep} className="gap-2">
              Next Step <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={registerMutation.isPending}
              className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg shadow-purple-900/30"
            >
              {registerMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Confirm & Register <CheckCircle2 className="h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
