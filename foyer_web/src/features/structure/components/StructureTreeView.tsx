"use client";

import { useState, useMemo } from "react";
import { Tower, Flat } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { structureApi } from "@/services/api/structure.api";
import { queryKeys } from "@/constants/queryKeys";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/Dialog";
import {
  Building2,
  ChevronDown,
  ChevronRight,
  Search,
  Home,
  Layers,
  Trash2,
  Edit3,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface StructureTreeViewProps {
  towers: Tower[];
  flats: Flat[];
  onEditTower?: (tower: Tower) => void;
}

export function StructureTreeView({
  towers,
  flats,
  onEditTower,
}: StructureTreeViewProps) {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [occupancyFilter, setOccupancyFilter] = useState<"all" | "occupied" | "vacant">("all");
  const [deletingTower, setDeletingTower] = useState<Tower | null>(null);

  const [expandedTowers, setExpandedTowers] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    if (towers.length > 0) initial[towers[0]._id] = true;
    return initial;
  });

  const deleteTowerMutation = useMutation({
    mutationFn: (towerId: string) => structureApi.deleteTower(towerId),
    onSuccess: (res) => {
      toast.success(res.message || "Tower deleted successfully!");
      queryClient.invalidateQueries({ queryKey: queryKeys.society.structure });
      setDeletingTower(null);
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || "Failed to delete tower.";
      toast.error(msg);
    },
  });

  const toggleTower = (towerId: string) => {
    setExpandedTowers((prev) => ({ ...prev, [towerId]: !prev[towerId] }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    towers.forEach((t) => (allExpanded[t._id] = true));
    setExpandedTowers(allExpanded);
  };

  const collapseAll = () => {
    setExpandedTowers({});
  };

  // Group flats by tower and floor
  const towerMap = useMemo(() => {
    const map: Record<
      string,
      { tower: Tower; floors: Record<number, Flat[]> }
    > = {};

    towers.forEach((t) => {
      map[t._id] = { tower: t, floors: {} };
    });

    flats.forEach((f) => {
      const towerId = typeof f.tower === "string" ? f.tower : (f.tower as any)?._id;
      if (map[towerId]) {
        if (!map[towerId].floors[f.floor]) {
          map[towerId].floors[f.floor] = [];
        }
        map[towerId].floors[f.floor].push(f);
      }
    });

    return map;
  }, [towers, flats]);

  const filteredTowers = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    return towers.filter((tower) => {
      const towerData = towerMap[tower._id];
      if (!towerData) return false;

      const towerMatches = tower.name.toLowerCase().includes(term);

      let flatMatches = false;
      Object.values(towerData.floors).forEach((flatList) => {
        flatList.forEach((flat) => {
          if (flat.flatNumber.toLowerCase().includes(term)) flatMatches = true;
          if (occupancyFilter === "occupied" && !flat.occupied) return;
          if (occupancyFilter === "vacant" && flat.occupied) return;
        });
      });

      return (
        (towerMatches || flatMatches || !term) &&
        (occupancyFilter === "all" ||
          Object.values(towerData.floors).some((list) =>
            list.some((f) =>
              occupancyFilter === "occupied" ? f.occupied : !f.occupied
            )
          ))
      );
    });
  }, [towers, towerMap, searchTerm, occupancyFilter]);

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            placeholder="Search towers or flat numbers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Occupancy Filter buttons */}
          <div className="flex items-center rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs">
            <button
              onClick={() => setOccupancyFilter("all")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                occupancyFilter === "all" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setOccupancyFilter("occupied")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                occupancyFilter === "occupied" ? "bg-amber-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Occupied
            </button>
            <button
              onClick={() => setOccupancyFilter("vacant")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                occupancyFilter === "vacant" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Vacant
            </button>
          </div>

          <Button variant="outline" size="sm" onClick={expandAll} className="text-xs">
            Expand All
          </Button>
          <Button variant="outline" size="sm" onClick={collapseAll} className="text-xs">
            Collapse
          </Button>
        </div>
      </div>

      {/* Tree Hierarchy */}
      <div className="space-y-3">
        {filteredTowers.length > 0 ? (
          filteredTowers.map((tower) => {
            const isExpanded = !!expandedTowers[tower._id];
            const towerData = towerMap[tower._id];
            const floorNumbers = Object.keys(towerData?.floors || {})
              .map(Number)
              .sort((a, b) => b - a); // Top floor first

            const towerFlatsCount = Object.values(towerData?.floors || {}).reduce(
              (acc, list) => acc + list.length,
              0
            );
            const occupiedCount = Object.values(towerData?.floors || {}).reduce(
              (acc, list) => acc + list.filter((f) => f.occupied).length,
              0
            );

            // Server-defined Structure Lock Logic:
            // A tower CANNOT be edited or deleted if any flat is occupied.
            const isLocked = occupiedCount > 0;

            return (
              <div
                key={tower._id}
                className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80 backdrop-blur-sm transition-all"
              >
                {/* Tower Header */}
                <div
                  onClick={() => toggleTower(tower._id)}
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-800/60 transition-colors select-none"
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-purple-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-slate-500" />
                    )}
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 font-bold border border-purple-500/20">
                      {tower.name}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-100 flex items-center gap-2">
                        Tower {tower.name}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {tower.floors} Floors • {tower.flatsPerFloor} Flats/Floor • Total {towerFlatsCount} Flats
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800 mr-1">
                      {occupiedCount}/{towerFlatsCount} Occupied
                    </span>

                    {/* Edit Tower Button */}
                    {onEditTower && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditTower(tower)}
                        className="text-xs h-8 gap-1.5 border-slate-700 hover:bg-slate-800"
                      >
                        <Edit3 className="h-3.5 w-3.5 text-purple-400" /> Edit Tower
                      </Button>
                    )}

                    {/* Delete Tower Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isLocked}
                      title={
                        isLocked
                          ? "Cannot delete tower: Contains occupied flats. Vacate all flats before deleting."
                          : "Delete Tower"
                      }
                      onClick={() => setDeletingTower(tower)}
                      className={`text-xs h-8 gap-1.5 ${
                        isLocked
                          ? "opacity-40 cursor-not-allowed border-slate-800 bg-slate-950 text-slate-500"
                          : "border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/50"
                      }`}
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete Tower
                    </Button>
                  </div>
                </div>

                {/* Collapsible Floors & Flats Content */}
                {isExpanded && (
                  <div className="border-t border-slate-800/80 bg-slate-950/60 p-4 space-y-4">
                    {floorNumbers.length > 0 ? (
                      floorNumbers.map((floorNum) => {
                        const floorFlats = towerData.floors[floorNum] || [];
                        return (
                          <div key={floorNum} className="space-y-2">
                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                              <Layers className="h-3.5 w-3.5 text-indigo-400" />
                              Floor {floorNum}
                              <span className="text-[10px] text-slate-500 font-normal">
                                ({floorFlats.length} flats)
                              </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
                              {floorFlats.map((flat) => (
                                <div
                                  key={flat._id}
                                  className={`flex flex-col items-center justify-center rounded-lg border p-2.5 text-center transition-all ${
                                    flat.occupied
                                      ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
                                      : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                                  }`}
                                >
                                  <Home className="h-4 w-4 mb-1" />
                                  <span className="text-xs font-bold font-mono">
                                    {flat.flatNumber}
                                  </span>
                                  <span className="mt-1 text-[9px] uppercase tracking-wider font-semibold opacity-80">
                                    {flat.occupied ? "Occupied" : "Vacant"}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-slate-500 text-center py-2">
                        No flats generated for this tower.
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-8">
            <Building2 className="mx-auto h-10 w-10 text-slate-600 stroke-1" />
            <h3 className="mt-2 text-base font-semibold text-slate-200">
              No matching structure found
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Try adjusting your search criteria or filter.
            </p>
          </div>
        )}
      </div>

      {/* Delete Tower Confirmation Dialog */}
      <Dialog open={!!deletingTower} onOpenChange={() => setDeletingTower(null)}>
        <DialogContent className="max-w-md border-red-500/20 bg-slate-900">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg text-slate-100">
                  Delete Tower {deletingTower?.name}?
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-400">
                  This action is permanent and cannot be undone.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2 text-xs text-slate-300">
            <p>
              Deleting <strong className="text-white">Tower {deletingTower?.name}</strong> will remove:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li>
                <strong className="text-slate-200">{deletingTower?.floors}</strong> floors
              </li>
              <li>
                <strong className="text-slate-200">
                  {(deletingTower?.floors || 0) * (deletingTower?.flatsPerFloor || 0)}
                </strong> flat records in this tower
              </li>
            </ul>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeletingTower(null)}
              disabled={deleteTowerMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              disabled={deleteTowerMutation.isPending}
              onClick={() => deletingTower && deleteTowerMutation.mutate(deletingTower._id)}
              className="gap-2 bg-red-600 hover:bg-red-500"
            >
              {deleteTowerMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Trash2 className="h-4 w-4" /> Confirm Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
