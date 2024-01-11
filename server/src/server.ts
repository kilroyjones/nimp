/**
 * This is our server, which is used to track users and their location in the
 * world.  We are using "rooms" to track what regions are currently in view,
 * while relying on the socket event name to determine what to do with the
 * incoming data.
 *
 * Here, aside from connection and disconnect, we only impleent updateRegion.
 */

import express from "express";

import { createServer } from "http";
import { DigHandler } from "./handlers/dig.handler";
import { PlayerService } from "./service/player.service";
import { Server, Socket } from "socket.io";
import { ExploreHandler } from "./handlers/explore.handler";

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

  // Sends region information
  socket.on("explore", msg => {
    console.log("explore", msg);
    ExploreHandler.explore(socket, playerId, msg.data.regions);
  });

  // Sends region information
  socket.on("dig", msg => {
    console.log("dig", msg);
    DigHandler.dig(socket, playerId, msg.data);
  });
});

const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
