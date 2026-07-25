import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { profileRepository } from "@/repositories/profile.repository";
import { AddVehicleRequestDto } from "@/types/api/profile";
import { Vehicle } from "../../shared/types/profile.types";

export function useVehicles() {
  const queryClient = useQueryClient();

  const {
    data: rawVehicles,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: queryKeys.profile.vehicles(),
    queryFn: () => profileRepository.fetchVehicles(),
  });

  const vehicles = useMemo<Vehicle[]>(() => {
    const list = rawVehicles || [];
    return list.map((v) => ({
      id: v._id,
      vehicleNumber: v.vehicleNumber,
      type: v.type === "BIKE" || v.type === "SCOOTER" ? "Bike" : "Car",
      parkingSlot: v.parkingSlot || "Slot 101",
      status: "Verified" as const,
    }));
  }, [rawVehicles]);

  const addVehicleMutation = useMutation({
    mutationFn: (dto: AddVehicleRequestDto) => profileRepository.createVehicle(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.vehicles() });
    },
  });

  const removeVehicleMutation = useMutation({
    mutationFn: (id: string) => profileRepository.deleteVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.vehicles() });
    },
  });

  return {
    vehicles,
    isLoading,
    isRefetching,
    refetch,
    addVehicle: (dto: AddVehicleRequestDto) => addVehicleMutation.mutateAsync(dto),
    removeVehicle: (id: string) => removeVehicleMutation.mutateAsync(id),
    handleRemoveVehicle: (id: string) => removeVehicleMutation.mutateAsync(id),
    isAdding: addVehicleMutation.isPending,
  };
}
