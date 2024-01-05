import e from "../database/edgeql-js";
import { db } from "../database/client";
import { RegionLocation } from "../messages";
import { Socket } from "socket.io";

export const explore = async (socket: Socket, region: RegionLocation) => {
  // Check if region exists and is unexplored

  // If so, then allow user to spend goods explore

  // If successful, create region

  // Report back if exploration was a success or not

  const result = e.insert(e.Region, {
    x: region.x,
    y: region.y,
    open: e.bool(true),
    odds: e.int16(10),
    posts: e.json({}),
  });
  socket.emit("update", { regions: "" });
};
