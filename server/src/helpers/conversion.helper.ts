import { REGION_WIDTH, REGION_HEIGHT } from "../constants";
import { Location } from "$shared/models";

/**
 *
 */
const toRegionKey = (loc: Location): string => {
  return Math.floor(loc.x / REGION_WIDTH).toString() + Math.floor(loc.y / REGION_HEIGHT).toString();
};

/**
 *
 */
const toRegionLocation = (loc: Location): Location => {
  return { x: Math.floor(loc.x / REGION_WIDTH), y: Math.floor(loc.y / REGION_HEIGHT) };
};

export const Conversion = {
  toRegionKey,
  toRegionLocation,
};
