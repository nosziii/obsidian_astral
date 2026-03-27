import { z } from "zod";

export const gatherActionSchema = z.object({
  actionKey: z.string().min(1),
});

export const craftActionSchema = z.object({
  recipeKey: z.string().min(1),
});

export const expeditionStartSchema = z.object({
  expeditionKey: z.string().min(1),
});

export const expeditionClaimSchema = z.object({
  expeditionId: z.string().min(1),
});

export const upgradeBuildingSchema = z.object({
  buildingKey: z.string().min(1),
});
