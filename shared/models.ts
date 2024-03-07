import type { Regions } from "../server/src/database/types/types";
import type { Inventories } from "../server/src/database/types/types";

export type Region = Omit<Regions, "id" | "founder" | "odds">;
export type Inventory = Omit<Regions, "id">;
