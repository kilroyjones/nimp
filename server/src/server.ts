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
import { Server, Socket } from "socket.io";

// Typical server setup
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

const idToRooms = new Map();

interface RegionLocation {
  x: number;
  y: number;
}

/**
 * Called upon each user connecting to the server. Later this will need to be
 * broken up as we add features. At the moment the server only connects,
 * disconnects and updates the region the user has connected to.
 */
io.on("connection", (socket: Socket) => {
  // Maintain a hashmap which tracks the id of the user and the rooms joined
  idToRooms.set(socket.id, new Set());
  console.log(`User ${socket.id} connected.`);

  // Remove user from hashmap
  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
    idToRooms.delete(socket.id);
  });

  /**
   * Here we get the list of locations the users has passed and update which
   * rooms they have joined.
   */
  socket.on("updateRegion", msg => {
    const roomsJoined = idToRooms.get(socket.id);

    // Converts to a format which will mirror the keys of our database
    // There should be no more than 4 rooms joined at a time so we can cap it this way
    // This may lead to issues for people with super high resolution monitors, but that
    // is an edge case we can look at later.
    let roomsToJoin: string[] = msg.data
      .map((location: RegionLocation) => `${location.x}-${location.y}`)
      .slice(0, 4);

    // Leave all joined rooms
    if (roomsJoined) {
      roomsJoined.forEach((roomName: string) => {
        socket.leave(roomName);
      });
    }
    roomsJoined.clear();

    // Join new rooms
    roomsToJoin.forEach((roomName: string) => {
      socket.join(roomName);
      roomsJoined.add(roomName);
    });
    console.log("Rooms currently in: ", roomsJoined);
  });
});

const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
