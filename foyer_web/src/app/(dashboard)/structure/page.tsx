"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { structureApi } from "@/services/api/structure.api";
import { queryKeys } from "@/constants/queryKeys";
import { RoleGuard } from "@/components/guards/RoleGuard";
import { StructureGeneratorForm } from "@/features/structure/components/StructureGeneratorForm";
import { StructureTreeView } from "@/features/structure/components/StructureTreeView";
import { StructureUpdateDialog } from "@/features/structure/components/StructureUpdateDialog";
import { Tower } from "@/types";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/Dialog";
import { Layers, Plus, RefreshCw } from "lucide-react";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorState } from "@/components/shared/ErrorState";

export default function StructurePage() {
  const [isExpandOpen, setIsExpandOpen] = useState(false);
  const [editingTower, setEditingTower] = useState<Tower | null>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.society.structure,
    queryFn: async () => {
      const res = await structureApi.get();
      return res.data;
    },
  });

  const towers = data?.towers || data?.structure || [];
  const flats = data?.flats || towers.flatMap((t: any) => t.flats || []) || [];

  return (
    <RoleGuard allowedRoles={["owner", "super_admin", "admin"]}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <Layers className="h-6 w-6 text-purple-400" /> Society Structure Management
            </h1>
            <p className="text-xs text-slate-400">
              Interactive tower, floor, and flat hierarchy tree
            </p>
          </div>

          {towers.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="gap-2 border-slate-700 bg-slate-950 text-xs"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Refresh
              </Button>
              <Button
                size="sm"
                onClick={() => setIsExpandOpen(true)}
                className="gap-2 shadow-lg shadow-purple-900/30 text-xs"
              >
                <Plus className="h-4 w-4" /> Expand Structure
              </Button>
            </div>
          )}
        </div>

        {isLoading ? (
          <LoadingSpinner label="Fetching society towers and flats..." />
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : towers.length === 0 ? (
          <StructureGeneratorForm />
        ) : (
          <StructureTreeView
            towers={towers}
            flats={flats}
            onEditTower={(tower) => setEditingTower(tower)}
          />
        )}

        {/* Expand Structure Modal */}
        <Dialog open={isExpandOpen} onOpenChange={setIsExpandOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Expand Society Structure</DialogTitle>
              <DialogDescription>
                Add new tower blocks to your existing society structure layout.
              </DialogDescription>
            </DialogHeader>
            <StructureGeneratorForm
              isExpandMode
              onSuccess={() => setIsExpandOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Update Tower Dialog with 409 Lock handling */}
        <StructureUpdateDialog
          tower={editingTower}
          isOpen={!!editingTower}
          onClose={() => setEditingTower(null)}
        />
      </div>
    </RoleGuard>
  );
}
