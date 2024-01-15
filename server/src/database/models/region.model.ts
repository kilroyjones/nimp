import { Regions } from "../types/types";
import { Selectable, Updateable } from "kysely";

export type Region = Selectable<Regions>;
export type RegionUpdate = Updateable<Regions>;
