// Modules
import logger from "../service/server/logging.service";

import { Data } from "$shared/data";
import { RegionDatabase } from "../database/region.database";

// Types
import type { ClaimRequest, DigRequest } from "$shared/messages";
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
const claim = async (io: Server, claimRequest: ClaimRequest) => {
  logger.info(`[Action.dig] - ${claimRequest}`);
};

export const ClaimHandler = {
  claim,
};
