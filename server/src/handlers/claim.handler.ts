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
import type { ClaimRequest, UpdateDigResponse } from "$shared/messages";
import type { Server } from "socket.io";
import { DIG_HEIGHT, DIG_WIDTH } from "$shared/constants";
import { Location, SelectedDig } from "$shared/types";
import { ClaimDatabase } from "src/database/claim.database";
import { Conversion } from "$shared/conversion";
import { Region } from "$shared/models";
import { RegionDatabase } from "src/database/region.database";
import { Post } from "src/types";

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

  digs.forEach(dig => {
    if (minX == undefined || dig.loc.x < minX) {
      minX = dig.loc.x;
    }
    if (minY == undefined || dig.loc.y < minY) {
      minY = dig.loc.y;
    }
  });

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

/**
 *
 */
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

const createPost = (topLeftLoc: Location, width: number, height: number): Post => {
  const postKey: string = `${Conversion.toDigLocationGlobal(topLeftLoc).x}${
    Conversion.toDigLocationGlobal(topLeftLoc).y
  }`;
  return { postKey: postKey, loc: topLeftLoc, width, height, content: "" };
};

/**
 *
 */
const claim = async (io: Server, request: ClaimRequest) => {
  const dimMap = createDimensionMap(request.digs);
  const topLeftLoc = getTopLeftLocation(request.digs);
  const areValid = areDimensionsValid(dimMap, request.width, request.height);

  if (areValid && topLeftLoc) {
    const post = createPost(topLeftLoc, request.width, request.height);
    const postRegionKey = Conversion.toRegionKey(topLeftLoc);
    const keyLocMap = createKeyLocMap(request);
    const updateDigResponses = await ClaimDatabase.create(keyLocMap, post, postRegionKey);

    if (updateDigResponses) {
      io.to(postRegionKey).emit("update-posts", { regionKey: postRegionKey, post: post });
      for (const { regionKey, digs } of updateDigResponses) {
        io.to(regionKey).emit("update-digs", { regionKey: regionKey, digs: digs });
      }
    }
  }
};

export const ClaimHandler = {
  claim,
};
