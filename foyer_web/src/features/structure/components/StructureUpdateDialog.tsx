"use client";

import { useState, useEffect } from "react";
import { Tower } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { structureApi } from "@/services/api/structure.api";
import { queryKeys } from "@/constants/queryKeys";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { AlertTriangle, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

interface StructureUpdateDialogProps {
  tower: Tower | null;
  isOpen: boolean;
  onClose: () => void;
}

export function StructureUpdateDialog({
  tower,
  isOpen,
  onClose,
}: StructureUpdateDialogProps) {
  const queryClient = useQueryClient();

  const [floors, setFloors] = useState<number>(1);
  const [flatsPerFloor, setFlatsPerFloor] = useState<number>(1);
  const [lockError, setLockError] = useState<string | null>(null);

  useEffect(() => {
    if (tower) {
      setFloors(tower.floors);
      setFlatsPerFloor(tower.flatsPerFloor);
      setLockError(null);
    }
  }, [tower]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!tower) return;
      return structureApi.update({
        towers: [
          {
            towerId: tower._id,
            floors,
            flatsPerFloor,
          },
        ],
      });
    },
    onSuccess: (res) => {
      toast.success(res?.message || `Tower ${tower?.name} structure updated!`);
      queryClient.invalidateQueries({ queryKey: queryKeys.society.structure });
      onClose();
    },
    onError: (err: any) => {
      if (err?.response?.status === 409) {
        setLockError(
          err.response.data?.message ||
            `Tower ${tower?.name} structure is locked because one or more flats are occupied.`
        );
      }
    },
  });

  if (!tower) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Update Tower {tower.name}
          </DialogTitle>
          <DialogDescription>
            Modify total floors or flats per floor for this tower.
          </DialogDescription>
        </DialogHeader>

        {lockError ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 space-y-3">
            <div className="flex items-center gap-2 text-red-400 font-semibold text-sm">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              409 Structure Lock Conflict
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{lockError}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLockError(null)}
              className="w-full text-xs border-red-500/30 text-red-300 hover:bg-red-500/20"
            >
              Acknowledge & Dismiss
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="floors">Floors</Label>
              <Input
                id="floors"
                type="number"
                min={1}
                max={200}
                value={floors}
                onChange={(e) => setFloors(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="flatsPerFloor">Flats per Floor</Label>
              <Input
                id="flatsPerFloor"
                type="number"
                min={1}
                max={50}
                value={flatsPerFloor}
                onChange={(e) => setFlatsPerFloor(Number(e.target.value))}
              />
            </div>
          </div>
        )}

        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {!lockError && (
            <Button
              onClick={() => updateMutation.mutate()}
              disabled={updateMutation.isPending}
              className="gap-2"
            >
              {updateMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Save className="h-4 w-4" /> Save Tower Changes
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
