// Modules
import logger from "../service/server/logging.service";

import { Data } from "$shared/data";
import { RegionDatabase } from "../database/region.database";

// Types
import type { DigRequest } from "$shared/messages";
import type { Server } from "socket.io";
import { DigStatus } from "$shared/constants";
// import { PlayerDatabase } from "src/database/player.database";
// import { RegionHandler } from "./region.handler";
import { ResourceDatabase } from "src/database/resource.database";
import { Player } from "$shared/types";
import { PlayerService } from "src/service/game/player.service";

/**
 * Performs a dig action if able
 *
 * @param {Server} io - websocket server object, used so that an entire room can be broadcast to
 * @param {DigRequest} digRequest - DigRequest object containing region key and index to dig at.
 *
 * A dig action will first get the digs to ensure it can be update and then
 * overwrite that portion of the 'digs' string field before updating the record.
 */
const dig = async (io: Server, digRequest: DigRequest, playerId: string) => {
  logger.info(`[Action.dig] - ${digRequest}`);

  let digs = await RegionDatabase.getDigs(digRequest.regionKey);
  if (digs && Data.getCharAt(digs, digRequest.idx) == DigStatus.UNDUG) {
    digs = Data.setCharAt(digs, digRequest.idx, DigStatus.DUG);

    // Update digs and only update if that region has been successfully saved
    digs = await RegionDatabase.updateDigs(digRequest.regionKey, digs);
    if (digs) {
      io.to(digRequest.regionKey).emit("update-digs", {
        regionKey: digRequest.regionKey,
        digs: digs,
      });
    }

    // TODO: Update player resources in a more dynamic way based on region stats
    const updatedResources = await ResourceDatabase.add(playerId, { dirt: 1 });
    if (updatedResources) {
      console.log(updatedResources);
      PlayerService.updateResources(playerId, updatedResources);
    }

    // If not saved we'll need to retry, so in the future put this back on the queue:
    // TODO: Put failed request back on queue to try again.
  }
};

export const DigHandler = {
  dig,
};
