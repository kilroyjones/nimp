import logger from "src/service/server/logging.service";

import { Conversion } from "$shared/conversion";
import { db } from "./client/db";
import { Location } from "$shared/types";
import { Region } from "./models/region.model";
import { Data } from "$shared/data";
import { DigStatus } from "$shared/constants";
import { RegionDatabase } from "./region.database";

export type Post = {
  postKey: string;
  loc: Location;
  width: number;
  height: number;
  content: string;
};

type PostsMap = Record<string, Post>;

/**
 *
 * TODO: Convert to local coordinates to save bandwidth?
 */
const addPost = (region: Region, topLeftLoc: Location, width: number, height: number): Post => {
  const postKey: string = `${Conversion.toDigLocationGlobal(topLeftLoc).x}${
    Conversion.toDigLocationGlobal(topLeftLoc).y
  }`;
  return { postKey: postKey, loc: topLeftLoc, width, height, content: "" };
};

/**
 *
 */
const claimDigs = (locations: Location[], region: Region): Region | undefined => {
  for (const loc of locations) {
    const idx = Conversion.locationToDigIndex(loc, region);
    if (!Data.isUnclaimed(idx, region)) {
      return undefined;
    }
    region.digs = Data.setCharAt(region.digs, idx, "2");
    console.log("digs:", region.digs);
  }
  return region;
};

/**
 *
 */
const create = async (
  keyLocMap: Map<string, Location[]>,
  topLeftLoc: Location,
  width: number,
  height: number
): Promise<Region[] | undefined> => {
  try {
    const regionKeys = Array.from(keyLocMap.keys());
    const regionsToUpdate = await db.transaction().execute(async trx => {
      const regions = await trx
        .selectFrom("Regions")
        .selectAll()
        .where("key", "in", regionKeys)
        .execute();

      let updatedRegions: Region[] = [];

      for (const region of regions) {
        const locations = keyLocMap.get(region.key);
        if (!locations) {
          continue;
        }

        const updatedRegion = claimDigs(locations, region);
        if (!updatedRegion) {
          return undefined;
        }

        if (region.key === Conversion.toRegionKey(topLeftLoc)) {
          const post = addPost(updatedRegion, topLeftLoc, width, height);
          console.log("F", post);

          const up = await RegionDatabase.addPost(region.key, post);
          console.log(up);
        }

        updatedRegions.push(updatedRegion);
      }

      for (const region of updatedRegions) {
        RegionDatabase.updateDigs(region.key, region.digs);
      }

      // TODO: Fix this by using a single list of keys to get the update records
      // OR by returning them on each update and compiling them. This whole shit is inefficient
      return updatedRegions;
    });

    return regionsToUpdate;
  } catch (error) {
    console.error("Error", error);
    return undefined;
  }
};

export const ClaimDatabase = {
  create,
};
