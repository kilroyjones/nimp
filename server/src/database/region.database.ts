// Modules
import { Conversion } from "$shared/conversion";
import { db } from "./client/db";
import { Location } from "$shared/types";
import { Region } from "./models/region.model";
import { REGION_WIDTH_DIGS, REGION_HEIGHT_DIGS } from "$shared/constants";
import { UpdateResult, sql } from "kysely";

import logger from "src/service/server/logging.service";

// Types and constants
import type { Post } from "$shared/types";

/**
 * Asynchronously creates a new region with specified details.
 *
 * @param {string} userId - The unique identifier of the user creating the region.
 * @param {string} regionKey - The key identifier for the new region.
 * @param {Location} loc - The location (x, y) of the region.
 * @returns {Promise<Region | undefined>} A promise that resolves to the newly created Region object, or undefined if the operation fails.
 * @throws Will log an error to the logger if the database operation fails.
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
 * Asynchronously retrieves an individual 'post' from the JSON posts field.
 *
 * @param {string} regionKey - The key identifier of the region.
 * @param {string} postKey - The key identifier of the post.
 * @returns {Promise<Post | undefined>}
 * @throws Logs an error to the logger if the database operation fails.
 *
 */
const getPost = async (
  regionKey: string,
  postKey: string
): Promise<{ [x: string]: any } | undefined> => {
  try {
    return await db
      .selectFrom("Regions")
      .select(eb =>
        eb
          .ref("posts", "->")
          .key(postKey as any)
          .as(postKey)
      )
      .where("key", "=", regionKey)
      .executeTakeFirstOrThrow();
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
    return await db
      .updateTable("Regions")
      .set(eb => ({
        posts: eb.fn("jsonb_set", [
          eb.ref("posts"),
          sql.lit(`{${postKey}, "content"}`),
          eb.val(JSON.stringify(content)),
        ]),
      }))
      .where("key", "=", regionKey)
      .execute();
  } catch (error: any) {
    logger.error(`[RegionActions.updatePost] - ${error}`);
  }
};

const addPost = async (regionKey: string, post: Post): Promise<UpdateResult[] | undefined> => {
  try {
    const path = `{"${post.key}"}`;
    const newValueJson = JSON.stringify(post);
    return await db
      .updateTable("Regions")
      .set({
        posts: sql`jsonb_set(posts, ${sql.lit(path)}, ${sql.lit(newValueJson)}::jsonb, true)`,
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
  getPost,
  getMany,
  updateDigs,
  updatePost,
};
