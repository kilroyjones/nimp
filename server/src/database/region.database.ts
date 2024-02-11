import logger from "src/service/server/logging.service";

import { Conversion } from "$shared/conversion";
import { db } from "./client/db";
import { Location } from "$shared/types";
import { Region, RegionUpdate } from "./models/region.model";
import { REGION_WIDTH_DIGS, REGION_HEIGHT_DIGS } from "$shared/constants";
import { Regions } from "./types/types";
import { UpdateResult, sql } from "kysely";
import { Post } from "./claim.database";

/**
 * Asynchronously creates a new region with specified details.
 *
 * @param {string} userId - The unique identifier of the user creating the region.
 * @param {string} regionKey - The key identifier for the new region.
 * @param {Location} loc - The location (x, y) of the region.
 * @returns {Promise<Region | undefined>} A promise that resolves to the newly created Region object, or undefined if the operation fails.
 * @throws Will log an error to the logger if the database operation fails.
 *
 * The function converts the provided location to a region location, inserts a
 * new record into the 'Regions' table of the database with the provided
 * details, and returns the newly created region.
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
        digs: "0".repeat(REGION_WIDTH_DIGS * REGION_HEIGHT_DIGS),
        posts: {} as JSON,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
  } catch (error: any) {
    logger.error(`[RegionActions.create] - ${error}`);
  }
};

/**
 * Asynchronously retrieves a region by its key.
 *
 * @param {string} regionKey - The key identifier of the region to retrieve.
 * @returns {Promise<Region | undefined>} A promise that resolves to the Region object if found, or undefined if not found or if an error occurs.
 * @throws Logs an error to the logger if the database operation fails.
 *
 * This function searches the 'Regions' table in the database for a region with
 * the specified key and returns the corresponding region object.
 */
const get = async (regionKey: string): Promise<Region | undefined> => {
  try {
    return await db
      .selectFrom("Regions")
      .selectAll()
      .where("key", "=", regionKey)
      .executeTakeFirstOrThrow();
  } catch (error: any) {
    logger.error(`[RegionActions.get] - ${error}`);
  }
};

/**
 * Asynchronously retrieves the 'digs' value for a specific region.
 *
 * @param {string} regionKey - The key identifier of the region for which to retrieve the 'digs' value.
 * @returns {Promise<string | undefined>} A promise that resolves to the 'digs' string of the region if found, or undefined if not found or if an error occurs.
 * @throws Logs an error to the logger if the database operation fails.
 *
 * This function queries the 'Regions' table in the database for the 'digs'
 * field of a specific region identified by the given key.
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
    logger.error(`[RegionActions.getDigs] - ${error}`);
  }
};

/**
 * Asynchronously retrieves multiple regions based on an array of region keys.
 *
 * @param {string[]} regionKeys - An array of key identifiers for the regions to retrieve.
 * @returns {Promise<Region[] | undefined>} A promise that resolves to an array of Region objects if found, or undefined if an error occurs.
 * @throws Logs an error to the logger if the database operation fails.
 *
 * This function fetches multiple regions from the 'Regions' table in the
 * database where the region keys match those provided in the array.
 */
const getMany = async (regionKeys: string[]): Promise<Region[] | undefined> => {
  try {
    return await db
      .selectFrom("Regions")
      .selectAll()
      .where("Regions.key", "in", regionKeys)
      .execute();
  } catch (error: any) {
    logger.error(`[RegionActions.getMany] - ${error}`);
  }
};

/**
 * Asynchronously updates the 'digs' value of a specific region.
 *
 * @param {string} regionKey - The key identifier of the region to update.
 * @param {string} digs - The new 'digs' value to set for the region.
 * @returns {Promise<string | undefined>} A promise that resolves to the updated 'digs' string of the region, or undefined if an error occurs.
 * @throws Logs an error to the logger if the database operation fails.
 *
 * This function updates the 'digs' field in the 'Regions' table of the database
 * for a specific region identified by the given key. The function returns the
 * updated 'digs' value.
 */
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
    logger.error(`[RegionActions.updateDigs] - ${error}`);
  }
};

const updatePost = async (
  regionKey: string,
  postKey: string,
  content: string
): Promise<UpdateResult[] | undefined> => {
  try {
    const path = `{${postKey}, "content"}`;
    const newValueJson = JSON.stringify(content);
    console.log(path, newValueJson);
    return await db
      .updateTable("Regions")
      .set(eb => ({
        posts: eb.fn("jsonb_set", [
          eb.ref("posts"),
          sql.lit(`{${postKey}, "content"}`),
          eb.val(JSON.stringify(content)),
        ]),
      }))
      // posts: sql`jsonb_set(posts, ${sql.lit(path)}, ${sql.lit(newValueJson)}::jsonb, false)`,
      .where("key", "=", regionKey)
      .execute();
  } catch (error: any) {
    logger.error(`[RegionActions.updatePost] - ${error}`);
  }
};

const addPost = async (regionKey: string, post: Post): Promise<UpdateResult[] | undefined> => {
  try {
    const path = `{"${post.postKey}"}`;
    const newValueJson = JSON.stringify(post);
    console.log(path, newValueJson);
    return await db
      .updateTable("Regions")
      .set({
        posts: sql`jsonb_set(posts, ${sql.lit(path)}, ${sql.lit(newValueJson)}::jsonb, true)`,
        // posts: JSON.stringify({ asdf: "asdfa" }) as unknown as JSON,
      })
      .where("key", "=", regionKey)
      .execute();
  } catch (error: any) {
    logger.error(`[RegionActions.updatePost] - ${error}`);
  }
  return undefined;
};

export const RegionDatabase = {
  addPost,
  create,
  get,
  getDigs,
  getMany,
  updateDigs,
  updatePost,
};

// await db
//   .updateTable("user")
//   .set((eb) => ({
//     configurations: eb.fn("json_set", [
//       eb.ref("configurations"),
//       sql.lit("$.lastData.bla"), // we've got a type-safe way to do json paths, needs to be exposed in the future. for now a non type-safe literal.
//       eb.val("blabla"), // val since eb.fn expects references by default.
//     ]),
//   }))
//   .set((eb) => ({
//     configurations: eb.fn("json_set", [
//       eb.ref("configurations"),
//       sql.lit("$.lastData.blub"),
//       eb.val("blublub"),
//     ]),
//   }))
//   .where("id", "=", "123")
//   .execute()

// https://kyse.link/?p=s&i=7psWb88kLpWfSpvwXUyt

// Lemme know if that worked for you.
// Nibyc
// OP
//  — 12/02/2023 6:00 AM
// i was able to solve it with a
// set({
//    configuration: sql`JSON_SET(`...
