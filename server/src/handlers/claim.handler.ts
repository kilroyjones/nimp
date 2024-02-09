/**
 *
 * TODO:
 *  - Transfer the parsing of Digs to the key->locs list to the front side to
 *  trim down computations on this side.
 *
 * - Combine the getTopLeftLocation with createDimensionMap if this stays after
 * the above bullet it handles.
 *
 */
// Modules
import logger from "../service/server/logging.service";

// Types
import type { ClaimRequest } from "$shared/messages";
import type { Server } from "socket.io";
import { DIG_HEIGHT, DIG_WIDTH } from "$shared/constants";
import { Location, SelectedDig } from "$shared/types";
import { ClaimDatabase } from "src/database/claim.database";
import { Conversion } from "$shared/conversion";

/**
 *
 */
const createDimensionMap = (digs: SelectedDig[]): Map<number, number> => {
  let dimMap: Map<number, number> = new Map();

  digs.forEach(dig => {
    const height = dimMap.get(dig.loc.x);
    if (height) {
      dimMap.set(dig.loc.x, height + 1);
    } else {
      dimMap.set(dig.loc.x, 1);
    }
  });
  return dimMap;
};

/**
 *
 */
const getTopLeftLocation = (digs: SelectedDig[]): Location | undefined => {
  let minX: number | undefined;
  let minY: number | undefined;

  console.log(digs);
  digs.forEach(dig => {
    if (minX == undefined || dig.loc.x < minX) {
      minX = dig.loc.x;
    }
    if (minY == undefined || dig.loc.y < minY) {
      minY = dig.loc.y;
    }
  });

  console.log(minX, minY);
  if (minX != undefined && minY != undefined) {
    return Conversion.toLocation(minX, minY);
  }
};

/**
 *
 */
const areDimensionsValid = (
  dimMap: Map<number, number>,
  width: number,
  height: number
): boolean => {
  if (dimMap.size != Math.floor(width / DIG_WIDTH)) {
    return false;
  }

  let values = Array.from(dimMap.values());
  if (values.every(value => value == values[0]) == false) {
    return false;
  }

  if (values[0] != Math.floor(height / DIG_HEIGHT)) {
    return false;
  }

  const keys = Array.from(dimMap.keys()).sort((a, b) => a - b);
  for (let i = 0; i < keys.length - 1; i++) {
    if (keys[i] + DIG_WIDTH != keys[i + 1]) {
      return false;
    }
  }

  return true;
};

const createKeyLocMap = (request: ClaimRequest): Map<string, Location[]> => {
  let keyIndexMap: Map<string, Array<Location>> = new Map();
  request.digs.forEach(dig => {
    const arr = keyIndexMap.get(dig.key);
    if (arr) {
      keyIndexMap.set(dig.key, arr.concat(dig.loc));
    } else {
      keyIndexMap.set(dig.key, new Array(dig.loc));
    }
  });
  return keyIndexMap;
};

const validate = async (request: ClaimRequest) => {
  const dimMap = createDimensionMap(request.digs);
  const topLeftLoc = getTopLeftLocation(request.digs);
  const result = areDimensionsValid(dimMap, request.width, request.height);
  console.log(result, topLeftLoc, dimMap);
  if (result && topLeftLoc) {
    const keyLocMap = createKeyLocMap(request);
    await ClaimDatabase.create(keyLocMap, topLeftLoc, request.width, request.height);
  }

  // const locs = new Array(request.digs.map(dig => dig.loc));
};

const claim = async (io: Server, request: ClaimRequest) => {
  validate(request);
  logger.info(`[Action.dig] - ${request}`);
};

export const ClaimHandler = {
  claim,
};
