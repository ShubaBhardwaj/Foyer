import { useState, useCallback } from "react";
import { vehiclesData } from "../../shared/data/profileDummyData";
import { Vehicle } from "../../shared/types/profile.types";

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(vehiclesData);
  const [isLoading, setIsLoading] = useState(false);

  const handleRemoveVehicle = useCallback((vehicleId: string) => {
    // TODO: Call DELETE /api/v1/vehicles/:id API endpoint
    setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
  }, []);

  return {
    vehicles,
    rawCount: vehicles.length,
    isLoading,
    setIsLoading,
    handleRemoveVehicle,
  };
}
