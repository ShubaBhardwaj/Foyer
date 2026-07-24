"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/services/api/users.api";
import { structureApi } from "@/services/api/structure.api";
import { queryKeys } from "@/constants/queryKeys";
import { Role, Tower, Flat, User } from "@/types";
import {
  createUserSchema,
  CreateUserFormValues,
} from "../validators/user.validator";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { UserPlus, KeyRound, Home, CheckCircle2, Copy, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface CreateUserFormProps {
  targetRole: Role;
  title: string;
  description: string;
  isResidenceMandatory?: boolean;
}

export function CreateUserForm({
  targetRole,
  title,
  description,
  isResidenceMandatory = false,
}: CreateUserFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [livesInSociety, setLivesInSociety] = useState(isResidenceMandatory);
  const [createdUser, setCreatedUser] = useState<User | null>(null);

  // Fetch society structure for Tower -> Flat selection
  const { data: structureData } = useQuery({
    queryKey: queryKeys.society.structure,
    queryFn: async () => {
      const res = await structureApi.get();
      return res.data;
    },
    enabled: livesInSociety || isResidenceMandatory,
  });

  const towers = structureData?.towers || [];
  const flats = structureData?.flats || [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      tower: "",
      flat: "",
    },
  });

  const selectedTowerId = watch("tower");

  // Filter vacant flats for selected tower
  const availableFlats = flats.filter(
    (f) =>
      (typeof f.tower === "string" ? f.tower : (f.tower as any)?._id) === selectedTowerId &&
      !f.occupied
  );

  const mutation = useMutation({
    mutationFn: (data: CreateUserFormValues) => {
      switch (targetRole) {
        case "super_admin":
          return usersApi.createSuperAdmin(data);
        case "admin":
          return usersApi.createAdmin(data);
        case "resident":
          return usersApi.createResident(data as any);
        case "guard":
          return usersApi.createGuard(data);
        default:
          throw new Error("Invalid role selection");
      }
    },
    onSuccess: (res) => {
      toast.success(res.message || `${title} created successfully!`);
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.society.structure });
      if (res.data.user) {
        setCreatedUser(res.data.user);
      }
    },
  });

  const onSubmit = (data: CreateUserFormValues) => {
    if (livesInSociety && (!data.tower || !data.flat)) {
      toast.error("Both Tower and Flat selection are required when residence allocation is enabled.");
      return;
    }
    mutation.mutate(data);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Unique ID copied to clipboard!");
  };

  if (createdUser) {
    return (
      <Card className="mx-auto max-w-lg border-emerald-500/30 bg-slate-900/90 shadow-2xl p-6 text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-100">{createdUser.name} Created Successfully!</h3>
        <p className="text-xs text-slate-400">
          Provide this 6-character Unique ID to the user for account linking during their 1st Google sign-in.
        </p>

        <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-4 space-y-2">
          <span className="text-[10px] uppercase font-semibold tracking-wider text-purple-400">
            6-Character Unique ID
          </span>
          <div className="flex items-center justify-center gap-3">
            <span className="font-mono text-3xl font-extrabold tracking-widest text-purple-300">
              {createdUser.uniqueId}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => copyToClipboard(createdUser.uniqueId)}
              className="h-9 w-9 border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-center gap-3">
          <Button variant="outline" onClick={() => setCreatedUser(null)}>
            Create Another User
          </Button>
          <Link href="/users">
            <Button className="gap-2">
              View All Users <ArrowLeft className="h-4 w-4 rotate-180" />
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-xl border-slate-800 bg-slate-900/90 shadow-2xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
            <UserPlus className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="e.g. John Doe" {...register("name")} />
            {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="e.g. john.doe@example.com"
              {...register("email")}
            />
            {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              placeholder="e.g. +91 9876543210"
              {...register("phone")}
            />
            {errors.phone && <p className="text-xs text-red-400">{errors.phone.message}</p>}
          </div>

          {/* Optional Residence Allocation Toggle (For Admin / Guard) */}
          {!isResidenceMandatory && (
            <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-3">
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-purple-400" />
                <div>
                  <p className="text-xs font-semibold text-slate-200">Lives in Society?</p>
                  <p className="text-[10px] text-slate-400">
                    Allocating a flat automatically assigns the <span className="font-semibold text-emerald-400">Resident</span> role as well.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={livesInSociety}
                onChange={(e) => setLivesInSociety(e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-purple-600 focus:ring-purple-500"
              />
            </div>
          )}

          {/* Tower & Flat Selection */}
          {(livesInSociety || isResidenceMandatory) && (
            <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-950 p-4 animate-in fade-in-50">
              <span className="text-xs font-semibold text-purple-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                <Home className="h-4 w-4" /> Residence Allocation
              </span>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Select Tower</Label>
                  <Select
                    onValueChange={(val) => {
                      setValue("tower", val);
                      setValue("flat", "");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose Tower" />
                    </SelectTrigger>
                    <SelectContent>
                      {towers.map((t) => (
                        <SelectItem key={t._id} value={t._id}>
                          Tower {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Select Flat</Label>
                  <Select
                    disabled={!selectedTowerId || availableFlats.length === 0}
                    onValueChange={(val) => setValue("flat", val)}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          !selectedTowerId
                            ? "Select Tower First"
                            : availableFlats.length === 0
                            ? "No Vacant Flats"
                            : "Choose Flat"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFlats.map((f) => (
                        <SelectItem key={f._id} value={f._id}>
                          Flat {f.flatNumber} (Floor {f.floor})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between border-t border-slate-800/60 pt-4">
          <Link href="/users">
            <Button variant="outline">Cancel</Button>
          </Link>

          <Button
            type="submit"
            disabled={mutation.isPending}
            className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg shadow-purple-900/30"
          >
            {mutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <KeyRound className="h-4 w-4" /> Create & Generate Unique ID
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
