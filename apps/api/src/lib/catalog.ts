import { buildings, expeditions, gatherings, recipes, resources } from "@obsidian-astral/shared";

export const resourceMap = new Map(resources.map((item) => [item.key, item]));
export const gatheringMap = new Map(gatherings.map((item) => [item.key, item]));
export const recipeMap = new Map(recipes.map((item) => [item.key, item]));
export const buildingMap = new Map(buildings.map((item) => [item.key, item]));
export const expeditionMap = new Map(expeditions.map((item) => [item.key, item]));
