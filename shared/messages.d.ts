import type { Regions } from "../server/src/database/types/types";
import { Location } from "./models";

export type CreateRegionRequest = {
  key: string;
  loc: Location;
};

export type UpdateRegionRequest = {
  regionsJoin: string[];
  regionsLeave: string[];
};

export type DigRequest = {
  key: string;
  loc: Location;
};

export type UpdateRegionResponse = {
  regions: Regions[];
};

export type HandshakeResponse = {
  playerId: string;
};
