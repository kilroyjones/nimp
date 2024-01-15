import type { Regions } from "../server/src/database/types/types";

export type Location = {
  x: number;
  y: number;
};

export type RegionClient = Omit<Regions, "id" | "founder" | "odds">;
