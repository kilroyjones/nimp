import logger from "src/service/server/logging.service";

import { Conversion } from "$shared/conversion";
import { db } from "./client/db";
import { Location } from "$shared/types";
import { Region } from "./models/region.model";
import { Data } from "$shared/data";
import { DigStatus } from "$shared/constants";
import { sql } from "kysely";

const create = async (
  keyLocMap: Map<string, Location[]>,
  topLeftLoc: Location,
  width: number,
  height: number
): Promise<Region | undefined> => {
  try {
    return await db.transaction().execute(async trx => {
      for (const [key, locations] of keyLocMap.entries()) {
        const region = await trx
          .selectFrom("Regions")
          .selectAll()
          .where("key", "=", key)
          .executeTakeFirst();

        if (region == undefined) {
          return undefined;
        }

        for (const loc of locations) {
          const idx = Conversion.locationToDigIndex(loc, region);
          if (Data.isUnclaimed(idx, region) == false) {
            return undefined;
          }
          region.digs = Data.setCharAt(region.digs, idx, DigStatus.CLAIMED);
        }

        /////////////////////////////////////////////////////////
        // TODO: ugly, so clean later
        interface PostValue {
          loc: Location; // Assuming loc is a string, adjust the type as necessary
          width: number;
          height: number;
        }

        type PostsType = {
          [key: string]: PostValue;
        };

        const posts: PostsType = (region.posts as unknown as PostsType) || {};

        const postKey: string =
          Conversion.toDigLocationLocal(topLeftLoc, region).x.toString() +
          Conversion.toDigLocationLocal(topLeftLoc, region).y.toString();
        const postValue: PostValue = {
          loc: topLeftLoc,
          width: width,
          height: height,
        };

        if (region.posts.hasOwnProperty("postKey")) {
          console.log("key exists");
        } else {
          posts[postKey] = postValue;
        }

        console.log("KEY", postKey);
        console.log("VALUE", postValue);
        const r = await trx
          .updateTable("Regions")
          .where("key", "=", key)
          .set({
            digs: region.digs,
            posts: posts as any,
          })
          .returningAll()
          .execute();
        console.log("REGION UPDATED: ", r);
      }
    });
  } catch (error: any) {
    console.log("Error", error);
  }
};

export const ClaimDatabase = {
  create,
};
