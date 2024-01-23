/**
 *
 * PlayerService Module
 *
 * This module provides functionalities for managing player
 * connections and their interactions with different regions within a networked
 * environment.  It includes functions for adding/removing players, managing
 * player IDs, and handling player's presence in various regions.
 *
 */

import { Socket } from "socket.io";
import { createHash, randomBytes } from "crypto";
import logger from "../server/logging.service";

// Types
type Player = {
  socket: Socket;
  connections: number;
};

const players: Map<string, Player> = new Map();

/**
 * PLAYER MANAGEMENT
 */

/**
 * Adds a new player to the game server.
 *
 * @param id The unique identifier of the player.
 * @param socket The socket connection of the player.
 */
const add = (id: string, socket: Socket) => {
  players.set(id, { socket: socket, connections: 1 });
  logger.info(`Player ${id} connected`);
};

/**
 * Removes a player from the game server.
 *
 * @param id The unique identifier of the player to be removed.
 */

const remove = (id: string) => {
  players.delete(id);
  logger.info(`Player ${id} disocnnected`);
};

/**
 * Retrieves or generates a unique ID for a player.
 *
 * @param socket The socket connection of the player.
 *
 * TODO: Implement user already existing handling logic.
 */
const getPlayerId = (socket: Socket): string => {
  const id = socket.handshake.query.playerId as string;

  if (id !== "") {
    if (players.get(id)) {
      logger.info(`Player ${id} already connected`);
    }
    // TODO: Add code here that handles user already existing
    return id;
  }

  // Create a new random id for the users
  const salt = randomBytes(16).toString("hex");
  return createHash("sha256").update(salt).digest("hex");
};

/**
 * REGION MANAGEMENT
 */

/**
 * Adds a player to a specific region.
 *
 * @param id The unique identifier of the player.
 * @param region The region to join.
 */
const joinRegion = (id: string, region: string) => {
  const player = players.get(id);
  if (player) {
    player.socket.join(region);
  }
};

/**
 * Adds a player to multiple regions
 *
 * @param id The unique identifier of the player.
 * @param regions The regions to join.
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
  console.log(regions, regions == undefined);
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

/**
 *
 */
const getJoinedRegions = (id: string): Set<string> | undefined => {
  const player = players.get(id);
  if (player) {
    return player.socket.rooms;
  }
};

/**
 *
 */
const capJoinedRegions = (id: string, cap: number) => {
  const player = players.get(id);
  if (player) {
    const roomsIter = player.socket.rooms.values();
    while (player.socket.rooms.size > cap) {
      const roomToLeave = roomsIter.next().value;
      leaveRegion(id, roomToLeave);
      // TODO: create warning message that too many rooms have been joined
    }
  }
};

export const PlayerService = {
  // Server
  add,
  getPlayerId,
  remove,

  // Regions
  capJoinedRegions,
  joinRegion,
  joinRegions,
  leaveRegion,
  leaveRegions,
  leaveAllRegions,
  getJoinedRegions,
};
