import { Location } from "./models";

export type CreateRegionRequest = {
  key: string;
  loc: Location;
};

export type UpdateRegionRequest = {
  regionsJoin: string[];
  regionsLeave: string[];
};

export type HandshakeResponse = {
  playerId: string;
};
