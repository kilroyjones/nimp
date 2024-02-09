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
    return db.transaction().execute(async trx => {
      const regionKeySaved = Conversion.toRegionKey(topLeftLoc);
      let regions: Region[] = [];

      for (const [key, locations] of keyLocMap.entries()) {
        let region = await trx
          .selectFrom("Regions")
          .selectAll()
          .where("key", "=", key)
          .executeTakeFirst();
        if (!region) {
          return undefined;
        }

        const updatedRegion = claimDigs(locations, region);
        if (!updatedRegion) {
          return undefined;
        }

        const updates: Partial<Region> = { digs: updatedRegion.digs };
        if (key === regionKeySaved) {
          updates.posts = addPost(updatedRegion, topLeftLoc, width, height);
        }

        const result = await trx
          .updateTable("Regions")
          .where("key", "=", key)
          .set(updates)
          .returningAll()
          .execute();
        regions = regions.concat(result);
      }

      return regions;
    });
  } catch (error) {
    return undefined;
  }
};

export const ClaimDatabase = {
  create,
};
