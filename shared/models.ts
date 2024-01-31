import type { DigStatus } from "./constants";
import type { Regions } from "../server/src/database/types/types";

export type Location = {
  x: number;
  y: number;
};

export type DigSite = {
  idx: number;
  status: DigStatus;
};

export type Bounds = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export type Region = Omit<Regions, "id" | "founder" | "odds">;
