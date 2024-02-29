// Modules
import * as bcrypt from "bcrypt";

import { PlayerDatabase } from "src/database/player.database";
import { Request, Response } from "express";
import { sendError, sendNotFound, sendOk } from "src/helpers/response.helper";

const nameRegex = /^[A-Za-z0-9]+$/;
/**
 *
 */
const create = async (req: Request, res: Response) => {
  const player = await PlayerDatabase.create();

  if (player) {
    return sendOk(res, {
      id: player.id,
      token: player.token,
      name: player.name,
      registered: player.registered,
    });
  }

  return sendError(res, "Failed to create user");
};

/**
 *
 */
const get = async (req: Request, res: Response) => {
  const playerId = req.params.id;
  const player = await PlayerDatabase.getById(playerId);

  if (player) {
    return sendOk(res, {
      id: player.id,
      name: player.name,
      registered: player.registered,
    });
  }
  return sendNotFound(res, "No user found");
};

/**
 *
 */
const updateName = async (req: Request, res: Response) => {
  const data = req.body;
};

/**
 * TODO: centralize this?
 */
const validatePlayerDetails = (name: string, password: string): { err: boolean; msg: string } => {
  if (password.length < 1 || password.length > 255) {
    return { err: true, msg: "Password must be between 1 to 255 characters." };
  }
  if (name.length < 2) {
    return { err: true, msg: "Name mustbe at least 2 characters." };
  } else if (!nameRegex.test(name)) {
    return { err: true, msg: "Name can be letters and numbers only." };
  } else if (name.length == 27) {
    return { err: true, msg: "Max length for name is 27 characters" };
  }
  return { err: false, msg: "" };
};

/**
 *
 */
const register = async (req: Request, res: Response) => {
  console.log(req.body);
  const data = req.body;
  console.log(data);
  const player = await PlayerDatabase.getByToken(data.token);
  // TODO: CHECK IF PLAYER ALREADY REGISTER
  if (player) {
    const { err, msg } = validatePlayerDetails(data.name, data.password);
    console.log(err, msg);
    if (err) {
      return sendError(res, msg);
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    console.log(passwordHash);
    const securedPlayer = await PlayerDatabase.register(data.name, passwordHash, data.token);
    console.log(securedPlayer);

    if (securedPlayer) {
      return sendOk(res, securedPlayer);
    }
    return sendError(res, "Error registering account");
  }
};

export const AccountController = {
  create,
  get,
  register,
  updateName,
};
