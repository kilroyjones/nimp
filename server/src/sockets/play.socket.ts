import logger from "../service/server/logging.service";

// Moddules
import { ClaimHandler } from "../handlers/claim.handler";
import { DigHandler } from "../handlers/dig.handler";
import { httpServer } from "../server";
import { PlayerService } from "../service/game/player.service";
import { PostHandler } from "../handlers/post.handler";
import { Server, Socket } from "socket.io";
import { RegionHandler } from "../handlers/region.handler";

// Types and constants
import {
  ClaimRequest,
  CreateRegionRequest,
  DigRequest,
  PostRequest,
  UpdateRegionRequest,
} from "$shared/messages";
import { Player } from "$shared/types";

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

/**
 *
 */
const handlePlayerConnect = async (socket: Socket, player: Player) => {
  PlayerService.add(player.id, socket);

  ///////////////////////////////////////////////////////////
  // SERVER
  ///////////////////////////////////////////////////////////
  socket.on("disconnect", () => {
    console.log("Disconnect", player.id);
    if (player) {
      PlayerService.remove(player.id);
    }
  });

  ///////////////////////////////////////////////////////////
  // ACTIONS
  ///////////////////////////////////////////////////////////
  socket.on("dig", msg => {
    const request: DigRequest = msg;
    logger.info("IN - [dig]" + request);
    DigHandler.dig(io, request, player.id);
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
  socket.on("create-region", async msg => {
    const request: CreateRegionRequest = msg;
    logger.info("IN - [create-region]", request);
    await RegionHandler.create(io, player.id, request);
  });

  socket.on("update-regions", async msg => {
    const request: UpdateRegionRequest = msg;
    logger.info("IN - [update-regions]", request);
    await RegionHandler.update(socket, player.id, request);
  });
};

/**
 * Called upon each user connecting to the server. Later this will need to be
 * broken up as we add features. At the moment the server only connects,
 * disconnects and updates the region the user has connected to.
 */
io.on("connection", async (socket: Socket) => {
  let player: Player | undefined = await PlayerService.getPlayer(socket);
  console.log("asdf", player);

  if (!player) {
    // TODO: Failed to find or add player
    socket.emit("error", "Failed to establish websocket - No such account found");
    socket.disconnect();
    return;
  }

  await handlePlayerConnect(socket, player);
});
