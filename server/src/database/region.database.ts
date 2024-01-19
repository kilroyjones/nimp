import { Conversion } from "../helpers/conversion.helper";
import { db } from "./client/db";
import { Location } from "$shared/models";
import { Region } from "./models/region.model";
import { REGION_WIDTH_CELLS, REGION_HEIGHT_CELLS } from "../constants";

//
const digsAsBase64 = Buffer.from(
  Buffer.alloc(REGION_WIDTH_CELLS * REGION_HEIGHT_CELLS, 0)
).toString("base64");

/**
 *
 */
const create = async (
  userId: string,
  regionKey: string,
  loc: Location
): Promise<Region | undefined> => {
  try {
    loc = Conversion.toRegionLocation(loc);
    return await db
      .insertInto("Regions")
      .values({
        key: regionKey,
        x: loc.x,
        y: loc.y,
        founder: userId,
        odds: 10,
        digs: digsAsBase64,
        // posts: {},
      })
      .returningAll()
      .executeTakeFirstOrThrow();
  } catch (error: any) {
    console.log(`[RegionActions.create] - ${error}`);
  }
};

/**
 *
 */
const get = async (regionKey: string): Promise<Region | undefined> => {
  try {
    return db.selectFrom("Regions").selectAll().where("key", "=", regionKey).executeTakeFirst();
  } catch (error: any) {
    console.log(`[RegionActions.get] - ${error}`);
  }
};

// /**
//  *
//  */

const getMany = async (regionKeys: string[]): Promise<Region[] | undefined> => {
  try {
    return db.selectFrom("Regions").selectAll().where("Regions.key", "in", regionKeys).execute();
  } catch (error: any) {
    console.log(`[RegionActions.getMany] - ${error}`);
  }
};

export const RegionDatabase = {
  create,
  get,
  getMany,
};
