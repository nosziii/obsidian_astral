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

export const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  name: z.string().min(3).max(32),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(3).max(32),
  bio: z.string().min(10).max(240),
  fleet: z.string().min(3).max(48),
});

export const equipmentUpdateSchema = z.object({
  resourceKey: z.string().min(1).nullable(),
});

export const adminGrantPackSchema = z.object({
  playerId: z.string().min(1),
});

export const chatMessageCreateSchema = z.object({
  channel: z.enum(["global", "workshop"]),
  content: z.string().trim().min(1).max(280),
});

export const adminPlayerUpdateSchema = z
  .object({
    level: z.number().int().min(1).max(100).optional(),
    energy: z.number().int().min(0).max(1000).optional(),
    energyMax: z.number().int().min(1).max(1000).optional(),
    credits: z.number().int().min(0).max(1_000_000).optional(),
    astralite: z.number().int().min(0).max(1_000_000).optional(),
  })
  .refine((value) => Object.values(value).some((entry) => entry !== undefined), {
    message: "Legalább egy mezőt meg kell adni.",
  });

export const adminCancelActivitySchema = z.object({
  activityId: z.string().min(1),
});
