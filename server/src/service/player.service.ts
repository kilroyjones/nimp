import { Socket } from "socket.io";
import { createHash, randomBytes } from "crypto";

type Player = {
  socket: Socket;
  connections: number;
};

const players: Map<string, Player> = new Map();

// User connection
const add = (id: string, socket: Socket) => {
  players.set(id, { socket: socket, connections: 1 });
  console.log(`User ${socket.id} connected.`);
};

const remove = (id: string) => {
  players.delete(id);
  console.log(`User ${id} disconnected`);
};

/**
 * TODO: We will find an alternative to this at some point
 */
const getPlayerId = (socket: Socket): string => {
  const id = socket.handshake.query.playerId as string;

  if (id !== "") {
    if (players.get(id)) console.log("Already connected");
    // TODO: Add code here that handles user already existing
    return id;
  }

  // Create a new random id for the users
  const salt = randomBytes(16).toString("hex");
  return createHash("sha256").update(salt).digest("hex");
};

// Region management
/**
 *
 */
const joinRegion = (id: string, region: string) => {
  const player = players.get(id);
  if (player) {
    player.socket.join(region);
  }
};

/**
 *
 */
const joinRegions = (id: string, regions: string[]) => {
  const player = players.get(id);
  if (player) {
    regions.forEach(region => player.socket.join(region));
  }
};

/**
 *
 */
const leaveRegion = (id: string, region: string) => {
  const player = players.get(id);
  if (player) {
    player.socket.leave(region);
  }
};

/**
 *
 */
const leaveRegions = (id: string, regions: string[]) => {
  const player = players.get(id);
  if (player) {
    regions.forEach(region => player.socket.leave(region));
  }
};

/**
 *
 */
const leaveAllRegions = (id: string) => {
  const player = players.get(id);
  if (player) {
    player.socket.rooms.forEach(region => player.socket.leave(region));
  }
};

const getJoinedRegions = (id: string): Set<string> | undefined => {
  const player = players.get(id);
  if (player) {
    return player.socket.rooms;
  }
};

export const PlayerService = {
  // Server
  add,
  getPlayerId,
  remove,

  // regions
  joinRegion,
  joinRegions,
  leaveRegion,
  leaveRegions,
  leaveAllRegions,
  getJoinedRegions,
};
