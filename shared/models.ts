import type { Regions } from "../server/src/database/types/types";

export type Region = Omit<Regions, "id" | "founder" | "odds">;
