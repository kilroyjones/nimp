import logger from "src/service/server/logging.service";

import { Conversion } from "$shared/conversion";
import { db } from "./client/db";
import { Location } from "$shared/types";
import { Region } from "./models/region.model";
import { Data } from "$shared/data";
import { DigStatus } from "$shared/constants";

type Post = {
  loc: Location;
  width: number;
  height: number;
};

type PostsMap = Record<string, Post>;

/**
 *
 */
const addPost = (region: Region, topLeftLoc: Location, width: number, height: number): any => {
  const postKey: string = `${Conversion.toDigLocationLocal(topLeftLoc, region).x}${
    Conversion.toDigLocationLocal(topLeftLoc, region).y
  }`;

  const postValue: Post = { loc: topLeftLoc, width, height };
  const posts: PostsMap = region.posts as any;

  if (!posts[postKey]) {
    posts[postKey] = postValue;
  }

  return posts;
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
    region.digs = Data.setCharAt(region.digs, idx, DigStatus.CLAIMED);
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
        if (!locations) continue;

        const updatedRegion = claimDigs(locations, region);
        if (!updatedRegion) {
          return undefined;
        }

        if (region.key === Conversion.toRegionKey(topLeftLoc)) {
          updatedRegion.posts = addPost(updatedRegion, topLeftLoc, width, height);
        }

        updatedRegions.push(updatedRegion);
      }

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
