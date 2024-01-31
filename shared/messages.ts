import type { Regions } from "../server/src/database/types/types";
import { Location } from "./models";

/**
 * REQUESTS
 */
export type DigRequest = {
  key: string;
  idx: number;
};

export type UpdateRegionRequest = {
  regionsJoin: string[];
  regionsLeave: string[];
};

/**
 * RESPONSES
 */
export type HandshakeResponse = {
  playerId: string;
};

export type CreateRegionRequest = {
  key: string;
  loc: Location;
};

export type UpdateRegionResponse = {
  regions: Regions[];
};

export type UpdateDigResponse = {
  regionKey: string;
  regions: Regions[];
};
