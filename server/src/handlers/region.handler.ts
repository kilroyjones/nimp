// Modules
import logger from "../service/server/logging.service";

import { PlayerService } from "../service/game/player.service";
import { RegionDatabase } from "../database/region.database";

// Types
import type { CreateRegionRequest, UpdateRegionRequest } from "$shared/messages";
import type { Server, Socket } from "socket.io";

/**
 * Creates a region if that region doesn't already exist
 *
 * @param io The socket.io base object,
 * @param userId The id created up socket being established
 * @param createRegionRequest Request object containing key and location of region
 */
const create = async (io: Server, playerId: string, createRegionRequest: CreateRegionRequest) => {
  logger.info(`[RegionHandler.create] - ${createRegionRequest}`);

  let region = await RegionDatabase.get(createRegionRequest.key);

  // Only create if no region already exists
  if (!region) {
    region = await RegionDatabase.create(
      playerId,
      createRegionRequest.key,
      createRegionRequest.loc
    );

    if (region) {
      io.to(region.key).emit("update-regions", region);
    }
  }
};

/**
 * Update a region if that region exists
 *
 * @param io The socket.io base object,
 * @param userId The id created up socket being established
 * @param createRegionRequest Request object containing key and location of region
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
      logger.info("RegionHandler.update", regions.length);
      // TODO: Using bytea (byte array) can't be sent as object?
      socket.emit("update-regions", JSON.stringify({ data: { regions: regions } }));
    }
  }
};

export const RegionHandler = {
  create,
  update,
};
