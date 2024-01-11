import { PlayerService } from "../service/player.service";
import { Region } from "../types";
import { Socket } from "socket.io";

const explore = async (socket: Socket, playerId: string, regions: Region[]) => {
  // Converts to a format which will mirror the keys of our database
  // There should be no more than 4 rooms joined at a time so we can cap it this way
  // This may lead to issues for people with super high resolution monitors, but that
  // is an edge case we can look at later.
  // TODO: Validate rooms can exist!

  // Slice to only take first four rooms
  console.log(JSON.stringify(regions));
  let roomsToJoin: string[] = regions.map((region: Region) => region.key).slice(0, 4);
  console.log(roomsToJoin);

  PlayerService.leaveAllRegions(playerId);
  PlayerService.joinRegions(playerId, roomsToJoin);
  console.log("JOINED:", PlayerService.getJoinedRegions(playerId));

  // TODO: Add in query for actual regions data

  socket.emit("explore", { regions: "" });
};

export const ExploreHandler = {
  explore,
};
