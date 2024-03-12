import { Resources } from "../types/types";

export type UpdatedResources = Omit<Resources, "id">;
