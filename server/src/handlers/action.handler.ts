// Modules
import logger from "../service/server/logging.service";

import { Data } from "$shared/data";
import { RegionDatabase } from "../database/region.database";

// Types
import type { DigRequest } from "$shared/messages";
import type { Server } from "socket.io";

/**
 * Performs a dig action if able
 *
 * @param {Server} io - websocket server object, used so that an entire room can be broadcast to
 * @param {DigRequest} digRequest - DigRequest object containing region key and index to dig at.
 *
 * A dig action will first get the digs to ensure it can be update and then
 * overwrite that portion of the 'digs' string field before updating the record.
 */
const dig = async (io: Server, digRequest: DigRequest) => {
  logger.info(`[Action.dig] - ${digRequest}`);

  let digs = await RegionDatabase.getDigs(digRequest.key);
  if (digs && Data.getCharAt(digs, digRequest.idx) == "0") {
    digs = Data.setCharAt(digs, digRequest.idx, "1");

    // Update digs and only update if that region has been successfully saved
    digs = await RegionDatabase.updateDigs(digRequest.key, digs);
    if (digs) {
      io.to(digRequest.key).emit("update-digs", { regionKey: digRequest.key, digs: digs });
    }

    // If not saved we'll need to retry, so in the future put this back on the queue:
    // TODO: Put failed request back on queue to try again.
  }
};

export const ActionHandler = {
  dig,
};
