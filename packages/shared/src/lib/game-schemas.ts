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
