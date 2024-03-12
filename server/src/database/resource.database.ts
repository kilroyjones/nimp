// Modules
import logger from "src/service/server/logging.service";

import { db } from "./client/db";
import { Resource } from "$shared/models";
import { UpdatedResources } from "./models/resource.model";

// Types and constants

/**
 *
 */
const create = async (playerId: string): Promise<Resource | undefined> => {
  try {
    return await db
      .insertInto("Resources")
      .values({ id: playerId, dirt: 0 })
      .returning(["dirt"])
      .executeTakeFirstOrThrow();
  } catch (error: any) {
    logger.error(`[ResourceDatabase.create] - ${error}`);
  }
};

/**
 *
 */
const add = async (
  playerId: string,
  updatedResources: UpdatedResources
): Promise<Resource | undefined> => {
  const updateOperation = (
    Object.keys(updatedResources) as Array<keyof typeof updatedResources>
  ).reduce((acc, key) => {
    if (updatedResources[key] !== undefined) {
      acc[key] = (eb: any) => eb(key, "+", updatedResources[key] as any);
    }
    return acc;
  }, {} as Record<string, (eb: any) => any>);
  console.log(updateOperation);
  try {
    return await db
      .updateTable("Resources")
      .where("id", "=", playerId)
      .set((eb: any) => updateOperation)
      .returning(["dirt"])
      .executeTakeFirstOrThrow();
  } catch (error: any) {
    logger.error(`[InventoryDatabase.addDirt] - ${error}`);
  }
};

export const ResourceDatabase = {
  create,
  add,
};
