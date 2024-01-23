import type { CreateRegionRequest, UpdateRegionRequest } from "$shared/messages";
import { PlayerService } from "../service/player.service";
import { RegionDatabase } from "../database/region.database";
import { Server, Socket } from "socket.io";
import { Conversion } from "src/helpers/conversion.helper";

/**
 *
 */
const create = async (socket: Socket, userId: string, createRegionRequest: CreateRegionRequest) => {
  console.log(`[RegionHandler.create] - ${createRegionRequest}`);
  let region = await RegionDatabase.get(createRegionRequest.key);
  if (region) {
    console.log("Exists: ", region.key);
    return;
  }
  region = await RegionDatabase.create(userId, createRegionRequest.key, createRegionRequest.loc);
};

/**
 *
 */
const dig = async (io: Server, playerId: string, digRequest: any) => {
  console.log(`[RegionHandler.dig] - ${digRequest}`);
  const regionKey = Conversion.toRegionKey(digRequest);
  let digs = await RegionDatabase.getDigs(regionKey);
  if (digs) {
    console.log("digs", digs);
    const digIndex = Conversion.toCellIndex(digRequest.x, digRequest.y);
    console.log("index", digIndex);
    if (digs[digIndex] == "0") {
      digs = Conversion.setCharAt(digs, digIndex, "1");
      digs = await RegionDatabase.updateDigs(regionKey, digs);
      console.log("update", digs);
      if (digs) {
        console.log(regionKey);
        io.to(regionKey).emit("update-digs", { regionKey: regionKey, digs: digs });
      }
    }
  }
};

/**
 *
 */
const update = async (
  socket: Socket,
  playerId: string,
  updateRegionRequest: UpdateRegionRequest
) => {
  // Update rooms
  PlayerService.leaveRegions(playerId, updateRegionRequest.regionsLeave);
  PlayerService.joinRegions(playerId, updateRegionRequest.regionsJoin);

  // Check what rooms currently joined
  const regionsJoined = PlayerService.getJoinedRegions(playerId);

  // If more then four we cap it at four
  if (regionsJoined && regionsJoined.size > 4) {
    PlayerService.capJoinedRegions(playerId, 4);
  }

  // If joined any new rooms
  if (updateRegionRequest.regionsJoin.length > 0) {
    const regions = await RegionDatabase.getMany(updateRegionRequest.regionsJoin.slice(0, 4));
    if (regions) {
      console.log("Out - [update-regions]", regions.length);
      // TODO: Using bytea (byte array) can't be sent as object?
      socket.emit("update-regions", JSON.stringify({ data: { regions: regions } }));
    }
  }
};

export const RegionHandler = {
  create,
  dig,
  update,
};
