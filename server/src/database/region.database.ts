import { Conversion } from "../helpers/conversion.helper";
import { db } from "./client/db";
import { Location } from "$shared/models";
import { Region } from "./models/region.model";
import { REGION_WIDTH_CELLS, REGION_HEIGHT_CELLS } from "../constants";

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
        digs: "0".repeat(REGION_WIDTH_CELLS * REGION_HEIGHT_CELLS),
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
    return await db
      .selectFrom("Regions")
      .selectAll()
      .where("key", "=", regionKey)
      .executeTakeFirstOrThrow();
  } catch (error: any) {
    console.log(`[RegionActions.get] - ${error}`);
  }
};

/**
 *
 */
const getDigs = async (regionKey: string): Promise<string | undefined> => {
  try {
    const result = await db
      .selectFrom("Regions")
      .select("digs")
      .where("key", "=", regionKey)
      .executeTakeFirstOrThrow();
    return result.digs;
  } catch (error: any) {
    console.log(`[RegionActions.get] - ${error}`);
  }
};

/**
 *
 */
const getMany = async (regionKeys: string[]): Promise<Region[] | undefined> => {
  try {
    return await db
      .selectFrom("Regions")
      .selectAll()
      .where("Regions.key", "in", regionKeys)
      .execute();
  } catch (error: any) {
    console.log(`[RegionActions.getMany] - ${error}`);
  }
};

const updateDigs = async (regionKey: string, digs: string): Promise<string | undefined> => {
  try {
    const result = await db
      .updateTable("Regions")
      .where("key", "=", regionKey)
      .set({ digs: digs })
      .returning("digs")
      .executeTakeFirstOrThrow();
    return result.digs;
  } catch (error: any) {
    console.log(`[RegionActions.getMany] - ${error}`);
  }
};

export const RegionDatabase = {
  create,
  get,
  getDigs,
  getMany,
  updateDigs,
};
