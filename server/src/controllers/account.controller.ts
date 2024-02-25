import { Request, Response } from "express";
import { PlayerDatabase } from "src/database/player.database";
import { sendError, sendNotFound, sendOk } from "src/helpers/response.helper";

/**
 *
 */
const create = async (req: Request, res: Response) => {
  const player = await PlayerDatabase.create();

  if (player) {
    return sendOk(res, { id: player.id, name: player.name });
  }

  return sendError(res, "Failed to create user");
};

/**
 *
 */
const get = async (req: Request, res: Response) => {
  const playerId = req.params.id;
  const player = await PlayerDatabase.get(playerId);

  if (player) {
    return sendOk(res, { id: player.id, name: player.name });
  }
  return sendNotFound(res, "No user found");
};

export const AccountController = {
  create,
  get,
};
