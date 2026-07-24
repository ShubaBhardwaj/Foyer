import { z } from "zod";

const towerConfigSchema = z
  .object({
    count: z
      .number()
      .int("Count must be an integer.")
      .min(1, "Count must be at least 1.")
      .max(50, "Maximum 50 towers per configuration block."),

    floors: z
      .number()
      .int("Floors must be an integer.")
      .min(1, "Floors must be at least 1.")
      .max(200, "Maximum 200 floors allowed."),

    flatsPerFloor: z
      .number()
      .int("Flats per floor must be an integer.")
      .min(1, "Flats per floor must be at least 1.")
      .max(50, "Maximum 50 flats per floor allowed."),
  })
  .strict();

export const createStructureSchema = z
  .object({
    towers: z
      .array(towerConfigSchema)
      .min(1, "At least one tower configuration block is required."),
  })
  .strict();

export const expandStructureSchema = z
  .object({
    towers: z
      .array(towerConfigSchema)
      .min(1, "At least one tower configuration block is required."),
  })
  .strict();

const towerUpdateSchema = z
  .object({
    towerId: z.string().min(1, "Tower ID is required."),
    floors: z
      .number()
      .int("Floors must be an integer.")
      .min(1, "Floors must be at least 1.")
      .max(200, "Maximum 200 floors allowed."),
    flatsPerFloor: z
      .number()
      .int("Flats per floor must be an integer.")
      .min(1, "Flats per floor must be at least 1.")
      .max(50, "Maximum 50 flats per floor allowed."),
  })
  .strict();

export const updateStructureSchema = z
  .object({
    towers: z
      .array(towerUpdateSchema)
      .min(1, "At least one tower update block is required."),
  })
  .strict();

export type CreateStructureInput = z.infer<typeof createStructureSchema>;
export type ExpandStructureInput = z.infer<typeof expandStructureSchema>;
export type UpdateStructureInput = z.infer<typeof updateStructureSchema>;
