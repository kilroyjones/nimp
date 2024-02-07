import logger from "src/service/server/logging.service";

import { Conversion } from "$shared/conversion";
import { db } from "./client/db";
import { Location } from "$shared/types";
import { Region } from "./models/region.model";
import { Data } from "$shared/data";
import { DigStatus } from "$shared/constants";

const create = async (keyLocMap: Map<string, Location[]>): Promise<Region | undefined> => {
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

        console.log(key);
        const r = await trx
          .updateTable("Regions")
          .where("key", "=", key)
          .set({ digs: region.digs })
          .returningAll()
          .execute();
        console.log(r);
      }
    });
  } catch (error: any) {}
};

export const ClaimDatabase = {
  create,
};
