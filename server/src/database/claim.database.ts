import logger from "src/service/server/logging.service";

import { Conversion } from "$shared/conversion";
import { db } from "./client/db";
import { Location } from "$shared/types";
import { Region } from "./models/region.model";
import { Data } from "$shared/data";
import { RegionDatabase } from "./region.database";
import { UpdateDigResponse } from "$shared/messages";
import { Post } from "src/types";

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
  }
  return region;
};

/**
 *
 */
const create = async (
  keyLocMap: Map<string, Location[]>,
  post: Post,
  postRegionKey: string
): Promise<UpdateDigResponse[] | undefined> => {
  try {
    let updateDigResponses: UpdateDigResponse[] = [];

    const regionKeys = Array.from(keyLocMap.keys());

    await db.transaction().execute(async trx => {
      const regions = await trx
        .selectFrom("Regions")
        .selectAll()
        .where("key", "in", regionKeys)
        .execute();

      for (const region of regions) {
        const locations = keyLocMap.get(region.key);
        if (!locations) {
          continue;
        }

        const updatedRegion = claimDigs(locations, region);
        if (!updatedRegion) {
          return undefined;
        }

        if (region.key === postRegionKey) {
          await RegionDatabase.addPost(region.key, post);
        }

        updateDigResponses.push({ regionKey: region.key, digs: updatedRegion.digs });
      }

      for (const dig of updateDigResponses) {
        RegionDatabase.updateDigs(dig.regionKey, dig.digs);
      }

      // TODO: Fix this by using a single list of keys to get the update records
      // OR by returning them on each update and compiling them. This whole shit is inefficient
    });
    return updateDigResponses;
  } catch (error) {
    console.error("Error", error);
    return undefined;
  }
};

export const ClaimDatabase = {
  create,
};
