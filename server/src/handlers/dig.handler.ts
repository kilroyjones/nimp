import e from "../database/edgeql-js";

import { db } from "../database/client";
import { Socket } from "socket.io";
import { REGION_WIDTH, REGION_HEIGHT, REGION_WIDTH_CELLS, REGION_HEIGHT_CELLS } from "../constants";
import { Location, DigMessage } from "../types";
import type { Region } from "../database/interfaces";
import { Conversion } from "../helpers/conversion.helper";

//
const defaultDigsObject = new Array(REGION_WIDTH_CELLS * REGION_HEIGHT_CELLS)
  .fill(1)
  .reduce((obj, item, index) => {
    obj[index] = item;
    return obj;
  }, {});

/**
 *
 */
const getRegion = async (regionKey: string) => {
  return await e
    .select(e.Region, region => ({
      ...e.Region["*"],
      filter_single: { key: regionKey },
    }))
    .run(db);
};

/**
 *
 */
const createRegion = async (regionKey: string, x: number, y: number) => {
  if (Conversion.toRegionKey(x, y) == regionKey) {
    return await e
      .insert(e.Region, {
        key: regionKey,
        x: x,
        y: x,
        open: e.bool(true),
        odds: e.int16(10),
        digs: e.json(defaultDigsObject),
        posts: e.json({}),
      })
      .run(db);
  }
};

/**
 *
 */
const updateDigSite = async (regionKey: string, index: string): Promise<any> => {
  // try {
  const region = await e
    .update(e.Region, region => ({
      filter: e.op(region.key, "=", regionKey),
      set: {
        digs: e.json_set(
          {
            value: e.cast(e.json, e.str("0")),
            create_if_missing: false,
          },
          region.digs,
          index
        ),
      },
    }))
    .run(db);
  // e.cast(e.json, e.op(e.to_int16(e.to_str(gg.standings["e5680c32-4648-11ed-9bdc-b7196e916fad"]["win"])), '+', 1))},
  // update Movie set {myJson := to_json('{"a": 11, "b": 20}')};
  // Hint: Did you want "std::json_set(target: std::json, VARIADIC path:
  // array<std::str>, NAMED ONLY value: OPTIONAL std::json, NAMED ONLY
  // create_if_missing: std::bool=true, NAMED ONLY empty_treatment:
  // std::JsonEmpty=std::JsonEmpty.ReturnEmpty)"?

  if (region) {
    return await e
      .select(e.Region, region => ({
        ...e.Region["*"],
        filter_single: { key: regionKey },
      }))
      .run(db);
  }
  // } catch (error: any) {}
};

const dig = async (socket: Socket, playerId: string, dig: DigMessage) => {
  // Check if region exists
  console.log("dig");
  console.log(defaultDigsObject);
  const region = await updateDigSite(dig.key, "4");
  console.log("HERE:", region);
  if (!region) {
    console.log("Be patient, the world gods are preparing this land.");
    return;
  }

  // Try and dig
  // updateDigSite(region, dig.loc);

  // // If not created, then create
  // if (!result) {

  // Handle either user not update
  // If so, then allow user to spend goods explore

  // If successful, create region

  // Report back if exploration was a success or not

  socket.emit("update", { regions: "" });
};

export const DigHandler = {
  dig,
};
