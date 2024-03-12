// Modules
import jwt from "jsonwebtoken";
import logger from "src/service/server/logging.service";

import { db } from "./client/db";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

// Types and constants
import { Player, PlayerUpdate } from "./models/player.model";
import { ResourceDatabase } from "./resource.database";

/**
 *
 */
const create = async (): Promise<Player | undefined> => {
  try {
    return await db.transaction().execute(async trx => {
      const player = await trx
        .insertInto("Players")
        .values({
          name: "anonymous",
          password: uuidv4(),
          token: uuidv4(),
        })
        .returningAll()
        .executeTakeFirstOrThrow();

      const inventory = await ResourceDatabase.create(player.id);
      console.log("inv", inventory);
      return player;
    });
  } catch (error: any) {
    logger.error(`[PlayerDatabase.create] - ${error}`);
  }
};

/**
 *
 */
const getById = async (id: string): Promise<Player | undefined> => {
  try {
    return await db
      .selectFrom("Players")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirstOrThrow();
  } catch (error: any) {
    logger.error(`[PlayerDatabase.getById] - ${error}`);
  }
};

/**
 *
 */
const getByToken = async (token: string): Promise<Player | undefined> => {
  try {
    return await db
      .selectFrom("Players")
      .selectAll()
      .where("token", "=", token)
      .executeTakeFirstOrThrow();
  } catch (error: any) {
    logger.error(`[PlayerDatabase.getByToken] - ${error}`);
  }
};

/**
 *
 */
const register = async (
  name: string,
  password: string,
  token: string,
  email?: string
): Promise<Player | undefined> => {
  try {
    return await db
      .updateTable("Players")
      .where("token", "=", token)
      .set({
        name: name,
        password: password,
        // TODO: Change "temp" to an actual secret key stored in an env
        token: jwt.sign({ name: name, password: password }, "temp", {
          expiresIn: "7d",
        }),
        email: email,
        registered: true,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
  } catch (error: any) {
    logger.error(`[PlayerDatabase.register] - ${error}`);
  }
};

/**
 *
 */
const changePassword = async (token: string, password: string): Promise<boolean | undefined> => {
  try {
    await db
      .updateTable("Players")
      .where("token", "=", token)
      .set({
        password: password,
      })
      .executeTakeFirstOrThrow();
    return true;
  } catch (error: any) {
    logger.error(`[PlayerDatabase.changePassword] - ${error}`);
    return false;
  }
};

export const PlayerDatabase = {
  create,
  getById,
  getByToken,
  register,
  changePassword,
};
