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
import logger from "../server/logging.service";
import { PlayerDatabase } from "src/database/player.database";
import { Player } from "src/database/models/player.model";

// Types
type PlayerConnection = {
  socket: Socket;
  connections: number;
};

const playerConns: Map<string, PlayerConnection> = new Map();

///////////////////////////////////////////////////////////
// PLAYER MANAGEMENT
///////////////////////////////////////////////////////////

/**
 * Adds a new player to the game server.
 *
 * @param id The unique identifier of the player.
 * @param socket The socket connection of the player.
 */
const add = (id: string, socket: Socket) => {
  playerConns.set(id, { socket: socket, connections: 1 });
  logger.info(`Player ${id} connected`);
};

/**
 * Removes a player from the game server.
 *
 * @param id The unique identifier of the player to be removed.
 */

const remove = (id: string) => {
  playerConns.delete(id);
  logger.info(`Player ${id} disocnnected`);
};

/**
 * Retrieves or generates a unique ID for a player.
 *
 * @param socket The socket connection of the player.
 *
 * TODO: Implement user already existing handling logic.
 */
const getPlayer = async (socket: Socket): Promise<Player | undefined> => {
  const id = socket.handshake.query.id as string;

  if (id !== "") {
    const player = await PlayerDatabase.getById(id);
    // Player exists
    if (player) {
      return player;
    }
  }

  return await PlayerDatabase.create();
};

///////////////////////////////////////////////////////////
// REGION MANAGEMENT
///////////////////////////////////////////////////////////

/**
 * Caps the number of regions a player join
 *
 * @param {string} id - The unique identifier of the player.
 * @param {number} cap - The number of rooms joined.
 *
 * This is rough at the moment as it just slices off the end of the joined
 * regions.  The reason this may be necessary is to prevent users from joining
 * more rooms than their screen can accommodate for means of data harvesting or
 * possibly cheating.
 *
 */
const capJoinedRegions = (id: string, cap: number) => {
  const player = playerConns.get(id);
  if (player) {
    const roomsIter = player.socket.rooms.values();
    while (player.socket.rooms.size > cap) {
      const roomToLeave = roomsIter.next().value;
      leaveRegion(id, roomToLeave);
      // TODO: create warning message that too many rooms have been joined
    }
  }
};

/**
 * Retrieves a set of all regions that a player has joined.
 *
 * @param {string} id - The unique identifier of the player.
 * @returns {Set<string> | undefined} A set of region names the player has joined, or undefined if the player is not found.
 */
const getJoinedRegions = (id: string): Set<string> | undefined => {
  const player = playerConns.get(id);
  if (player) {
    return player.socket.rooms;
  }
};
/**
 * Adds a player to a specific region.
 *
 * @param id The unique identifier of the player.
 * @param region The region to join.
 */
const joinRegion = (id: string, region: string) => {
  const player = playerConns.get(id);
  if (player) {
    player.socket.join(region);
  }
};

/**
 * Adds a player to multiple regions based on id.
 *
 * @param id The unique identifier of the player.
 * @param regions The regions to join.
 */
const joinRegions = (id: string, regions: string[]) => {
  const player = playerConns.get(id);
  if (player) {
    regions.forEach(region => player.socket.join(region));
  }
};

/**
 * Removes a player from all connected regions.
 *
 * @param {string} id - The unique identifier of the player.
 */
const leaveAllRegions = (id: string) => {
  const player = playerConns.get(id);
  if (player) {
    player.socket.rooms.forEach(region => player.socket.leave(region));
  }
};

/**
 * Removes a player from a specified region based on id.
 *
 * @param {string} id - The unique identifier of the player.
 * @param {string} region - The name of the region to leave.
 */
const leaveRegion = (id: string, region: string) => {
  const player = playerConns.get(id);
  if (player) {
    player.socket.leave(region);
  }
};

/**
 * Removes a player from multiple regions.
 *
 * @param {string} id - The unique identifier of the player.
 * @param {string[]} regions - An array of region names to leave.
 */
const leaveRegions = (id: string, regions: string[]) => {
  const player = playerConns.get(id);
  if (player) {
    regions.forEach(region => player.socket.leave(region));
  }
};

export const PlayerService = {
  // Player
  add,
  getPlayer,
  remove,

  // Regions
  capJoinedRegions,
  getJoinedRegions,
  joinRegion,
  joinRegions,
  leaveAllRegions,
  leaveRegion,
  leaveRegions,
};
