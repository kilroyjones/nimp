// Modules
import logger from "../service/server/logging.service";

import { Conversion } from "../helpers/conversion.helper";
import { Data } from "src/helpers/data.helper";
import { PlayerService } from "../service/game/player.service";
import { RegionDatabase } from "../database/region.database";

// Types
import type { CreateRegionRequest, DigRequest, UpdateRegionRequest } from "$shared/messages";
import type { Server, Socket } from "socket.io";

/**
 * Performs a dig action if able
 *
 * @param id The unique identifier of the player.
 * @param regions The regions to join.
 */
const dig = async (io: Server, digRequest: DigRequest) => {
  logger.info(`[RegionHandler.dig] - ${digRequest}`);
  const regionKey = Conversion.toRegionKey(digRequest);
  let digs = await RegionDatabase.getDigs(regionKey);
  if (digs) {
    console.log("digs", digs);
    const digIndex = Conversion.toCellIndex(digRequest.x, digRequest.y);
    console.log("index", digIndex);
    if (digs[digIndex] == "0") {
      digs = Data.setCharAt(digs, digIndex, "1");
      digs = await RegionDatabase.updateDigs(regionKey, digs);
      console.log("update", digs);
      if (digs) {
        console.log(regionKey);
        io.to(regionKey).emit("update-digs", { regionKey: regionKey, digs: digs });
      }
    }
  }
};

export const DigHandler = {
  dig,
};
