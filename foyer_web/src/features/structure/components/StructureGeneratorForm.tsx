"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { structureApi } from "@/services/api/structure.api";
import { queryKeys } from "@/constants/queryKeys";
import {
  createStructureSchema,
  CreateStructureFormValues,
} from "../validators/structure.validator";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { Plus, Trash2, Layers, Sparkles, Loader2, Building, Home, Check } from "lucide-react";
import { toast } from "sonner";

interface StructureGeneratorFormProps {
  isExpandMode?: boolean;
  onSuccess?: () => void;
}

export function StructureGeneratorForm({
  isExpandMode = false,
  onSuccess,
}: StructureGeneratorFormProps) {
  const queryClient = useQueryClient();

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateStructureFormValues>({
    resolver: zodResolver(createStructureSchema),
    defaultValues: {
      towers: [{ count: 2, floors: 10, flatsPerFloor: 4 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "towers",
  });

  const watchedTowers = watch("towers");

  // Calculate live preview metrics
  const totalTowers = watchedTowers.reduce((acc, curr) => acc + (Number(curr.count) || 0), 0);
  const totalFloors = watchedTowers.reduce(
    (acc, curr) => acc + (Number(curr.count) || 0) * (Number(curr.floors) || 0),
    0
  );
  const totalFlats = watchedTowers.reduce(
    (acc, curr) =>
      acc +
      (Number(curr.count) || 0) *
        (Number(curr.floors) || 0) *
        (Number(curr.flatsPerFloor) || 0),
    0
  );

  const mutation = useMutation({
    mutationFn: (data: CreateStructureFormValues) =>
      isExpandMode ? structureApi.expand(data) : structureApi.generate(data),
    onSuccess: (res) => {
      toast.success(res.message || "Structure operation completed successfully!");
      queryClient.invalidateQueries({ queryKey: queryKeys.society.structure });
      if (onSuccess) onSuccess();
    },
  });

  const onSubmit = (data: CreateStructureFormValues) => {
    mutation.mutate(data);
  };

  return (
    <Card className="border-slate-800 bg-slate-900/90 shadow-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl">
                {isExpandMode ? "Expand Society Structure" : "Generate Society Structure"}
              </CardTitle>
              <CardDescription>
                {isExpandMode
                  ? "Add additional tower groups to your existing society layout"
                  : "Define your tower groups, floors, and flats per floor"}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          {/* Live Preview Summary Bar */}
          <div className="grid grid-cols-3 gap-4 rounded-xl border border-purple-500/20 bg-purple-500/5 p-4 text-center">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-400 flex items-center justify-center gap-1">
                <Building className="h-3.5 w-3.5" /> Total Towers
              </span>
              <p className="text-2xl font-bold text-slate-100 mt-1">{totalTowers}</p>
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400 flex items-center justify-center gap-1">
                <Layers className="h-3.5 w-3.5" /> Cumulative Floors
              </span>
              <p className="text-2xl font-bold text-slate-100 mt-1">{totalFloors}</p>
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 flex items-center justify-center gap-1">
                <Home className="h-3.5 w-3.5" /> Total Flats
              </span>
              <p className="text-2xl font-bold text-slate-100 mt-1">{totalFlats}</p>
            </div>
          </div>

          {/* Tower Group Configuration Blocks */}
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="relative rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-4 transition-all hover:border-slate-700"
              >
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-xs font-semibold text-purple-400 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-purple-400" /> Tower Configuration Block #{index + 1}
                  </span>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="h-7 w-7 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`towers.${index}.count`}>Number of Towers</Label>
                    <Input
                      type="number"
                      min={1}
                      max={50}
                      {...register(`towers.${index}.count`, { valueAsNumber: true })}
                    />
                    {errors.towers?.[index]?.count && (
                      <p className="text-xs text-red-400">{errors.towers[index]?.count?.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`towers.${index}.floors`}>Floors per Tower</Label>
                    <Input
                      type="number"
                      min={1}
                      max={200}
                      {...register(`towers.${index}.floors`, { valueAsNumber: true })}
                    />
                    {errors.towers?.[index]?.floors && (
                      <p className="text-xs text-red-400">{errors.towers[index]?.floors?.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`towers.${index}.flatsPerFloor`}>Flats per Floor</Label>
                    <Input
                      type="number"
                      min={1}
                      max={50}
                      {...register(`towers.${index}.flatsPerFloor`, { valueAsNumber: true })}
                    />
                    {errors.towers?.[index]?.flatsPerFloor && (
                      <p className="text-xs text-red-400">
                        {errors.towers[index]?.flatsPerFloor?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => append({ count: 1, floors: 5, flatsPerFloor: 4 })}
            className="w-full border-dashed border-slate-700 text-slate-300 hover:bg-slate-800 gap-2"
          >
            <Plus className="h-4 w-4" /> Add Another Configuration Block
          </Button>
        </CardContent>

        <CardFooter className="border-t border-slate-800/60 pt-4 flex justify-end">
          <Button
            type="submit"
            disabled={mutation.isPending || totalFlats === 0}
            className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg shadow-purple-900/30"
          >
            {mutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Check className="h-4 w-4" />
                {isExpandMode ? "Confirm & Expand Structure" : "Generate Structure"}
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
