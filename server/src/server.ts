/**
 * This is our server, which is used to track users and their location in the
 * world.  We are using "rooms" to track what regions are currently in view,
 * while relying on the socket event name to determine what to do with the
 * incoming data.
 *
 * Here, aside from connection and disconnect, we only impleent updateRegion.
 */

import express from "express";

import {
  ClaimRequest,
  CreateRegionRequest,
  DigRequest,
  UpdateRegionRequest,
} from "$shared/messages";
import { createServer } from "http";
import { DigHandler } from "./handlers/dig.handler";
import { PlayerService } from "./service/game/player.service";
import { Server, Socket } from "socket.io";
import { RegionHandler } from "./handlers/region.handler";
import logger from "./service/server/logging.service";

// Typical server setup
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

/**
 * Called upon each user connecting to the server. Later this will need to be
 * broken up as we add features. At the moment the server only connects,
 * disconnects and updates the region the user has connected to.
 */
io.on("connection", (socket: Socket) => {
  const playerId = PlayerService.getPlayerId(socket);
  PlayerService.add(playerId, socket);

  socket.emit("handshake", {
    playerId: playerId,
  });

  ///////////////////////////////////////////////////////////
  // SERVER
  ///////////////////////////////////////////////////////////
  socket.on("disconnect", () => {
    PlayerService.remove(playerId);
  });

  ///////////////////////////////////////////////////////////
  // ACTIONS
  ///////////////////////////////////////////////////////////
  socket.on("dig", msg => {
    const digRequest: DigRequest = msg;
    logger.info("IN - [dig]", digRequest);
    DigHandler.dig(io, digRequest);
  });

  socket.on("claim", msg => {
    const claimRequest: ClaimRequest = msg;
    logger.info("IN - [claim]", claimRequest);
    DigHandler.dig(io, claimRequest);
  });

  ///////////////////////////////////////////////////////////
  // PLAYER MANAGEMENT
  ///////////////////////////////////////////////////////////
  socket.on("create-region", msg => {
    const createRegionRequest: CreateRegionRequest = msg;
    logger.info("IN - [create-region]", createRegionRequest);
    RegionHandler.create(io, playerId, createRegionRequest);
  });

  socket.on("update-regions", msg => {
    const updateRegionRequest: UpdateRegionRequest = msg;
    logger.info("IN - [update-regions]", updateRegionRequest);
    RegionHandler.update(socket, playerId, updateRegionRequest);
  });
});

const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
