/**
 * This is our server, which is used to track users and their location in the
 * world.  We are using "rooms" to track what regions are currently in view,
 * while relying on the socket event name to determine what to do with the
 * incoming data.
 *
 * Here, aside from connection and disconnect, we only impleent updateRegion.
 */

import express from "express";
import logger from "./service/server/logging.service";

// Moddules
import { ClaimHandler } from "./handlers/claim.handler";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { DigHandler } from "./handlers/dig.handler";
import { PlayerService } from "./service/game/player.service";
import { PostHandler } from "./handlers/post.handler";
import { Server, Socket } from "socket.io";
import { RegionHandler } from "./handlers/region.handler";

// Types and constants
import {
  ClaimRequest,
  CreateRegionRequest,
  DigRequest,
  PostRequest,
  UpdateRegionRequest,
} from "$shared/messages";

// Typical server setup
const app = express();
app.use(cookieParser());

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
    const request: DigRequest = msg;
    logger.info("IN - [dig]" + request);
    DigHandler.dig(io, request);
  });

  socket.on("claim", msg => {
    const request: ClaimRequest = JSON.parse(msg);
    console.log("IN - [claim]", request);
    if (request) {
      ClaimHandler.claim(io, request);
    }
  });

  socket.on("post", msg => {
    const request: PostRequest = JSON.parse(msg);
    console.log("IN - [post]", request);
    if (request) {
      PostHandler.post(io, request);
    }
  });

  ///////////////////////////////////////////////////////////
  // PLAYER MANAGEMENT
  ///////////////////////////////////////////////////////////
  socket.on("create-region", msg => {
    const request: CreateRegionRequest = msg;
    logger.info("IN - [create-region]", request);
    RegionHandler.create(io, playerId, request);
  });

  socket.on("update-regions", msg => {
    const request: UpdateRegionRequest = msg;
    logger.info("IN - [update-regions]", request);
    RegionHandler.update(socket, playerId, request);
  });
});

const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
