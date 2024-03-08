// import type { isClaimMode } from "$lib/state/settings.state";
import type { Regions } from "../server/src/database/types/types";
import type { Inventory, Location, Player, Post, SelectedDig } from "./types";

/**
 * REQUESTS (From client to server)
 */
export type ClaimRequest = {
  digs: SelectedDig[];
  width: number;
  height: number;
  isClaimable: boolean;
};

export type DigRequest = {
  regionKey: string;
  idx: number;
};

export type PostRequest = {
  regionKey: string;
  postKey: string;
  content: string;
};

export type UpdateRegionRequest = {
  regionsJoin: string[];
  regionsLeave: string[];
};

/**
 * RESPONSES (From server to client)
 */
export type HandshakeResponse = {
  player: Player;
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
  digs: string;
};

export type UpdatePostResponse = {
  regionKey: string;
  post: Post;
};

export type UpdateInventoryResponse = {
  inventory: Inventory;
};

export type UpdateResourcesResponse = {
  dirt: number;
};