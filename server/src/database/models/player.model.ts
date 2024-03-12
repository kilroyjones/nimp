import { Players } from "../types/types";
import { Selectable, Updateable } from "kysely";

export type Player = Selectable<Players>;
export type PlayerUpdate = Updateable<Player>;
