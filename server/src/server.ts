/**
 * This is our server, which is used to track users and their location in the
 * world.  We are using "rooms" to track what regions are currently in view,
 * while relying on the socket event name to determine what to do with the
 * incoming data.
 *
 * Here, aside from connection and disconnect, we only impleent updateRegion.
 */

import dotenv from "dotenv";
import express from "express";

import { createServer } from "http";
import { PlayerService } from "./service/player.service";
import { Server, Socket } from "socket.io";
import { RegionHandler } from "./handlers/region.handler";
import { CreateRegionRequest, UpdateRegionRequest } from "$shared/messages";

dotenv.config({ path: "./.env" });

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
  // Connect player
  const playerId = PlayerService.getPlayerId(socket);
  PlayerService.add(playerId, socket);

  socket.emit("handshake", {
    playerId: playerId,
  });

  // Remove user from hashmap
  socket.on("disconnect", () => {
    PlayerService.remove(playerId);
  });

  // Region
  socket.on("update-regions", msg => {
    const updateRegionRequest: UpdateRegionRequest = msg;
    console.log("[update-regions]", updateRegionRequest);
    RegionHandler.update(socket, playerId, updateRegionRequest);
  });

  socket.on("create-region", msg => {
    const createRegionRequest: CreateRegionRequest = msg;
    console.log("create-region", createRegionRequest);
    RegionHandler.create(socket, playerId, createRegionRequest);
  });

  // Actions
  socket.on("dig", msg => {
    console.log("dig", msg);
    // DigHandler.dig(socket, playerId, msg.data);
  });
});

const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
