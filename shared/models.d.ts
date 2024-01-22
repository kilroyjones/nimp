import type { Regions } from "../server/src/database/types/types";

export type Location = {
  x: number;
  y: number;
};

export type Bounds = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export type RegionClient = Omit<Regions, "id" | "founder" | "odds">;
