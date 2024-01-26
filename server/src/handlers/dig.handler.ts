// Modules
import logger from "../service/server/logging.service";

import { Conversion } from "../helpers/conversion.helper";
import { Data } from "src/helpers/data.helper";
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

  const regionKey = Conversion.toRegionKey(digRequest.loc);
  let digs = await RegionDatabase.getDigs(regionKey);

  if (digs) {
    const idx = Conversion.toCellIndex(digRequest.loc.x, digRequest.loc.y);
    if (digs[idx] == "0") {
      digs = Data.setCharAt(digs, idx, "1");
      digs = await RegionDatabase.updateDigs(regionKey, digs);
      if (digs) {
        io.to(regionKey).emit("update-digs", { regionKey: regionKey, digs: digs });
      }
    }
  }
};

export const DigHandler = {
  dig,
};
