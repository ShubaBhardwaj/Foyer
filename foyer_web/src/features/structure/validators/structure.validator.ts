import { z } from "zod";

const towerConfigSchema = z.object({
  count: z.number().int().min(1, "Count must be at least 1.").max(50, "Max 50 towers per block."),
  floors: z.number().int().min(1, "Floors must be at least 1.").max(200, "Max 200 floors."),
  flatsPerFloor: z.number().int().min(1, "Flats per floor must be at least 1.").max(50, "Max 50 flats."),
});

export const createStructureSchema = z.object({
  towers: z.array(towerConfigSchema).min(1, "At least one configuration block is required."),
});

export const updateStructureSchema = z.object({
  towers: z.array(
    z.object({
      towerId: z.string().min(1, "Tower ID is required."),
      floors: z.number().int().min(1).max(200),
      flatsPerFloor: z.number().int().min(1).max(50),
    })
  ).min(1, "At least one tower update block is required."),
});

export type CreateStructureFormValues = z.infer<typeof createStructureSchema>;
export type UpdateStructureFormValues = z.infer<typeof updateStructureSchema>;
