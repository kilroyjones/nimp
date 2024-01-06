import e from "../database/edgeql-js";

import { db } from "../database/client";
import { Click, Location } from "../types";
import { Socket } from "socket.io";
import { ExploreActions } from "../actions/explore.action";
import { REGION_WIDTH, REGION_HEIGHT } from "../constants";

function convertToRegionLocation(x: number, y: number): Location {
  return { x: Math.floor(x / REGION_WIDTH), y: Math.floor(y / REGION_HEIGHT) };
}

export const explore = async (socket: Socket, playerId: string, click: Click) => {
  // Check if region exists
  console.log(click);
  const region = convertToRegionLocation(click.x, click.y);
  let result = await e
    .select(e.Region, r => ({
      x: true,
      y: true,
      open: true,
      filter_single: e.op(r.x, "=", region.x),
    }))
    .run(db);
  console.log(region, result);

  // // If not created, then create
  if (!result) {
    const posts = ExploreActions.createRegion(region);
    console.log(posts);
    const result = await e
      .insert(e.Region, {
        x: region.x,
        y: region.y,
        open: e.bool(true),
        odds: e.int16(10),
        posts: e.json(posts),
      })
      .run(db);
    console.log(result);
    socket.to(`${region.x}${region.y}`).emit("update", posts);
  }

  // Handle either user not update
  // If so, then allow user to spend goods explore

  // If successful, create region

  // Report back if exploration was a success or not

  socket.emit("update", { regions: "" });
};
